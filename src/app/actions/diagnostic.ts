"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockStore } from "@/lib/mock-data";
import {
  CompanyComplianceProfile,
  DiagnosticAnswer,
  DiagnosticAnswerValue,
  DiagnosticStatus,
  ActionPlanItem,
  ComplianceDiagnostic,
} from "@/types/compliance";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/diagnostic-questions";
import { evaluateCompanyCompliance } from "@/lib/compliance-engine";

/**
 * 1. Obtém o Perfil de Diagnóstico e Maturidade da empresa ativa
 */
export async function getCompanyDiagnosticProfileAction(): Promise<{
  success: boolean;
  profile: CompanyComplianceProfile | null;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, profile: null, error: "Sessão não autenticada." };
  }

  const companyId = admin.companyId;

  try {
    if (isSupabaseConfigured) {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("company_diagnostic_profiles")
        .select("*")
        .eq("company_id", companyId)
        .maybeSingle();

      if (!error && data) {
        return {
          success: true,
          profile: {
            company_id: data.company_id,
            status: data.status as DiagnosticStatus,
            current_step: data.current_step || 1,
            total_steps: data.total_steps || 9,
            answers: data.answers || {},
            started_at: data.started_at,
            completed_at: data.completed_at,
            updated_at: data.updated_at,
            company_size_classification: data.company_size_classification,
            has_high_value_contracts: data.has_high_value_contracts,
          },
        };
      }
    }

    // Fallback store seguro (isolado por company_id)
    const localProf = mockStore.getDiagnosticProfile(companyId);
    return { success: true, profile: localProf };
  } catch (err: any) {
    return { success: false, profile: null, error: err?.message || "Erro ao consultar diagnóstico." };
  }
}

/**
 * 2. Salva as respostas de uma etapa específica do questionário de diagnóstico
 */
export async function saveDiagnosticStepAction(
  stepNumber: number,
  stepAnswers: Record<string, { answer: DiagnosticAnswerValue; notes?: string }>
): Promise<{
  success: boolean;
  profile?: CompanyComplianceProfile;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão não autenticada." };
  }

  const companyId = admin.companyId;
  const now = new Date().toISOString();

  try {
    // Recupera perfil existente
    let currentProfile = mockStore.getDiagnosticProfile(companyId);

    const mergedAnswers: Record<string, DiagnosticAnswer> = {
      ...(currentProfile?.answers || {}),
    };

    Object.entries(stepAnswers).forEach(([qId, val]) => {
      mergedAnswers[qId] = {
        question_id: qId,
        step: stepNumber,
        answer: val.answer,
        notes: val.notes,
        answered_at: now,
      };
    });

    const isFinished = stepNumber >= 9 || Object.keys(mergedAnswers).length >= DIAGNOSTIC_QUESTIONS.length;
    const newStatus: DiagnosticStatus = isFinished ? "CONCLUIDO" : "EM_ANDAMENTO";

    const updatedProfile: CompanyComplianceProfile = {
      company_id: companyId,
      status: newStatus,
      current_step: Math.min(9, Math.max(stepNumber + 1, currentProfile?.current_step || 1)),
      total_steps: 9,
      answers: mergedAnswers,
      started_at: currentProfile?.started_at || now,
      completed_at: isFinished ? (currentProfile?.completed_at || now) : undefined,
      updated_at: now,
      company_size_classification: currentProfile?.company_size_classification || "ME_EPP",
      has_high_value_contracts: currentProfile?.has_high_value_contracts ?? false,
    };

    // Salva no mockStore
    mockStore.saveDiagnosticProfile(updatedProfile, companyId);

    // Registra evolução de maturidade
    const diag = evaluateCompanyCompliance(companyId);
    mockStore.addMaturityLog(
      `Etapa ${stepNumber} do Diagnóstico salva (${Object.keys(stepAnswers).length} resposta(s))`,
      diag.overall_score,
      companyId
    );

    // Persiste no Supabase se tabela existir
    if (isSupabaseConfigured) {
      try {
        const db = getSupabaseAdmin();
        await db
          .from("company_diagnostic_profiles")
          .upsert(
            {
              company_id: companyId,
              status: updatedProfile.status,
              current_step: updatedProfile.current_step,
              total_steps: updatedProfile.total_steps,
              answers: updatedProfile.answers,
              started_at: updatedProfile.started_at,
              completed_at: updatedProfile.completed_at,
              updated_at: updatedProfile.updated_at,
            },
            { onConflict: "company_id" }
          );
      } catch {
        // Fallback silencioso caso tabela ainda não esteja no cache do Supabase
      }
    }

    return { success: true, profile: updatedProfile };
  } catch (err: any) {
    return { success: false, error: err?.message || "Erro ao salvar etapa do diagnóstico." };
  }
}

/**
 * 3. Finaliza formalmente o diagnóstico inicial da empresa
 */
export async function completeDiagnosticAction(): Promise<{
  success: boolean;
  score: number;
  profile?: CompanyComplianceProfile;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, score: 0, error: "Sessão não autenticada." };
  }

  const companyId = admin.companyId;
  const currentProfile = mockStore.getDiagnosticProfile(companyId);

  if (!currentProfile) {
    return { success: false, score: 0, error: "Nenhum diagnóstico em andamento." };
  }

  currentProfile.status = "CONCLUIDO";
  currentProfile.completed_at = new Date().toISOString();
  currentProfile.updated_at = new Date().toISOString();

  mockStore.saveDiagnosticProfile(currentProfile, companyId);
  const diag = evaluateCompanyCompliance(companyId);

  mockStore.addMaturityLog(
    "Diagnóstico Inicial de Integridade Concluído com Sucesso",
    diag.overall_score,
    companyId
  );

  return { success: true, score: diag.overall_score, profile: currentProfile };
}

/**
 * 4. Obtém o Plano de Ação Dinâmico derivado dos requisitos e pendências reais
 */
export async function getActionPlanAction(): Promise<{
  success: boolean;
  items: ActionPlanItem[];
  overall_score: number;
  maturity_level: "INICIAL" | "EM_ESTRUTURACAO" | "OPERACIONAL" | "AVANCADO";
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return {
      success: false,
      items: [],
      overall_score: 0,
      maturity_level: "INICIAL",
      error: "Sessão não autenticada.",
    };
  }

  const companyId = admin.companyId;
  const diagnostic = evaluateCompanyCompliance(companyId);

  const planItems: ActionPlanItem[] = [];

  // Converte requisitos não atendidos em itens acionáveis de plano de ação
  diagnostic.requirements.forEach((req) => {
    if (req.status !== "ATENDIDO") {
      let priority: "ALTA" | "MEDIA" | "BAIXA" = "MEDIA";
      if (req.legal_basis.type === "OBRIGATORIO") priority = "ALTA";
      if (req.pillar === "CANAL_DENUNCIAS" || req.pillar === "CODIGO_CONDUTA") priority = "ALTA";

      planItems.push({
        id: `PLAN-${req.id}`,
        requirement_id: req.id,
        pillar: req.pillar,
        title: req.title,
        description: req.why_status.what_is_missing || req.situation_summary,
        priority,
        status: req.status === "PARCIALMENTE_ATENDIDO" ? "EM_ANDAMENTO" : "PENDENTE",
        legal_reference: `${req.legal_basis.norm} (${req.legal_basis.article})`,
        action_label: req.action_href?.includes("biblioteca")
          ? "Adotar Modelo na Biblioteca"
          : req.action_href?.includes("colaboradores")
          ? "Gerenciar Colaboradores"
          : req.action_href?.includes("denuncias")
          ? "Acessar Canal de Denúncias"
          : req.action_href?.includes("due-diligence")
          ? "Consultar no DDI"
          : "Resolver Pendência",
        action_href: req.action_href || "/dashboard/biblioteca",
        why_is_needed: req.legal_basis.description,
      });
    }
  });

  // Determina o nível de maturidade
  let level: "INICIAL" | "EM_ESTRUTURACAO" | "OPERACIONAL" | "AVANCADO" = "INICIAL";
  if (diagnostic.overall_score >= 76) level = "AVANCADO";
  else if (diagnostic.overall_score >= 51) level = "OPERACIONAL";
  else if (diagnostic.overall_score >= 26) level = "EM_ESTRUTURACAO";

  return {
    success: true,
    items: planItems,
    overall_score: diagnostic.overall_score,
    maturity_level: level,
  };
}

/**
 * 5. Retorna o histórico de evolução da maturidade (Linha do Tempo)
 */
export async function getMaturityHistoryAction(): Promise<{
  success: boolean;
  history: Array<{ id: string; event: string; date: string; score: number }>;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, history: [] };
  }

  const logs = mockStore.getMaturityHistory(admin.companyId);
  return { success: true, history: logs };
}

/**
 * 6. Obtém a avaliação completa do Diagnóstico e Indicadores de Conformidade diretamente do servidor
 */
export async function getComplianceDiagnosticAction(): Promise<{
  success: boolean;
  diagnostic: ComplianceDiagnostic | null;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, diagnostic: null, error: "Sessão não autenticada." };
  }

  try {
    const diagnostic = evaluateCompanyCompliance(admin.companyId);
    return { success: true, diagnostic };
  } catch (err: any) {
    return { success: false, diagnostic: null, error: err?.message || "Erro ao avaliar conformidade." };
  }
}
