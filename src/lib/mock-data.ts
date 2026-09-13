import {
  Company,
  Policy,
  Employee,
  Training,
  EmployeeTraining,
  WhistleblowerReport,
  ReportCategory,
  ReportStatus,
  CompanyDocument,
} from "@/types";
import { generateProtocol, generateAccessKey, generateHash, generateSecureToken } from "./utils";

// EMPRESA DEMO PADRÃO
export const INITIAL_COMPANY: Company = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  trade_name: "TransLog Brasil Soluções",
  legal_name: "TransLog Brasil Transportes e Logística em Licitações Ltda",
  cnpj: "12345678000195",
  slug: "translog-brasil",
  logo_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=300",
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: "ATIVA",
  opening_date: "2018-04-12",
  legal_nature: "206-2 - Sociedade Empresária Limitada",
  company_size: "DEMAIS",
  share_capital: 1500000,
  headquarters_or_branch: "MATRIZ",
  cep: "01310-100",
  street: "Avenida Paulista",
  number: "1842",
  complement: "Conjunto 92",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  full_address: "Avenida Paulista, 1842 - Conjunto 92 - Bela Vista - São Paulo/SP - CEP: 01310-100",
  main_cnae_code: "49.30-2-02",
  main_cnae_description: "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional",
  secondary_cnaes: [
    { code: "52.11-7-99", description: "Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis" },
    { code: "52.12-5-00", description: "Carga e descarga" },
  ],
  is_simples_nacional: false,
  is_mei: false,
  tax_regime: "Regime Geral (Lucro Presumido)",
  partners: [
    {
      name: "Roberto Silveira Camargo",
      role: "Sócio-Administrador",
      cpf_cnpj_masked: "***.482.918-**",
      age_range: "Entre 41 a 50 anos",
      entry_date: "2018-04-12",
    },
    {
      name: "Camila Duarte Rocha",
      role: "Sócio",
      cpf_cnpj_masked: "***.194.888-**",
      age_range: "Entre 31 a 40 anos",
      entry_date: "2020-08-15",
    },
  ],
  integrity_officer_name: "Dra. Beatriz Fontana",
  integrity_officer_email: "compliance@translog.com.br",
  integrity_officer_phone: "(11) 98765-4321",
  compliance_officer_name: "Dra. Beatriz Fontana",
  approximate_employees_count: 45,
  conducts_public_contracts: true,
};

import { STRUCTURED_CODE_OF_CONDUCT, buildStructuredCodeOfConduct } from "./code-of-conduct-template";

// POLÍTICA / CÓDIGO DE CONDUTA ATIVO
export const INITIAL_POLICY: Policy = {
  id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22",
  company_id: INITIAL_COMPANY.id,
  title: "Código de Conduta e Integridade",
  content: STRUCTURED_CODE_OF_CONDUCT,
  version: "1.0",
  is_active: true,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  approved_by: "Diretoria Executiva / Comitê de Compliance",
  approved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  next_review_date: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString(),
  published_to_employees: true,
  published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  history: [
    {
      version: "0.9",
      title: "Minuta Preliminar do Código de Conduta",
      content: `# MINUTA PRELIMINAR - CÓDIGO DE CONDUTA v0.9\n\nDiretrizes iniciais elaboradas pela diretoria para estruturação do programa de integridade em licitações.`,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      approved_by: "Consultoria Interna",
      approved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: false,
      published_to_employees: false,
      change_summary: "Versão preliminar de estruturação interna.",
    },
  ],
};

// TRILHAS DE TREINAMENTO (MICROLEARNING EM TEXTO DIRETO)
export const INITIAL_TRAININGS: Training[] = [
  {
    id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
    title: "Integridade e Licitações Públicas (Lei Federal nº 14.133/2021)",
    description: "Diretrizes práticas de conduta para contratações públicas, proibição de vantagens indevidas e transparência com órgãos estatais.",
    track: "INTEGRIDADE_14133",
    cards: [
      {
        id: "card-1-1",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        order_index: 1,
        title: "Relação com Servidores Públicos",
        content: "É expressamente proibido a qualquer colaborador oferecer, prometer ou conceder brindes, almoços de cortesia, dinheiro, favores particulares ou vantagens de qualquer espécie a pregoeiros, fiscais de contrato ou servidores públicos. Isso constitui crime e desclassifica a empresa.",
      },
      {
        id: "card-1-2",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        order_index: 2,
        title: "Integridade na Execução e Propostas",
        content: "A empresa cumpre rigorosamente o que está na proposta e no contrato. Não combinamos preços com concorrentes e não entregamos material ou serviço de qualidade inferior ou com especificações adulteradas.",
      },
      {
        id: "card-1-3",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        order_index: 3,
        title: "Canal Seguro e Denúncia de Pressões",
        content: "Qualquer pressão indevida ou tentativa de corrupção deve ser reportada imediatamente no nosso canal de denúncias, com sigilo absoluto e sem qualquer risco de retaliação para o colaborador.",
      },
    ],
    questions: [
      {
        id: "q-1-1",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        question_text: "Durante a entrega de uma mercadoria, o fiscal do contrato pede um almoço ou benefício para 'agilizar' o ateste da nota fiscal. O que fazer?",
        options: [
          "Pagar o almoço para evitar atraso no recebimento da empresa",
          "Recusar educadamente, citar o Código de Ética e registrar imediatamente o relato no Canal de Denúncias",
          "Oferecer um brinde de pequeno valor para agradar o fiscal",
          "Combinar o benefício sem registrar recibo",
        ],
        correct_option_index: 1,
        explanation: "A Lei 14.133/2021 veda qualquer vantagem a agentes públicos. A recusa ética e o reporte imediato protegem você e a empresa.",
      },
      {
        id: "q-1-2",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        question_text: "Um concorrente entra em contato antes do pregão propondo divisão de lotes para que ambos vençam sem baixar preços. Qual a conduta correta?",
        options: [
          "Aceitar o acordo para garantir um lote sem concorrência",
          "Recusar a proposta e comunicar a diretoria/canal de denúncias sobre a tentativa de conluio",
          "Fingir que aceitou mas dar lance no final",
          "Pedir um percentual em dinheiro do lote dele",
        ],
        correct_option_index: 1,
        explanation: "Conluio e cartel são crimes graves punidos pela Lei 14.133 e Lei Anticorrupção (Lei 12.846/13).",
      },
      {
        id: "q-1-3",
        training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
        question_text: "É permitido entregar um produto de marca ou qualidade inferior à que foi solicitada e contratada no edital?",
        options: [
          "Sim, se a margem de lucro da empresa estiver apertada",
          "Sim, desde que a entrega seja rápida",
          "Não. Entregar material de qualidade inferior viola as regras da licitação e causa penalidades severas",
          "Apenas se o fiscal de contrato autorizar de boca",
        ],
        correct_option_index: 2,
        explanation: "A entrega deve corresponder fielmente às especificações do edital. Fraudar a qualidade do objeto é crime licitatório.",
      },
    ],
  },
  {
    id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
    title: "Prevenção ao Assédio e Segurança no Trabalho (NR-1 / Lei nº 14.457/2022)",
    description: "Orientações obrigatórias para preservação de ambiente digno, identificação de assédio moral e sexual, e uso de canais de apoio.",
    track: "NR1_ASSEDIO",
    cards: [
      {
        id: "card-2-1",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        order_index: 1,
        title: "O que é Assédio Moral",
        content: "Humilhações públicas, ofensas, xingamentos, exigência de tarefas impossíveis ou isolamento proposital de colegas de equipe caracterizam assédio moral. O respeito profissional é inegociável em todos os níveis hierárquicos.",
      },
      {
        id: "card-2-2",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        order_index: 2,
        title: "O que é Assédio Sexual",
        content: "Comentários constrangedores sobre o corpo, piadas de cunho sexual, toques físicos sem consentimento ou chantagem de emprego em troca de favores sexuais são infrações graves e ilegais.",
      },
      {
        id: "card-2-3",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        order_index: 3,
        title: "Segurança e Convivência",
        content: "Todo trabalhador tem direito a um ambiente seguro e digno. O uso de EPIs e o respeito mútuo são obrigatórios. O Canal de Denúncias acolhe qualquer relato com sigilo e suporte.",
      },
    ],
    questions: [
      {
        id: "q-2-1",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        question_text: "Um supervisor frequentemente insulta um subordinado diante dos outros colaboradores quando ele comete um engano operacional. Essa conduta caracteriza:",
        options: [
          "Estilo enérgico de liderança",
          "Assédio moral, expressamente vedado pelas diretrizes da NR-1 e pelo Código da empresa",
          "Forma comum de cobrança na rotina de trabalho",
          "Procedimento disciplinar padrão",
        ],
        correct_option_index: 1,
        explanation: "Humilhação e repreensões ofensivas em público caracterizam assédio moral e violam as normas trabalhistas e a NR-1.",
      },
      {
        id: "q-2-2",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        question_text: "O que deve ser feito caso um colaborador presencie um colega sofrendo assédio sexual ou intimidação?",
        options: [
          "Ignorar para não se envolver em atritos internos",
          "Registrar denúncia anônima ou identificada no Canal de Denúncias oficial da empresa",
          "Gravar vídeos escondidos e postar nas redes sociais",
          "Aconselhar a vítima a pedir demissão",
        ],
        correct_option_index: 1,
        explanation: "O Canal de Denúncias é o instrumento formal e protegido para apuração imparcial e imediata salvaguarda da vítima.",
      },
      {
        id: "q-2-3",
        training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
        question_text: "Qual é a garantia oferecida pela empresa ao colaborador que utiliza o Canal de Denúncias?",
        options: [
          "Apenas anonimato, mas sem garantia de emprego",
          "Sigilo, proteção contra qualquer tipo de retaliação e apuração técnica por comissão competente",
          "Nenhuma garantia",
          "Apenas resposta se houver autorização prévia da chefia direta",
        ],
        correct_option_index: 1,
        explanation: "A Lei nº 14.457/2022 e a NR-1 exigem a garantia estrita de não retaliação e sigilo a todos os denunciantes de boa-fé.",
      },
    ],
  },
];

// COLABORADORES INICIAIS
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55",
    company_id: INITIAL_COMPANY.id,
    full_name: "Carlos Eduardo da Silva",
    cpf: "12345678901",
    role: "Motorista de Cargas Especiais",
    phone: "11988887777",
    email: "carlos.silva@translog.com.br",
    access_token: "token-carlos-123",
    policy_accepted_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    policy_acceptance_ip: "187.54.210.12",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66",
    company_id: INITIAL_COMPANY.id,
    full_name: "Mariana Ribeiro Gomes",
    cpf: "23456789012",
    role: "Analista de Licitações e Contratos",
    phone: "11977776666",
    email: "mariana.gomes@translog.com.br",
    access_token: "token-mariana-456",
    policy_accepted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    policy_acceptance_ip: "177.102.88.45",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "77eebc99-9c0b-4ef8-bb6d-6bb9bd380077",
    company_id: INITIAL_COMPANY.id,
    full_name: "Rodrigo Mendes Rocha",
    cpf: "34567890123",
    role: "Encarregado Operacional de Logística",
    phone: "11966665555",
    email: "rodrigo.rocha@translog.com.br",
    access_token: "token-rodrigo-789",
    policy_accepted_at: null,
    policy_acceptance_ip: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// CERTIFICADOS INICIAIS
export const INITIAL_EMPLOYEE_TRAININGS: EmployeeTraining[] = [
  {
    id: "cert-1",
    employee_id: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55",
    training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
    score: 100,
    completed_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    certificate_code: "CERT-14133-2026-CS894",
    ip_address: "187.54.210.12",
  },
  {
    id: "cert-2",
    employee_id: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55",
    training_id: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44",
    score: 100,
    completed_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    certificate_code: "CERT-NR1-2026-CS895",
    ip_address: "187.54.210.12",
  },
  {
    id: "cert-3",
    employee_id: "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66",
    training_id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33",
    score: 100,
    completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    certificate_code: "CERT-14133-2026-MR302",
    ip_address: "177.102.88.45",
  },
];

// DENÚNCIAS INICIAIS
export const INITIAL_REPORTS: WhistleblowerReport[] = [
  {
    id: "rep-1",
    company_id: INITIAL_COMPANY.id,
    protocol: "DEN-2026-4891",
    access_key: "SEC894",
    is_anonymous: true,
    reporter_name: null,
    reporter_contact: null,
    category: "ASSEDIO_MORAL_SEXUAL",
    description: "Relato de conduta constrangedora em reunião noturna no setor de carga e descarga com xingamentos a auxiliares operacionais.",
    evidence_urls: [],
    status: "EM_ANALISE",
    resolution_notes: "Comissão de Ética ouviu os colaboradores do turno e advertiu formalmente o supervisor envolvido.",
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rep-2",
    company_id: INITIAL_COMPANY.id,
    protocol: "DEN-2026-1033",
    access_key: "K92PL1",
    is_anonymous: true,
    reporter_name: null,
    reporter_contact: null,
    category: "SEGURANCA_TRABALHO",
    description: "Falta de reposição de luvas de proteção adequadas para manuseio de equipamentos no galpão 2.",
    evidence_urls: [],
    status: "PROCEDENTE",
    resolution_notes: "Novo lote de EPIs entregue a toda a equipe em 24h. Procedimento regularizado.",
    created_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
  },
];

export interface TenantState {
  company: Company;
  policy: Policy;
  employees: Employee[];
  employeeTrainings: EmployeeTraining[];
  reports: WhistleblowerReport[];
  documents: CompanyDocument[];
  diagnosticProfile?: import("@/types/compliance").CompanyComplianceProfile;
  maturityHistory?: Array<{ id: string; event: string; date: string; score: number }>;
}

const CLIENT_TENANT_STORAGE_KEY = "techcompliance_active_tenant";

// GERENCIADOR DE ESTADO LOCAL MULTI-TENANT (COMPLIANCE MULTI-TENANT STORE)
class ComplianceMockStore {

  // Mapa de Tenants isolados por company_id
  private tenants: Map<string, TenantState> = new Map();
  // Mapa de Sessions para company_id
  private sessionToCompanyId: Map<string, string> = new Map();
  // Catálogo global e imutável de treinamentos normativos
  trainings: Training[] = INITIAL_TRAININGS;
  // ID do tenant atualmente ativo / padrão para chamadas sem ID explícito
  private activeCompanyId: string = INITIAL_COMPANY.id;

  constructor() {
    // Inicializa a Empresa Demo (apenas para auditoria/demonstração)
    this.tenants.set(INITIAL_COMPANY.id, {
      company: { ...INITIAL_COMPANY },
      policy: { ...INITIAL_POLICY },
      employees: [...INITIAL_EMPLOYEES],
      employeeTrainings: [...INITIAL_EMPLOYEE_TRAININGS],
      reports: [...INITIAL_REPORTS],
      documents: [],
    });

    // Mapeia a sessão demo
    this.sessionToCompanyId.set("demo-session-token", INITIAL_COMPANY.id);

    // No ambiente do navegador, tenta hidratar imediatamente a partir do localStorage
    this.hydrateFromLocalStorage();
  }

  /**
   * Hidrata o estado do tenant ativo a partir do localStorage do navegador
   */
  hydrateFromLocalStorage(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(CLIENT_TENANT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.cnpj) {
          if (!this.tenants.has(parsed.id)) {
            // Recria ou restaura o tenant no cache da memória local
            const tailoredPolicyContent = buildStructuredCodeOfConduct(parsed.legal_name || parsed.trade_name);
            this.tenants.set(parsed.id, {
              company: parsed,
              policy: {
                id: "pol-" + parsed.id,
                company_id: parsed.id,
                title: `Código de Ética, Integridade e Conduta - ${parsed.trade_name || parsed.legal_name}`,
                content: tailoredPolicyContent,
                version: "1.0",
                is_active: true,
                created_at: parsed.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                approved_by: parsed.integrity_officer_name || "Diretoria de Integridade",
                approved_at: new Date().toISOString(),
                next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                published_to_employees: true,
                published_at: new Date().toISOString(),
                history: [],
              },
              employees: [],
              employeeTrainings: [],
              reports: [],
              documents: [],
            });
          }
          this.activeCompanyId = parsed.id;
          return true;
        }
      }
    } catch (e) {
      console.warn("Falha ao hidratar tenant do localStorage:", e);
    }
    return false;
  }

  /**
   * Salva e ativa o tenant no cliente (memória + localStorage)
   */
  saveClientTenant(company: Company) {
    if (!company || !company.id) return;
    
    // Registra na memória do store
    if (!this.tenants.has(company.id)) {
      const tailoredPolicyContent = buildStructuredCodeOfConduct(company.legal_name || company.trade_name);
      this.tenants.set(company.id, {
        company: { ...company },
        policy: {
          id: "pol-" + company.id,
          company_id: company.id,
          title: `Código de Ética, Integridade e Conduta - ${company.trade_name || company.legal_name}`,
          content: tailoredPolicyContent,
          version: "1.0",
          is_active: true,
          created_at: company.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          approved_by: company.integrity_officer_name || "Diretoria de Integridade",
          approved_at: new Date().toISOString(),
          next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          published_to_employees: true,
          published_at: new Date().toISOString(),
          history: [],
        },
        employees: [],
        employeeTrainings: [],
        reports: [],
        documents: [],
      });
    } else {
      const state = this.tenants.get(company.id)!;
      state.company = { ...company };
    }

    this.activeCompanyId = company.id;

    // Persiste no localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CLIENT_TENANT_STORAGE_KEY, JSON.stringify(company));
      } catch (e) {
        console.warn("Erro ao salvar tenant no localStorage:", e);
      }
    }
  }

  /**
   * Limpa o tenant salvo no cliente (usado no logout)
   */
  clearClientTenant() {
    this.activeCompanyId = INITIAL_COMPANY.id;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CLIENT_TENANT_STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Obtém o estado de um tenant específico. Se não existir, retorna o ativo ou cria vazio se id válido.
   */
  getTenantState(companyId?: string): TenantState {
    // Se estiver no browser e o activeCompanyId for o padrão/demo, tenta checar se o localStorage tem uma empresa cadastrada
    if (typeof window !== "undefined" && this.activeCompanyId === INITIAL_COMPANY.id) {
      this.hydrateFromLocalStorage();
    }

    const id = companyId || this.activeCompanyId;
    let state = this.tenants.get(id);
    if (!state) {
      // Se não encontrou pelo ID, tenta achar por slug
      for (const t of this.tenants.values()) {
        if (t.company.slug === id || t.company.id === id) {
          return t;
        }
      }
      // Se ainda não encontrou e foi passado um ID, fallback seguro para o ativo
      state = this.tenants.get(this.activeCompanyId);
    }
    if (!state) {
      // Fallback final
      return {
        company: INITIAL_COMPANY,
        policy: INITIAL_POLICY,
        employees: [],
        employeeTrainings: [],
        reports: [],
        documents: [],
      };
    }
    return state;
  }

  /**
   * Define o tenant ativo para o contexto atual
   */
  setActiveCompany(companyId: string) {
    if (this.tenants.has(companyId)) {
      this.activeCompanyId = companyId;
    }
  }

  getActiveCompanyId(): string {
    if (typeof window !== "undefined" && this.activeCompanyId === INITIAL_COMPANY.id) {
      this.hydrateFromLocalStorage();
    }
    return this.activeCompanyId;
  }

  /**
   * Associa um token de sessão a uma empresa/tenant
   */
  bindSessionToCompany(sessionToken: string, companyId: string) {
    this.sessionToCompanyId.set(sessionToken, companyId);
    this.activeCompanyId = companyId;
  }

  /**
   * Obtém a empresa associada a um token de sessão
   */
  getCompanyBySession(sessionToken: string): Company | null {
    const companyId = this.sessionToCompanyId.get(sessionToken);
    if (!companyId) return null;
    return this.tenants.get(companyId)?.company || null;
  }

  /**
   * Cria um Tenant Real totalmente Limpo e Inicializado a partir dos dados do CNPJ
   */
  createRealCompanyTenant(data: Partial<Company> & { cnpj: string; legal_name: string }): Company {
    const cleanCnpjDigits = data.cnpj.replace(/\D/g, "");
    
    // Verifica se já existe um tenant com esse CNPJ para evitar duplicidade
    for (const [existingId, tenant] of this.tenants.entries()) {
      if (tenant.company.cnpj.replace(/\D/g, "") === cleanCnpjDigits) {
        // Atualiza os dados da empresa existente e preserva o histórico de integridade
        tenant.company = {
          ...tenant.company,
          ...data,
        };
        this.activeCompanyId = existingId;
        return tenant.company;
      }
    }

    const companyId = crypto.randomUUID ? crypto.randomUUID() : "comp-" + Date.now();
    const tradeName = data.trade_name || data.legal_name;

    const newCompany: Company = {
      id: companyId,
      trade_name: tradeName,
      legal_name: data.legal_name,
      cnpj: cleanCnpjDigits,
      slug: data.slug || "empresa-" + cleanCnpjDigits.substring(0, 8),
      created_at: new Date().toISOString(),
      status: data.status || "ATIVA",
      opening_date: data.opening_date,
      legal_nature: data.legal_nature,
      company_size: data.company_size,
      share_capital: data.share_capital,
      headquarters_or_branch: data.headquarters_or_branch || "MATRIZ",
      cep: data.cep,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      full_address: data.full_address,
      main_cnae_code: data.main_cnae_code,
      main_cnae_description: data.main_cnae_description,
      secondary_cnaes: data.secondary_cnaes || [],
      is_simples_nacional: data.is_simples_nacional ?? null,
      is_mei: data.is_mei ?? null,
      tax_regime: data.tax_regime,
      partners: data.partners || [],
      integrity_officer_name: data.integrity_officer_name,
      integrity_officer_email: data.integrity_officer_email,
      integrity_officer_phone: data.integrity_officer_phone,
      compliance_officer_name: data.compliance_officer_name,
      approximate_employees_count: data.approximate_employees_count || 10,
      conducts_public_contracts: data.conducts_public_contracts ?? true,
    };

    // Gera Código de Conduta personalizado para a nova empresa
    const tailoredPolicyContent = buildStructuredCodeOfConduct(newCompany.legal_name);

    const initialPolicy: Policy = {
      id: "pol-" + (crypto.randomUUID ? crypto.randomUUID() : Date.now()),
      company_id: companyId,
      title: `Código de Ética, Integridade e Conduta - ${tradeName}`,
      content: tailoredPolicyContent,
      version: "1.0",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_by: data.integrity_officer_name || "Diretoria de Integridade",
      approved_at: new Date().toISOString(),
      next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      published_to_employees: true,
      published_at: new Date().toISOString(),
      history: [],
    };

    // Registra o tenant com registros zerados (sem dados fake)
    this.tenants.set(companyId, {
      company: newCompany,
      policy: initialPolicy,
      employees: [],
      employeeTrainings: [],
      reports: [],
      documents: [],
    });

    this.activeCompanyId = companyId;
    return newCompany;
  }

  // Compatibilidade com propriedades legadas via getters dinâmicos vinculados ao tenant ativo
  get company(): Company {
    return this.getTenantState().company;
  }
  set company(c: Company) {
    const t = this.getTenantState(c.id);
    t.company = c;
    this.tenants.set(c.id, t);
    this.activeCompanyId = c.id;
  }

  get policy(): Policy {
    return this.getTenantState().policy;
  }
  set policy(p: Policy) {
    const t = this.getTenantState(p.company_id);
    t.policy = p;
  }

  get employees(): Employee[] {
    return this.getTenantState().employees;
  }
  set employees(list: Employee[]) {
    this.getTenantState().employees = list;
  }

  get employeeTrainings(): EmployeeTraining[] {
    return this.getTenantState().employeeTrainings;
  }
  set employeeTrainings(list: EmployeeTraining[]) {
    this.getTenantState().employeeTrainings = list;
  }

  get reports(): WhistleblowerReport[] {
    return this.getTenantState().reports;
  }
  set reports(list: WhistleblowerReport[]) {
    this.getTenantState().reports = list;
  }

  // Métodos de Empresa & Política
  getCompany(identifierOrSlug?: string): Company {
    if (!identifierOrSlug) {
      return this.getTenantState().company;
    }
    // Procura por ID direto
    if (this.tenants.has(identifierOrSlug)) {
      return this.tenants.get(identifierOrSlug)!.company;
    }
    // Procura por slug ou CNPJ
    const cleanId = identifierOrSlug.replace(/\D/g, "");
    for (const tenant of this.tenants.values()) {
      if (
        tenant.company.slug === identifierOrSlug ||
        tenant.company.id === identifierOrSlug ||
        (cleanId.length === 14 && tenant.company.cnpj.replace(/\D/g, "") === cleanId)
      ) {
        return tenant.company;
      }
    }
    return this.getTenantState().company;
  }

  updateCompany(partial: Partial<Company>, companyId?: string): Company {
    const state = this.getTenantState(companyId);
    state.company = {
      ...state.company,
      ...partial,
    };
    return state.company;
  }

  getPolicy(companyId?: string): Policy {
    return this.getTenantState(companyId).policy;
  }

  updatePolicy(content: string, title?: string, publishToEmployees: boolean = true, companyId?: string): Policy {
    const state = this.getTenantState(companyId);
    const previous = { ...state.policy };
    const currentVersionNum = parseFloat(previous.version) || 1.0;
    const newVersionStr = (currentVersionNum + 0.1).toFixed(1);
    const nowStr = new Date().toISOString();

    const archivedHistory = previous.history ? [...previous.history] : [];
    archivedHistory.unshift({
      version: previous.version,
      title: previous.title,
      content: previous.content,
      created_at: previous.created_at,
      updated_at: previous.updated_at,
      approved_by: previous.approved_by,
      approved_at: previous.approved_at,
      is_active: false,
      published_to_employees: previous.published_to_employees,
      published_at: previous.published_at,
      change_summary: `Revisão ordinária para versão ${newVersionStr}.`,
    });

    state.policy = {
      ...previous,
      title: title || previous.title,
      content,
      version: newVersionStr,
      is_active: true,
      updated_at: nowStr,
      approved_at: nowStr,
      published_to_employees: publishToEmployees,
      published_at: publishToEmployees ? nowStr : previous.published_at,
      history: archivedHistory,
    };
    return state.policy;
  }

  // Métodos de Colaborador
  getEmployeeByToken(token: string, companyId?: string): Employee | undefined {
    const state = this.getTenantState(companyId);
    return state.employees.find((e) => e.access_token === token || e.id === token);
  }

  getEmployees(companyId?: string): Employee[] {
    return this.getTenantState(companyId).employees;
  }

  addEmployee(
    data: { full_name: string; cpf: string; role: string; phone: string; email?: string },
    companyId?: string
  ): Employee {
    const state = this.getTenantState(companyId);
    const cleanCpf = data.cpf.replace(/\D/g, "");
    const token = generateSecureToken("tok");
    const newEmp: Employee = {
      id: "emp-" + generateSecureToken("id").substring(0, 16),
      company_id: state.company.id,
      full_name: data.full_name,
      cpf: cleanCpf,
      role: data.role,
      phone: data.phone,
      email: data.email || null,
      access_token: token,
      policy_accepted_at: null,
      policy_acceptance_ip: null,
      created_at: new Date().toISOString(),
    };
    state.employees.unshift(newEmp);
    return newEmp;
  }

  getEmployeeById(id: string, companyId?: string): Employee | null {
    const state = this.getTenantState(companyId);
    return state.employees.find((e) => e.id === id) || null;
  }

  addEmployeesBatch(
    list: Array<{ full_name: string; cpf: string; role: string; phone: string; email?: string }>,
    companyId?: string
  ): Employee[] {
    const created: Employee[] = [];
    for (const item of list) {
      if (item.full_name && item.cpf) {
        created.push(this.addEmployee(item, companyId));
      }
    }
    return created;
  }

  acceptPolicy(employeeId: string, ip: string = "127.0.0.1", companyId?: string): Employee | undefined {
    const state = this.getTenantState(companyId);
    const emp = state.employees.find((e) => e.id === employeeId);
    if (emp) {
      emp.policy_accepted_at = new Date().toISOString();
      emp.policy_acceptance_ip = ip;
    }
    return emp;
  }

  // Métodos de Treinamento
  getTrainings(): Training[] {
    return this.trainings;
  }

  getEmployeeCertificates(employeeId?: string, companyId?: string): EmployeeTraining[] {
    const state = this.getTenantState(companyId);
    if (employeeId) {
      return state.employeeTrainings.filter((et) => et.employee_id === employeeId);
    }
    return state.employeeTrainings;
  }

  completeTraining(
    employeeId: string,
    trainingId: string,
    score: number = 100,
    ip: string = "127.0.0.1",
    companyId?: string
  ): EmployeeTraining {
    const state = this.getTenantState(companyId);
    const existing = state.employeeTrainings.find(
      (et) => et.employee_id === employeeId && et.training_id === trainingId
    );
    if (existing) return existing;

    const training = this.trainings.find((t) => t.id === trainingId);
    const trackPrefix = training?.track === "INTEGRIDADE_14133" ? "CERT-14133" : "CERT-NR1";
    const certCode = generateHash(trackPrefix);

    const newRecord: EmployeeTraining = {
      id: "cert-" + Math.random().toString(36).substring(2, 9),
      employee_id: employeeId,
      training_id: trainingId,
      score,
      completed_at: new Date().toISOString(),
      certificate_code: certCode,
      ip_address: ip,
    };

    state.employeeTrainings.push(newRecord);
    return newRecord;
  }

  findCertificateByCode(code: string, companyId?: string) {
    // Procura no tenant específico ou em todos os tenants
    const searchTenants = companyId
      ? [this.getTenantState(companyId)]
      : Array.from(this.tenants.values());

    for (const state of searchTenants) {
      const cert = state.employeeTrainings.find(
        (et) => et.certificate_code.toUpperCase() === code.toUpperCase()
      );
      if (cert) {
        const employee = state.employees.find((e) => e.id === cert.employee_id);
        const training = this.trainings.find((t) => t.id === cert.training_id);
        return {
          certificate: cert,
          employee,
          training,
          company: state.company,
        };
      }
    }
    return null;
  }

  // Métodos de Denúncias
  createReport(
    data: {
      company_id?: string;
      category: ReportCategory;
      description: string;
      is_anonymous: boolean;
      reporter_name?: string;
      reporter_contact?: string;
      evidence_urls?: string[];
    }
  ): WhistleblowerReport {
    const state = this.getTenantState(data.company_id);
    const protocol = generateProtocol();
    const accessKey = generateAccessKey();
    const newReport: WhistleblowerReport = {
      id: "rep-" + generateSecureToken("id").substring(0, 16),
      company_id: state.company.id,
      protocol,
      access_key: accessKey,
      is_anonymous: data.is_anonymous,
      reporter_name: data.is_anonymous ? null : (data.reporter_name || null),
      reporter_contact: data.is_anonymous ? null : (data.reporter_contact || null),
      category: data.category,
      description: data.description,
      evidence_urls: data.evidence_urls || [],
      status: "RECEBIDA",
      resolution_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.reports.unshift(newReport);
    return newReport;
  }

  getReportByProtocol(protocol: string, accessKey?: string, companyId?: string): WhistleblowerReport | undefined {
    const searchTenants = companyId
      ? [this.getTenantState(companyId)]
      : Array.from(this.tenants.values());

    for (const state of searchTenants) {
      const report = state.reports.find(
        (r) =>
          r.protocol.trim().toUpperCase() === protocol.trim().toUpperCase() &&
          (!accessKey || r.access_key.trim() === accessKey.trim()) &&
          (!companyId || r.company_id === companyId)
      );
      if (report) return report;
    }
    return undefined;
  }

  getReports(companyId?: string): WhistleblowerReport[] {
    return this.getTenantState(companyId).reports;
  }

  updateReportStatus(reportId: string, status: ReportStatus, notes?: string, companyId?: string): WhistleblowerReport | null {
    const state = this.getTenantState(companyId);
    const report = state.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      if (notes !== undefined) {
        report.resolution_notes = notes;
      }
      report.updated_at = new Date().toISOString();
      return report;
    }
    return null;
  }

  // Métricas de Conformidade isoladas por tenant
  getComplianceMetrics(companyId?: string) {
    const state = this.getTenantState(companyId);
    const totalEmployees = state.employees.length;
    const acceptedPolicies = state.employees.filter((e) => !!e.policy_accepted_at).length;
    const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;

    const totalExpectedTrainings = totalEmployees * this.trainings.length;
    const completedTrainings = state.employeeTrainings.length;
    const trainingRate =
      totalExpectedTrainings > 0
        ? Math.min(100, Math.round((completedTrainings / totalExpectedTrainings) * 100))
        : 0;

    const totalReports = state.reports.length;
    const resolvedReports = state.reports.filter(
      (r) => r.status === "PROCEDENTE" || r.status === "IMPROCEDENTE" || r.status === "ARQUIVADA"
    ).length;

    return {
      totalEmployees,
      acceptedPolicies,
      policyRate,
      completedTrainings,
      totalExpectedTrainings,
      trainingRate,
      totalReports,
      resolvedReports,
    };
  }

  // Reseta o sistema para um novo cliente pagante (início zerado)
  resetForNewSubscriber(companyData?: Partial<Company>): Company {
    const companyId = crypto.randomUUID ? crypto.randomUUID() : "comp-" + Date.now();
    const tradeName = companyData?.trade_name || "Sua Empresa";
    const legalName = companyData?.legal_name || "Sua Empresa Ltda";
    const tailoredContent = buildStructuredCodeOfConduct(legalName);

    const newCompany: Company = {
      id: companyId,
      trade_name: tradeName,
      legal_name: legalName,
      cnpj: companyData?.cnpj || "",
      slug: companyData?.slug || "sua-empresa",
      created_at: new Date().toISOString(),
      status: "ATIVA",
      partners: companyData?.partners || [],
      ...companyData,
    };

    const newPolicy: Policy = {
      id: "pol-" + Date.now(),
      company_id: companyId,
      title: `Código de Ética, Integridade e Conduta - ${tradeName}`,
      content: tailoredContent,
      version: "1.0",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_by: "Diretoria de Integridade",
      approved_at: new Date().toISOString(),
      next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      published_to_employees: true,
      published_at: new Date().toISOString(),
      history: [],
    };

    // Registra tenant ZERADO (sem colaboradores, certificações ou denúncias de demo)
    this.tenants.set(companyId, {
      company: newCompany,
      policy: newPolicy,
      employees: [],
      employeeTrainings: [],
      reports: [],
      documents: [],
    });

    this.activeCompanyId = companyId;
    return newCompany;
  }

  // --- MÉTODOS DE DOCUMENTOS DA BIBLIOTECA / EMPRESA ---
  getDocuments(companyId?: string): CompanyDocument[] {
    const targetId = companyId || this.activeCompanyId;
    let tenant = this.tenants.get(targetId);
    if (!tenant) {
      this.getCompany(targetId);
      tenant = this.tenants.get(targetId);
    }
    if (!tenant) return [];
    if (!tenant.documents) tenant.documents = [];
    return [...tenant.documents];
  }

  getDocumentById(docId: string, companyId?: string): CompanyDocument | null {
    const docs = this.getDocuments(companyId);
    return docs.find((d) => d.id === docId) || null;
  }

  saveDocument(doc: CompanyDocument, companyId?: string): CompanyDocument {
    const targetId = companyId || doc.company_id || this.activeCompanyId;
    let tenant = this.tenants.get(targetId);
    if (!tenant) {
      this.getCompany(targetId);
      tenant = this.tenants.get(targetId);
    }
    if (!tenant) {
      const comp = this.getCompany(targetId);
      tenant = {
        company: comp,
        policy: INITIAL_POLICY,
        employees: [],
        employeeTrainings: [],
        reports: [],
        documents: [],
      };
      this.tenants.set(targetId, tenant);
    }
    if (!tenant.documents) {
      tenant.documents = [];
    }
    const idx = tenant.documents.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      tenant.documents[idx] = { ...doc, updated_at: new Date().toISOString() };
    } else {
      tenant.documents.push({
        ...doc,
        company_id: targetId,
        created_at: doc.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return doc;
  }

  deleteDocument(docId: string, companyId?: string): boolean {
    const targetId = companyId || this.activeCompanyId;
    const tenant = this.tenants.get(targetId);
    if (!tenant) return false;
    const initialLen = tenant.documents.length;
    tenant.documents = tenant.documents.filter((d) => d.id !== docId);
    return tenant.documents.length < initialLen;
  }

  // Métodos de Diagnóstico e Perfil de Conformidade
  getDiagnosticProfile(companyId?: string): import("@/types/compliance").CompanyComplianceProfile | null {
    const targetId = companyId || this.activeCompanyId;
    const tenant = this.tenants.get(targetId);
    return tenant?.diagnosticProfile || null;
  }

  saveDiagnosticProfile(
    profile: import("@/types/compliance").CompanyComplianceProfile,
    companyId?: string
  ): import("@/types/compliance").CompanyComplianceProfile {
    const targetId = companyId || profile.company_id || this.activeCompanyId;
    let tenant = this.tenants.get(targetId);
    if (!tenant) {
      this.getCompany(targetId);
      tenant = this.tenants.get(targetId);
    }
    if (tenant) {
      tenant.diagnosticProfile = { ...profile, company_id: targetId, updated_at: new Date().toISOString() };
    }
    return profile;
  }

  getMaturityHistory(companyId?: string): Array<{ id: string; event: string; date: string; score: number }> {
    const targetId = companyId || this.activeCompanyId;
    const tenant = this.tenants.get(targetId);
    return tenant?.maturityHistory || [];
  }

  addMaturityLog(event: string, score: number, companyId?: string) {
    const targetId = companyId || this.activeCompanyId;
    const tenant = this.tenants.get(targetId);
    if (tenant) {
      if (!tenant.maturityHistory) tenant.maturityHistory = [];
      tenant.maturityHistory.unshift({
        id: "mat-" + Date.now(),
        event,
        date: new Date().toISOString(),
        score,
      });
    }
  }
}

// Export singleton instance

export const mockStore = new ComplianceMockStore();

