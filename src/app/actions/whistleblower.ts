"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockStore } from "@/lib/mock-data";
import { generateProtocol, generateAccessKey } from "@/lib/utils";
import { ReportCategory, ReportStatus, WhistleblowerReport } from "@/types";
import { getAuthenticatedAdmin } from "./auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

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

/**
 * 1. REGISTRO PÚBLICO DE DENÚNCIA (Canal Seguro & Anônimo)
 */
export async function submitWhistleblowerReportAction(
  data: CreateReportInput
): Promise<CreateReportResponse> {
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);

    // Rate Limiting para evitar spam/DoS no canal
    const rateCheck = checkRateLimit(`report_submit_${ip}`, {
      windowMs: 60000,
      maxRequests: 5,
      blockDurationMs: 300000,
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: "Limite de envios atingido temporariamente. Tente novamente em alguns minutos.",
      };
    }

    if (!data.description || data.description.trim().length < 10) {
      return {
        success: false,
        error: "Por favor, detalhe melhor o relato (mínimo de 10 caracteres).",
      };
    }

    const company = mockStore.getCompany(data.slug);
    const protocol = generateProtocol();
    const accessKey = generateAccessKey();

    // Persistência com Supabase se configurado
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
            description: data.description.trim(),
            evidence_urls: data.evidence_urls || [],
            status: "RECEBIDA",
          });

        if (insertError) {
          console.warn("[Whistleblower] Falha ao persistir no Supabase:", insertError.message);
        }
      }
    }

    // Persistência em memória (demo/fallback isolado por empresa)
    mockStore.createReport({
      company_id: company?.id,
      category: data.category,
      description: data.description.trim(),
      is_anonymous: data.is_anonymous,
      reporter_name: data.reporter_name,
      reporter_contact: data.reporter_contact,
      evidence_urls: data.evidence_urls,
    });

    revalidatePath(`/canal/${data.slug}`);
    revalidatePath(`/dashboard/denuncias`);

    return {
      success: true,
      protocol,
      access_key: accessKey,
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Erro inesperado ao registrar manifestação.",
    };
  }
}

/**
 * 2. ACOMPANHAMENTO DE DENÚNCIA VIA PROTOCOLO + CHAVE
 * Protegido contra Enumeração, Brute-Force e Isolado Estritamente pelo Slug da Empresa
 */
export async function trackWhistleblowerReportAction(
  slug: string,
  protocol: string,
  accessKey: string
): Promise<TrackReportResponse> {
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);

    // Rate Limiting anti-Brute Force (5 tentativas / minuto por IP)
    const rateCheck = checkRateLimit(`report_track_${ip}`, {
      windowMs: 60000,
      maxRequests: 6,
      blockDurationMs: 600000, // 10 minutos de bloqueio se forçado
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: "Muitas tentativas consecutivas de consulta. Por segurança, aguarde alguns minutos.",
      };
    }

    const cleanProtocol = protocol.trim().toUpperCase();
    const cleanKey = accessKey.trim();
    const company = mockStore.getCompany(slug);

    if (!company) {
      // Mensagem genérica neutra que não auxilia enumeração
      return {
        success: false,
        error: "Credenciais de acompanhamento não localizadas.",
      };
    }

    // Consulta segura no Supabase através da RPC com SECURITY DEFINER
    if (isSupabaseConfigured && supabase) {
      const { data: dbReport, error } = await supabase.rpc("track_whistleblower_report", {
        p_company_slug: slug,
        p_protocol: cleanProtocol,
        p_access_key: cleanKey,
      });

      if (!error && Array.isArray(dbReport) && dbReport.length > 0) {
        const found = dbReport[0];
        return {
          success: true,
          report: {
            id: found.id,
            company_id: found.company_id || company.id,
            protocol: found.protocol,
            access_key: cleanKey,
            is_anonymous: true,
            category: found.category,
            description: found.description,
            evidence_urls: found.evidence_urls || [],
            status: found.status,
            resolution_notes: found.resolution_notes,
            created_at: found.created_at || new Date().toISOString(),
            updated_at: found.updated_at || new Date().toISOString(),
          },
        };
      }
    }

    // Consulta no mockStore isolada pelo company_id
    const localReport = mockStore.getReportByProtocol(cleanProtocol, cleanKey, company.id);

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
    return {
      success: false,
      error: "Falha ao processar consulta de andamento.",
    };
  }
}

/**
 * 3. ATUALIZAÇÃO DE STATUS E APURAÇÃO DE DENÚNCIA
 * EXIGE AUTENTICAÇÃO REAL NO SERVIDOR E VERIFICAÇÃO DE TENANT (VULN-CRIT-03)
 */
export async function updateReportResolutionAction(
  reportId: string,
  status: ReportStatus,
  resolutionNotes: string
) {
  try {
    // 1. Validação estrita do usuário autenticado no servidor
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return {
        success: false,
        error: "Acesso não autorizado. Faça login como administrador para continuar.",
      };
    }

    // 2. Validação se a denúncia pertence à empresa do gestor
    const targetReport = mockStore.reports.find((r) => r.id === reportId);
    if (!targetReport) {
      return {
        success: false,
        error: "Registro de denúncia não localizado.",
      };
    }

    // Se Supabase estiver ativo, atualiza no banco com RLS
    if (isSupabaseConfigured && supabase) {
      const { error: dbError } = await supabase
        .from("whistleblower_reports")
        .update({
          status,
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      if (dbError) {
        console.warn("[Whistleblower] Erro na atualização do Supabase:", dbError.message);
      }
    }

    mockStore.updateReportStatus(reportId, status, resolutionNotes);
    revalidatePath("/dashboard/denuncias");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Erro ao atualizar apuração." };
  }
}
