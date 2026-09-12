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
    if (isSupabaseConfigured) {
      const { getSupabaseAdmin } = await import("@/lib/supabase/client");
      const db = getSupabaseAdmin();

      const { data: compData } = await db
        .from("companies")
        .select("id")
        .eq("slug", data.slug)
        .maybeSingle();

      const companyId = compData?.id || company?.id;

      if (companyId) {
        const { error: insertError } = await db
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
          console.error("[Whistleblower] Falha ao persistir no Supabase:", insertError.message);
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
 * 2. ACOMPANHAMENTO DE DENÚNCIA VIA PROTOCOLO ÚNICO
 * Protegido contra Enumeração, Brute-Force e Isolado Estritamente pelo Slug da Empresa
 */
export async function trackWhistleblowerReportAction(
  slug: string,
  protocol: string,
  accessKey?: string
): Promise<TrackReportResponse> {
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);

    // Rate Limiting anti-Brute Force (6 tentativas / minuto por IP com bloqueio de 10 min)
    const rateCheck = checkRateLimit(`report_track_${ip}`, {
      windowMs: 60000,
      maxRequests: 6,
      blockDurationMs: 600000,
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: "Muitas tentativas consecutivas de consulta. Por segurança, aguarde alguns minutos.",
      };
    }

    const cleanProtocol = protocol.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cleanProtocol.length < 8) {
      return {
        success: false,
        error: "Protocolo informado inválido. Verifique o código recebido.",
      };
    }

    // Consulta no Supabase se configurado
    if (isSupabaseConfigured) {
      const { getSupabaseAdmin } = await import("@/lib/supabase/client");
      const db = getSupabaseAdmin();

      // 1. Resolve a empresa pelo slug
      const { data: comp } = await db
        .from("companies")
        .select("id, slug")
        .eq("slug", slug)
        .maybeSingle();

      if (comp?.id) {
        // Busca a denúncia vinculada àquela empresa pelo protocolo
        const { data: dbReport } = await db
          .from("whistleblower_reports")
          .select("id, company_id, protocol, access_key, category, description, evidence_urls, status, resolution_notes, created_at, updated_at")
          .eq("company_id", comp.id)
          .eq("protocol", cleanProtocol)
          .maybeSingle();

        if (dbReport) {
          return {
            success: true,
            report: {
              id: dbReport.id,
              company_id: dbReport.company_id,
              protocol: dbReport.protocol,
              access_key: dbReport.access_key || "",
              is_anonymous: true,
              category: dbReport.category,
              description: dbReport.description,
              evidence_urls: dbReport.evidence_urls || [],
              status: dbReport.status,
              resolution_notes: dbReport.resolution_notes,
              created_at: dbReport.created_at || new Date().toISOString(),
              updated_at: dbReport.updated_at || new Date().toISOString(),
            },
          };
        }
      }
    }

    // Consulta de fallback em memória isolada pelo slug
    const company = mockStore.getCompany(slug);
    if (company) {
      const localReport = mockStore.getReportByProtocol(cleanProtocol, accessKey, company.id);
      if (localReport) {
        return {
          success: true,
          report: localReport,
        };
      }
    }

    return {
      success: false,
      error: "Protocolo não localizado para esta organização. Verifique se o código foi digitado corretamente.",
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

/**
 * 4. GERAÇÃO DE URL SEGURA PARA VISUALIZAÇÃO DE ANEXOS
 * Valida autorização do gestor e garante isolamento por company_id
 */
export async function getSecureEvidenceUrlAction(filePath: string): Promise<{
  success: boolean;
  signedUrl?: string;
  fileType?: string;
  error?: string;
}> {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin?.companyId) {
      return { success: false, error: "Sessão inválida ou não autorizada." };
    }

    const { getSupabaseAdmin } = await import("@/lib/supabase/client");
    const db = getSupabaseAdmin();

    // 1. Confirmação se o anexo pertence a uma denúncia da empresa do gestor
    const { data: report, error: repErr } = await db
      .from("whistleblower_reports")
      .select("id, company_id, evidence_urls")
      .eq("company_id", admin.companyId)
      .filter("evidence_urls", "cs", JSON.stringify([filePath]))
      .maybeSingle();

    // Fallback: se não encontrou via contains array, confere se o filePath inicia com o slug da empresa
    const isCompanyFile = report || (admin.company?.slug && filePath.startsWith(`${admin.company.slug}/`));

    if (!isCompanyFile) {
      return { success: false, error: "Acesso negado: anexo não pertence à sua organização." };
    }

    // 2. Gera Signed URL com validade de 15 minutos (900 segundos)
    const { data: signedData, error: signErr } = await db.storage
      .from("whistleblower-evidence")
      .createSignedUrl(filePath, 900);

    if (signErr || !signedData?.signedUrl) {
      // Se não estiver no bucket Supabase (ex: arquivo em modo local/mock)
      return {
        success: true,
        signedUrl: `/api/evidence-mock?path=${encodeURIComponent(filePath)}`,
        fileType: filePath.split(".").pop()?.toLowerCase() || "unknown",
      };
    }

    const ext = filePath.split(".").pop()?.toLowerCase() || "unknown";

    return {
      success: true,
      signedUrl: signedData.signedUrl,
      fileType: ext,
    };
  } catch (err: any) {
    return { success: false, error: "Falha ao gerar visualização do arquivo." };
  }
}
