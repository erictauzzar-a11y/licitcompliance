import {
  Company,
  Policy,
  Employee,
  Training,
  EmployeeTraining,
  WhistleblowerReport,
  ReportCategory,
  ReportStatus,
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

import { STRUCTURED_CODE_OF_CONDUCT } from "./code-of-conduct-template";

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

// GERENCIADOR DE ESTADO LOCAL
class ComplianceMockStore {
  company: Company = INITIAL_COMPANY;
  policy: Policy = INITIAL_POLICY;
  trainings: Training[] = INITIAL_TRAININGS;
  employees: Employee[] = [...INITIAL_EMPLOYEES];
  employeeTrainings: EmployeeTraining[] = [...INITIAL_EMPLOYEE_TRAININGS];
  reports: WhistleblowerReport[] = [...INITIAL_REPORTS];

  // Métodos de Empresa & Política
  getCompany(slug?: string) {
    if (!slug || slug === this.company.slug) return this.company;
    return this.company;
  }

  updateCompany(partial: Partial<Company>) {
    this.company = {
      ...this.company,
      ...partial,
    };
    return this.company;
  }

  getPolicy() {
    return this.policy;
  }

  updatePolicy(content: string, title?: string, publishToEmployees: boolean = true) {
    const previous = { ...this.policy };
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

    this.policy = {
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
    return this.policy;
  }

  // Métodos de Colaborador
  getEmployeeByToken(token: string) {
    return this.employees.find((e) => e.access_token === token || e.id === token);
  }

  getEmployees() {
    return this.employees;
  }

  addEmployee(data: { full_name: string; cpf: string; role: string; phone: string; email?: string }) {
    const cleanCpf = data.cpf.replace(/\D/g, "");
    const token = generateSecureToken("tok");
    const newEmp: Employee = {
      id: "emp-" + generateSecureToken("id").substring(0, 16),
      company_id: this.company.id,
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
    this.employees.unshift(newEmp);
    return newEmp;
  }

  getEmployeeById(id: string) {
    return this.employees.find((e) => e.id === id) || null;
  }

  addEmployeesBatch(list: Array<{ full_name: string; cpf: string; role: string; phone: string; email?: string }>) {
    const created: Employee[] = [];
    for (const item of list) {
      if (item.full_name && item.cpf) {
        created.push(this.addEmployee(item));
      }
    }
    return created;
  }

  acceptPolicy(employeeId: string, ip: string = "127.0.0.1") {
    const emp = this.employees.find((e) => e.id === employeeId);
    if (emp) {
      emp.policy_accepted_at = new Date().toISOString();
      emp.policy_acceptance_ip = ip;
    }
    return emp;
  }

  // Métodos de Treinamento
  getTrainings() {
    return this.trainings;
  }

  getEmployeeCertificates(employeeId: string) {
    return this.employeeTrainings.filter((et) => et.employee_id === employeeId);
  }

  completeTraining(employeeId: string, trainingId: string, score: number = 100, ip: string = "127.0.0.1") {
    const existing = this.employeeTrainings.find(
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

    this.employeeTrainings.push(newRecord);
    return newRecord;
  }

  findCertificateByCode(code: string) {
    const cert = this.employeeTrainings.find(
      (et) => et.certificate_code.toUpperCase() === code.toUpperCase()
    );
    if (!cert) return null;

    const employee = this.employees.find((e) => e.id === cert.employee_id);
    const training = this.trainings.find((t) => t.id === cert.training_id);

    return {
      certificate: cert,
      employee,
      training,
      company: this.company,
    };
  }

  // Métodos de Denúncias
  createReport(data: {
    company_id?: string;
    category: ReportCategory;
    description: string;
    is_anonymous: boolean;
    reporter_name?: string;
    reporter_contact?: string;
    evidence_urls?: string[];
  }) {
    const protocol = generateProtocol();
    const accessKey = generateAccessKey();
    const newReport: WhistleblowerReport = {
      id: "rep-" + generateSecureToken("id").substring(0, 16),
      company_id: data.company_id || this.company.id,
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
    this.reports.unshift(newReport);
    return newReport;
  }

  getReportByProtocol(protocol: string, accessKey: string, companyId?: string) {
    return this.reports.find(
      (r) =>
        r.protocol.trim().toUpperCase() === protocol.trim().toUpperCase() &&
        r.access_key.trim() === accessKey.trim() &&
        (!companyId || r.company_id === companyId)
    );
  }

  getReports(companyId?: string) {
    if (companyId) {
      return this.reports.filter((r) => r.company_id === companyId);
    }
    return this.reports;
  }

  updateReportStatus(reportId: string, status: ReportStatus, notes?: string) {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      if (notes !== undefined) {
        report.resolution_notes = notes;
      }
      report.updated_at = new Date().toISOString();
    }
    return report;
  }

  // Métricas de Conformidade
  getComplianceMetrics() {
    const totalEmployees = this.employees.length;
    const acceptedPolicies = this.employees.filter((e) => !!e.policy_accepted_at).length;
    const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;

    const totalExpectedTrainings = totalEmployees * this.trainings.length;
    const completedTrainings = this.employeeTrainings.length;
    const trainingRate =
      totalExpectedTrainings > 0
        ? Math.min(100, Math.round((completedTrainings / totalExpectedTrainings) * 100))
        : 0;

    const totalReports = this.reports.length;
    const resolvedReports = this.reports.filter(
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
}

// Export singleton instance
export const mockStore = new ComplianceMockStore();
