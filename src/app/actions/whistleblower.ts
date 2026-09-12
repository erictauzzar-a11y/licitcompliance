"use server";

import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockStore } from "@/lib/mock-data";
import { generateProtocol, generateAccessKey } from "@/lib/utils";
import { ReportCategory, ReportStatus, WhistleblowerReport } from "@/types";

export interface CreateReportInput {
  slug: string;
  is_anonymous: boolean;
  category: ReportCategory;
  description: string;
  reporter_name?: string;
  reporter_contact?: string;
  evidence_urls?: string[];
}

export interface CreateReportResponse {
  success: boolean;
  protocol?: string;
  access_key?: string;
  error?: string;
}

export interface TrackReportResponse {
  success: boolean;
  report?: WhistleblowerReport;
  error?: string;
}

export async function submitWhistleblowerReportAction(
  data: CreateReportInput
): Promise<CreateReportResponse> {
  try {
    const company = mockStore.getCompany(data.slug);
    const protocol = generateProtocol();
    const accessKey = generateAccessKey();

    // 1. Caso o Supabase esteja configurado, tenta persistir com RLS
    if (isSupabaseConfigured && supabase) {
      let companyId = company?.id;

      const { data: compData } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", data.slug)
        .maybeSingle();

      if (compData?.id) {
        companyId = compData.id;
      }

      if (companyId) {
        const { error: insertError } = await supabase
          .from("whistleblower_reports")
          .insert({
            company_id: companyId,
            protocol,
            access_key: accessKey,
            is_anonymous: data.is_anonymous,
            reporter_name: data.is_anonymous ? null : data.reporter_name || null,
            reporter_contact: data.is_anonymous ? null : data.reporter_contact || null,
            category: data.category,
            description: data.description,
            evidence_urls: data.evidence_urls || [],
            status: "RECEBIDA",
          });

        if (insertError) {
          console.warn("[Whistleblower] Supabase insert warning:", insertError.message);
        }
      }
    }

    // 2. Persistência no mockStore em memória
    mockStore.createReport({
      company_id: company?.id,
      category: data.category,
      description: data.description,
      is_anonymous: data.is_anonymous,
      reporter_name: data.reporter_name,
      reporter_contact: data.reporter_contact,
      evidence_urls: data.evidence_urls,
    });

    const latestCreated = mockStore.getReports(company?.id)[0];

    revalidatePath(`/canal/${data.slug}`);
    revalidatePath(`/dashboard/denuncias`);

    return {
      success: true,
      protocol: latestCreated ? latestCreated.protocol : protocol,
      access_key: latestCreated ? latestCreated.access_key : accessKey,
    };
  } catch (err: any) {
    console.error("Error creating report:", err);
    return {
      success: false,
      error: err?.message || "Erro inesperado ao registrar manifestação.",
    };
  }
}

export async function trackWhistleblowerReportAction(
  slug: string,
  protocol: string,
  accessKey: string
): Promise<TrackReportResponse> {
  try {
    const cleanProtocol = protocol.trim().toUpperCase();
    const cleanKey = accessKey.trim();
    const company = mockStore.getCompany(slug);

    if (isSupabaseConfigured && supabase) {
      const { data: dbReport, error } = await supabase
        .from("whistleblower_reports")
        .select("*")
        .eq("protocol", cleanProtocol)
        .eq("access_key", cleanKey)
        .maybeSingle();

      if (dbReport && !error) {
        return {
          success: true,
          report: {
            id: dbReport.id,
            company_id: dbReport.company_id,
            protocol: dbReport.protocol,
            access_key: dbReport.access_key,
            is_anonymous: dbReport.is_anonymous,
            reporter_name: dbReport.reporter_name,
            reporter_contact: dbReport.reporter_contact,
            category: dbReport.category,
            description: dbReport.description,
            evidence_urls: dbReport.evidence_urls || [],
            status: dbReport.status,
            resolution_notes: dbReport.resolution_notes,
            created_at: dbReport.created_at,
            updated_at: dbReport.updated_at,
          },
        };
      }
    }

    const localReport = mockStore.getReportByProtocol(cleanProtocol, cleanKey, company?.id);

    if (localReport) {
      return {
        success: true,
        report: localReport,
      };
    }

    return {
      success: false,
      error: "Protocolo ou chave de acesso não localizados para esta organização.",
    };
  } catch (err: any) {
    console.error("Error tracking report:", err);
    return {
      success: false,
      error: err?.message || "Erro ao consultar protocolo.",
    };
  }
}

export async function updateReportResolutionAction(
  reportId: string,
  status: ReportStatus,
  resolutionNotes: string
) {
  try {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("whistleblower_reports")
        .update({
          status,
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);
    }

    mockStore.updateReportStatus(reportId, status, resolutionNotes);
    revalidatePath("/dashboard/denuncias");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
