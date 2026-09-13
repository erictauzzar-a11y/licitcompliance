"use server";

import { cookies } from "next/headers";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { headers } from "next/headers";
import crypto from "crypto";

export interface AuthResponse {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAdminAction(email: string, password: string): Promise<AuthResponse> {
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  // 1. Rate Limiting no Login (Prevenção de Ataques de Força Bruta)
  const rateCheck = checkRateLimit(`login_${ip}`, {
    windowMs: 60000, // 1 minuto
    maxRequests: 5, // Máximo 5 tentativas por minuto
    blockDurationMs: 300000, // Bloqueia 5 minutos se estourar
  });

  if (!rateCheck.success) {
    return {
      success: false,
      error: "Muitas tentativas consecutivas. Por segurança, tente novamente em alguns minutos.",
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // 2. Reconhecimento Direto de Acesso com Assinatura Ativa (eric.tauzz@gmail.com)
  if (cleanEmail === "eric.tauzz@gmail.com" && password === "36821266") {
    const cookieStore = await cookies();

    if (isSupabaseConfigured) {
      try {
        const { getSupabaseAdmin } = await import("@/lib/supabase/client");
        const admin = getSupabaseAdmin();

        // Tenta buscar se o usuário já existe no Supabase Auth
        const { data: userList } = await admin.auth.admin.listUsers();
        let targetUser = userList?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

        if (!targetUser) {
          // Cria usuário provisionado com e-mail confirmado
          const { data: created, error: createErr } = await admin.auth.admin.createUser({
            email: cleanEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
              full_name: "Eric Tauzz",
              subscription_status: "active",
            },
          });
          if (!createErr && created?.user) {
            targetUser = created.user;
          }
        }

        if (targetUser) {
          cookieStore.set("sb-user-id", targetUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
          });

          // Checa se já possui empresa associada
          const { data: profile } = await admin
            .from("profiles")
            .select("company_id")
            .eq("id", targetUser.id)
            .maybeSingle();

          if (profile?.company_id) {
            cookieStore.set("licit_session", profile.company_id, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24,
              path: "/",
            });
            return { success: true, redirectTo: "/dashboard" };
          }
        }
      } catch (e) {
        console.warn("[Auth] Supabase provision fallback:", e);
      }
    }

    // Se ainda não tem empresa criada no Supabase ou offline, estabelece sessão de onboarding
    const sessionToken = `sess_eric_${crypto.randomBytes(16).toString("hex")}`;
    cookieStore.set("licit_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      redirectTo: "/cadastro?checkout=success",
    };
  }

  // 3. Se Supabase estiver conectado, autentica nativamente via Supabase Auth
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data.session) {
      return {
        success: false,
        error: "E-mail ou senha incorretos.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    cookieStore.set("sb-user-id", data.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // Busca perfil da empresa vinculado ao usuário no banco
    const { getSupabaseAdmin } = await import("@/lib/supabase/client");
    const admin = getSupabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("company_id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.company_id) {
      cookieStore.set("licit_session", profile.company_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return { success: true, redirectTo: "/dashboard" };
    }

    return { success: true, redirectTo: "/cadastro?checkout=success" };
  }

  // 4. Fallback para demonstração offline (apenas se Supabase não estiver configurado)
  if (
    cleanEmail === "compliance@translog.com.br" &&
    (password === "TechCompliance#2026" || password === "LicitCompliance#2026")
  ) {
    const cookieStore = await cookies();
    const sessionToken = `sess_${crypto.randomBytes(32).toString("hex")}`;

    cookieStore.set("licit_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, redirectTo: "/dashboard" };
  }

  return {
    success: false,
    error: "Credenciais não reconhecidas para este ambiente.",
  };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete("licit_session");
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-user-id");

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  return { success: true };
}

/**
 * Validação de sessão segura no Servidor (Zero-Trust Frontend)
 * Identifica o usuário e o tenant real associado à sessão diretamente no Supabase.
 */
export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("licit_session")?.value;
  const token = cookieStore.get("sb-access-token")?.value;
  const userId = cookieStore.get("sb-user-id")?.value;

  if (!session && !token && !userId) {
    return null;
  }

  const { isSupabaseConfigured, getSupabaseAdmin } = await import("@/lib/supabase/client");

  // 1. Se autenticado via Supabase
  if (isSupabaseConfigured) {
    const admin = getSupabaseAdmin();

    // 1.1 Se temos o token JWT, valida com Supabase Auth
    let user = null;
    if (token) {
      const { data: authData, error } = await admin.auth.getUser(token);
      if (!error && authData?.user) {
        user = authData.user;
      }
    }

    const currentUserId = user?.id || userId;

    if (currentUserId) {
      // Consulta perfil e empresa correspondente
      const { data: profile } = await admin
        .from("profiles")
        .select("company_id, full_name, role")
        .eq("id", currentUserId)
        .maybeSingle();

      const targetCompanyId = profile?.company_id || session;

      if (targetCompanyId) {
        const { data: companyRow } = await admin
          .from("companies")
          .select("*")
          .eq("id", targetCompanyId)
          .maybeSingle();

        if (companyRow) {
          return {
            userId: currentUserId,
            email: user?.email || companyRow.integrity_officer_email || "gestor@techcompliance.com.br",
            role: profile?.role || "ADMIN",
            companyId: companyRow.id,
            company: companyRow,
          };
        }
      }
    }
  }

  // 2. Fallback de sessão mock
  const { mockStore } = await import("@/lib/mock-data");
  if (session) {
    const company = mockStore.getCompanyBySession(session) || mockStore.getCompany(session);
    return {
      userId: session,
      email: company.integrity_officer_email || "gestor@techcompliance.com.br",
      role: "ADMIN",
      companyId: company.id,
      company,
    };
  }

  return null;
}

/**
 * Retorna os dados da empresa ativa vinculada à sessão autenticada (usado por Client Components)
 */
export async function getActiveAdminCompanyAction() {
  const admin = await getAuthenticatedAdmin();
  if (admin && admin.company) {
    return { success: true, company: admin.company };
  }
  return { success: false, company: null };
}

