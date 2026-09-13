// Tipos e Modelagem para o Motor de Conformidade e Evidenciação (Compliance Engine)

export type PillarCategory =
  | "CODIGO_CONDUTA"
  | "POLITICAS"
  | "TREINAMENTOS"
  | "CANAL_DENUNCIAS"
  | "GESTAO_TERCEIROS"
  | "CONTROLES_INTERNOS"
  | "GESTAO_RISCOS"
  | "MONITORAMENTO"
  | "EVIDENCIAS";

export type RequirementStatus =
  | "ATENDIDO"
  | "PARCIALMENTE_ATENDIDO"
  | "PENDENTE"
  | "NAO_APLICAVEL"
  | "EM_REVISAO";

export type NormativeType =
  | "OBRIGATORIO"
  | "APLICAVEL_CONFORME_CASO"
  | "RECOMENDADO"
  | "REQUER_VALIDACAO_JURIDICA"
  | "NAO_APLICAVEL";

export interface LegalBasis {
  norm: string;
  article: string;
  paragraph?: string;
  type: NormativeType;
  description: string;
  evaluation_rule?: string;
}

export interface ComplianceEvidence {
  id: string;
  title: string;
  type: "DOCUMENTAL" | "SISTEMICA" | "AUDITORIA" | "CERTIFICACAO";
  description: string;
  date: string;
  url?: string;
  file_name?: string;
  file_size?: string;
  hash?: string;
  module_source?: string;
}

export interface ComplianceRequirement {
  id: string;
  pillar: PillarCategory;
  title: string;
  description: string;
  legal_basis: LegalBasis;
  status: RequirementStatus;
  situation_summary: string;
  why_status: {
    evidences_found: string[];
    what_is_missing?: string;
  };
  responsible: string;
  updated_at: string;
  evidences: ComplianceEvidence[];
  action_needed?: string;
  action_href?: string;
  notes?: string;
}

export interface PillarScore {
  pillar: PillarCategory;
  label: string;
  score: number; // 0 a 100
  total_requirements: number;
  met_requirements: number;
  partial_requirements: number;
  pending_requirements: number;
  evidence_count: number;
}

export interface CompliancePendingItem {
  id: string;
  requirement_id: string;
  pillar: PillarCategory;
  title: string;
  severity: "ALERTA" | "CRITICA" | "RECOMENDACAO";
  description: string;
  action_label: string;
  action_href: string;
}

export interface ComplianceDiagnostic {
  company_id: string;
  company_name: string;
  evaluated_at: string;
  overall_score: number; // 0 a 100
  total_requirements: number;
  met_count: number;
  partial_count: number;
  pending_count: number;
  total_evidences: number;
  pillars: Record<PillarCategory, PillarScore>;
  requirements: ComplianceRequirement[];
  pending_items: CompliancePendingItem[];
}

// TIPOS PARA ANÁLISE DE EDITAIS
export type TenderRequirementMatch =
  | "ATENDIDO"
  | "PRECISA_COMPLEMENTAR"
  | "AUSENTE"
  | "NAO_IDENTIFICADO";

export interface TenderRequirementAnalysis {
  id: string;
  title: string;
  category: PillarCategory;
  edict_clause: string;
  edict_quote: string;
  legal_basis: string;
  submission_moment: "HABILITACAO" | "CRITERIO_DESEMPATE" | "POS_CONTRATUAL_6_MESES" | "OUTRO";
  match: TenderRequirementMatch;
  justification: string;
  matching_evidences: string[];
  action_plan?: string;
}

export interface TenderAnalysisResult {
  id: string;
  fileName: string;
  analyzedAt: string;
  tenderNumber?: string;
  organName?: string;
  overallFitScore: number;
  requiresIntegrityProgram: boolean;
  legalBasisMentioned: string[];
  submissionMoment: string;
  requirements: TenderRequirementAnalysis[];
  summary: string;
}

// TIPOS PARA DIAGNÓSTICO ADAPTATIVO E SISTEMA DE MATURIDADE (DECRETO 12.304/2024)
export type DiagnosticAnswerValue =
  | "SIM"
  | "NAO"
  | "PARCIALMENTE"
  | "NAO_SEI"
  | "NAO_APLICAVEL";

export interface DiagnosticAnswer {
  question_id: string;
  step: number;
  answer: DiagnosticAnswerValue;
  notes?: string;
  answered_at: string;
}

export type DiagnosticStatus = "NAO_INICIADO" | "EM_ANDAMENTO" | "CONCLUIDO";

export type CompanyMaturityLevel =
  | "INICIAL"          // 0% a 25%
  | "EM_ESTRUTURACAO" // 26% a 50%
  | "OPERACIONAL"     // 51% a 75%
  | "AVANCADO";       // 76% a 100%

export interface CompanyComplianceProfile {
  company_id: string;
  status: DiagnosticStatus;
  current_step: number;
  total_steps: number;
  answers: Record<string, DiagnosticAnswer>;
  started_at?: string;
  completed_at?: string;
  updated_at: string;
  // Parâmetros de contexto e proporcionalidade (Decreto 12.304/2024)
  company_size_classification?: "ME_EPP" | "MEDIA" | "GRANDE";
  has_high_value_contracts?: boolean; // Contratos > R$ 200 milhões (Art. 25, § 4º Lei 14.133)
  annual_public_bidding_frequency?: "BAIXA" | "MEDIA" | "ALTA";
  third_party_volume?: "BAIXO" | "MEDIO" | "ALTO";
}

export interface ActionPlanItem {
  id: string;
  requirement_id: string;
  pillar: PillarCategory;
  title: string;
  description: string;
  priority: "ALTA" | "MEDIA" | "BAIXA";
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  legal_reference: string;
  action_label: string;
  action_href: string;
  why_is_needed: string;
}

