"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { WhistleblowerReport, ReportCategory } from "@/types";

export interface ReportsResponse {
  success: boolean;
  reports: WhistleblowerReport[];
  error?: string;
}

/**
 * Busca denúncias da empresa autenticada do Supabase.
 * Filtra estritamente por company_id.
 */
export async function getReportsAction(): Promise<ReportsResponse> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, reports: [], error: "Sessão inválida." };
  }

  if (!isSupabaseConfigured) {
    return { success: true, reports: [] };
  }

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("whistleblower_reports")
      .select("*")
      .eq("company_id", admin.companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getReportsAction] Supabase error:", error);
      return { success: false, reports: [], error: error.message };
    }

    return { success: true, reports: (data as WhistleblowerReport[]) ?? [] };
  } catch (err) {
    console.error("[getReportsAction] Exception:", err);
    return { success: false, reports: [], error: "Erro interno ao buscar denúncias." };
  }
}

/**
 * Cria uma denúncia no Supabase para a empresa autenticada.
 */
export async function createReportAction(data: {
  category: ReportCategory;
  description: string;
  is_anonymous: boolean;
  reporter_name?: string;
  reporter_contact?: string;
  evidence_urls?: string[];
}): Promise<{ success: boolean; report?: WhistleblowerReport; protocol?: string; access_key?: string; error?: string }> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida." };
  }

  const { generateProtocol, generateAccessKey } = await import("@/lib/utils");
  const protocol = generateProtocol();
  const accessKey = generateAccessKey();

  const newReport = {
    company_id: admin.companyId,
    protocol,
    access_key: accessKey,
    is_anonymous: data.is_anonymous,
    reporter_name: data.is_anonymous ? null : (data.reporter_name ?? null),
    reporter_contact: data.is_anonymous ? null : (data.reporter_contact ?? null),
    category: data.category,
    description: data.description,
    evidence_urls: data.evidence_urls ?? [],
    status: "RECEBIDA" as const,
    resolution_notes: null,
  };

  if (!isSupabaseConfigured) {
    const { mockStore } = await import("@/lib/mock-data");
    const report = mockStore.createReport({ ...data, company_id: admin.companyId });
    return { success: true, report, protocol: report.protocol, access_key: report.access_key };
  }

  try {
    const db = getSupabaseAdmin();
    const { data: inserted, error } = await db
      .from("whistleblower_reports")
      .insert(newReport)
      .select()
      .single();

    if (error) {
      console.error("[createReportAction] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      report: inserted as WhistleblowerReport,
      protocol: (inserted as WhistleblowerReport).protocol,
      access_key: (inserted as WhistleblowerReport).access_key,
    };
  } catch (err) {
    console.error("[createReportAction] Exception:", err);
    return { success: false, error: "Erro interno ao registrar denúncia." };
  }
}
