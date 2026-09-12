"use server";

import { cookies } from "next/headers";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { headers } from "next/headers";
import crypto from "crypto";

export interface AuthResponse {
  success: boolean;
  error?: string;
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

  // 2. Se Supabase estiver conectado, autentica via Supabase Auth
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

    cookieStore.set("licit_session", data.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  // 3. Fallback controlado para ambiente local / demo
  // Aceita credencial segura pré-definida ou demonstração
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

    return { success: true };
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
  return { success: true };
}

/**
 * Validação de sessão segura no Servidor (Zero-Trust Frontend)
 * Identifica o usuário e o tenant real associado à sessão.
 */
export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("licit_session")?.value;
  const token = cookieStore.get("sb-access-token")?.value;

  if (!session && !token) {
    return null;
  }

  const { mockStore } = await import("@/lib/mock-data");

  // 1. Se autenticado via Supabase Auth
  if (isSupabaseConfigured && supabase && token) {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      const company = mockStore.getCompany(user.id);
      return {
        userId: user.id,
        email: user.email,
        role: "ADMIN",
        companyId: company.id,
        company,
      };
    }
  }

  // 2. Se autenticado via sessão de tenant
  if (session) {
    const company = mockStore.getCompanyBySession(session) || mockStore.getCompany();
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

