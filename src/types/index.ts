export type TrainingTrack = 'INTEGRIDADE_14133' | 'NR1_ASSEDIO';

export type ReportCategory = 'ASSEDIO_MORAL_SEXUAL' | 'CORRUPCAO_SUBORNO' | 'SEGURANCA_TRABALHO' | 'FRAUDE_LICITACAO' | 'OUTROS';

export type ReportStatus = 'RECEBIDA' | 'EM_ANALISE' | 'PROCEDENTE' | 'IMPROCEDENTE' | 'ARQUIVADA';

export interface CompanyPartner {
  name: string;
  role: string;
  cpf_cnpj_masked?: string;
  age_range?: string;
  entry_date?: string;
}

export interface SecondaryActivity {
  code: number | string;
  description: string;
}

export interface Company {
  id: string;
  trade_name: string;
  legal_name: string;
  cnpj: string;
  slug: string;
  logo_url?: string | null;
  created_at: string;
  // Campos cadastrais oficiais enriquecidos
  status?: string; // Situação cadastral (ex: ATIVA, BAIXADA)
  opening_date?: string; // Data de abertura
  legal_nature?: string; // Natureza jurídica
  company_size?: string; // Porte (ME, EPP, DEMAIS)
  share_capital?: number | string; // Capital social
  headquarters_or_branch?: string; // Matriz ou Filial
  // Endereço detalhado
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  full_address?: string;
  // Atividades econômicas
  main_cnae_code?: string | number;
  main_cnae_description?: string;
  secondary_cnaes?: SecondaryActivity[];
  // Regime tributário
  is_simples_nacional?: boolean | null;
  simples_nacional_date?: string | null;
  is_mei?: boolean | null;
  mei_date?: string | null;
  tax_regime?: string;
  // Quadro Societário (QSA)
  partners?: CompanyPartner[];
  // Dados de Compliance e Governança coletados no onboarding
  integrity_officer_name?: string;
  integrity_officer_email?: string;
  integrity_officer_phone?: string;
  compliance_officer_name?: string;
  approximate_employees_count?: number;
  conducts_public_contracts?: boolean;
}

export interface PolicyVersion {
  version: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  approved_by: string;
  approved_at: string;
  is_active: boolean;
  published_to_employees: boolean;
  published_at?: string;
  change_summary?: string;
}

export interface Policy {
  id: string;
  company_id: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  approved_by: string;
  approved_at: string;
  next_review_date: string;
  published_to_employees: boolean;
  published_at?: string;
  history?: PolicyVersion[];
}

export interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  cpf: string;
  role: string;
  phone: string;
  email?: string | null;
  access_token: string;
  policy_accepted_at?: string | null;
  policy_acceptance_ip?: string | null;
  created_at: string;
}

export interface TrainingCard {
  id: string;
  training_id: string;
  order_index: number;
  title: string;
  content: string;
}

export interface TrainingQuestion {
  id: string;
  training_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  track: TrainingTrack;
  cards?: TrainingCard[];
  questions?: TrainingQuestion[];
}

export interface EmployeeTraining {
  id: string;
  employee_id: string;
  training_id: string;
  score: number;
  completed_at: string;
  certificate_code: string;
  ip_address?: string | null;
  training?: Training;
}

export interface WhistleblowerReport {
  id: string;
  company_id: string;
  protocol: string;
  access_key: string;
  is_anonymous: boolean;
  reporter_name?: string | null;
  reporter_contact?: string | null;
  category: ReportCategory;
  description: string;
  evidence_urls: string[];
  status: ReportStatus;
  resolution_notes?: string | null;
  created_at: string;
  updated_at: string;
}

// DUE DILIGENCE DE TERCEIROS (DDI)
export type RiskLevel = "BAIXO" | "MEDIO" | "ALTO";
export type RiskStatus = "APROVADO" | "ALERTA" | "BLOQUEADO";

export interface SupplierPartner {
  id: string;
  company_id: string;
  cnpj: string;
  legal_name: string;
  trade_name?: string | null;
  status_cadastral?: string | null;
  created_at: string;
}

export interface PartnerQSA {
  nome: string;
  qual: string;
  cpf_cnpj_socio?: string;
  is_pep?: boolean;
  pep_details?: any;
}

export interface DueDiligenceDetails {
  qsa: PartnerQSA[];
  ceis_records: any[];
  cnep_records: any[];
  slave_labor_records: any[];
  pep_records: any[];
  queried_at: string;
  cgu_api_status: "CONNECTED" | "MOCK_FALLBACK";
}

export interface DueDiligenceRecord {
  id: string;
  company_id: string;
  supplier_id: string;
  supplier?: SupplierPartner;
  risk_level: RiskLevel;
  risk_status: RiskStatus;
  has_ceis: boolean;
  has_cnep: boolean;
  has_slave_labor: boolean;
  has_pep: boolean;
  details: DueDiligenceDetails;
  report_hash: string;
  queried_at: string;
}

