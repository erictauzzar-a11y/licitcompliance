"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { Policy } from "@/types";

export interface PolicyResponse {
  success: boolean;
  policy: Policy | null;
  error?: string;
}

/**
 * Busca a política ativa da empresa autenticada do Supabase.
 */
export async function getPolicyAction(): Promise<PolicyResponse> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, policy: null, error: "Sessão inválida." };
  }

  if (!isSupabaseConfigured) {
    return { success: true, policy: null };
  }

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("policies")
      .select("*")
      .eq("company_id", admin.companyId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[getPolicyAction] Supabase error:", error);
      return { success: false, policy: null, error: error.message };
    }

    if (!data) {
      // Auto-provisiona o Código de Conduta sob medida com a Razão Social da empresa
      const { buildStructuredCodeOfConduct } = await import("@/lib/code-of-conduct-template");
      const companyName = admin.company?.legal_name || admin.company?.trade_name || "Sua Organização";
      const tailoredContent = buildStructuredCodeOfConduct(companyName);
      const tailoredTitle = `Código de Ética, Integridade e Conduta - ${admin.company?.trade_name || companyName}`;

      const { data: createdPolicy, error: insertError } = await db
        .from("policies")
        .insert({
          company_id: admin.companyId,
          title: tailoredTitle,
          content: tailoredContent,
          version: "1.0",
          is_active: true,
          published_to_employees: true,
          approved_by: admin.company?.integrity_officer_name || "Diretoria de Integridade",
          approved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!insertError && createdPolicy) {
        return { success: true, policy: createdPolicy as Policy };
      }
    }

    return { success: true, policy: data as Policy | null };
  } catch (err) {
    console.error("[getPolicyAction] Exception:", err);
    return { success: false, policy: null, error: "Erro interno ao buscar política." };
  }
}

/**
 * Atualiza a política ativa da empresa autenticada no Supabase.
 */
export async function updatePolicyAction(
  content: string,
  title?: string
): Promise<{ success: boolean; policy?: Policy; error?: string }> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida." };
  }

  if (!isSupabaseConfigured) {
    const { mockStore } = await import("@/lib/mock-data");
    const policy = mockStore.updatePolicy(content, title, true, admin.companyId);
    return { success: true, policy };
  }

  try {
    const db = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Busca a versão atual para incrementar
    const { data: current } = await db
      .from("policies")
      .select("version")
      .eq("company_id", admin.companyId)
      .eq("is_active", true)
      .maybeSingle();

    const currentVersion = parseFloat((current as { version?: string })?.version ?? "1.0");
    const newVersion = (currentVersion + 0.1).toFixed(1);

    // Desativa a versão anterior
    await db
      .from("policies")
      .update({ is_active: false, updated_at: now })
      .eq("company_id", admin.companyId)
      .eq("is_active", true);

    // Insere nova versão ativa
    const { data: inserted, error } = await db
      .from("policies")
      .insert({
        company_id: admin.companyId,
        title: title ?? `Código de Ética, Integridade e Conduta`,
        content,
        version: newVersion,
        is_active: true,
        approved_by: admin.email,
        approved_at: now,
        published_to_employees: true,
        published_at: now,
        next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[updatePolicyAction] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, policy: inserted as Policy };
  } catch (err) {
    console.error("[updatePolicyAction] Exception:", err);
    return { success: false, error: "Erro interno ao atualizar política." };
  }
}
