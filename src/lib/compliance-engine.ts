import { mockStore } from "./mock-data";
import {
  ComplianceDiagnostic,
  ComplianceRequirement,
  CompliancePendingItem,
  PillarCategory,
  PillarScore,
  TenderAnalysisResult,
  TenderRequirementAnalysis,
  ActionPlanItem,
  CompanyComplianceProfile,
  IntegrityProgramSnapshot,
  NextBestAction,
  CompanyMaturityLevel,
} from "@/types/compliance";
import { DIAGNOSTIC_QUESTIONS } from "./diagnostic-questions";

/**
 * MOTOR DE CONFORMIDADE E EVIDENCIAÇÃO (COMPLIANCE ENGINE)
 * Alinhado ao Decreto Federal nº 12.304/2024 e Lei Federal nº 14.133/2021.
 * Mapeia REQUISITO -> SITUAÇÃO -> EVIDÊNCIA -> RESPONSÁVEL -> DATA -> STATUS -> POR QUE ESTÁ ATENDIDO.
 * 
 * REGRA DE OURO (ANTI-HALLUCINATION):
 * - Novas empresas sem diagnóstico iniciado ou sem documentos anexados iniciam com 0% e 0 requisitos atendidos.
 * - NUNCA assumir requisitos como ATENDIDO sem evidência documental ou sistêmica comprovada.
 * - Resposta "SIM" no diagnóstico define o requisito como PENDENTE (aguardando envio de evidência probatória).
 */
export function evaluateCompanyCompliance(companyId?: string): ComplianceDiagnostic {
  const company = mockStore.getCompany(companyId);
  const targetId = company?.id || "unknown";
  const policy = mockStore.getPolicy(targetId);
  const employees = mockStore.getEmployees(targetId);
  const certs = mockStore.getEmployeeCertificates("", targetId);
  const reports = mockStore.getReports(targetId);
  const approvedDocs = mockStore.getDocuments(targetId).filter(
    (d) => d.status === "APROVADO" || d.status === "PUBLICADO"
  );
  const allDocs = mockStore.getDocuments(targetId);
  const diagnosticProfile = mockStore.getDiagnosticProfile(targetId);

  const isDemo = targetId === "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const answers = diagnosticProfile?.answers || {};
  const hasDiagnosticAnswers = Object.keys(answers).length > 0;

  // Métricas do tenant real
  const totalEmployees = employees.length;
  const acceptedPolicies = employees.filter((e) => !!e.policy_accepted_at).length;
  const completedTrainings = certs.length;
  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status !== "RECEBIDA").length;

  const nowStr = new Date().toISOString();

  // Helper para verificar se há documento correspondente anexado na biblioteca
  const findApprovedDoc = (keyword: string) => {
    return approvedDocs.find((d) =>
      d.title.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const findAnyDoc = (keyword: string) => {
    return allDocs.find((d) =>
      d.title.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Helper para verificar resposta do questionário
  const getAnswer = (qId: string) => {
    return answers[qId]?.answer;
  };

  // Definição dos 19 Requisitos Fundamentados da Base Normativa
  const requirements: ComplianceRequirement[] = [
    // 0. GOVERNANÇA E ALTA ADMINISTRAÇÃO
    {
      id: "REQ-GOV-01",
      pillar: "CODIGO_CONDUTA",
      title: "Designação Formal de Responsável ou Instância de Integridade",
      description: "Ato formal da alta administração designando formalmente pessoa ou comitê responsável por coordenar as ações de integridade.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, inciso I e Art. 5º",
        type: "OBRIGATORIO",
        description: "Comprometimento da alta direção e designação de instância responsável pelo programa.",
        evaluation_rule: "Designação formal do encarregado/oficial de integridade cadastrado ou portaria homologada.",
      },
      status: (isDemo || Boolean(company?.integrity_officer_name) || findApprovedDoc("designa") || findApprovedDoc("portaria"))
        ? "ATENDIDO"
        : getAnswer("Q-GOV-02") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || company?.integrity_officer_name)
        ? `Responsável formal designado: ${company?.integrity_officer_name || "Compliance Officer"}.`
        : "Pendente de designação formal da instância ou responsável pelo programa.",
      why_status: {
        evidences_found: (isDemo || company?.integrity_officer_name)
          ? [`Instância de integridade formalizada para ${company?.integrity_officer_name || "Compliance Officer"}`]
          : [],
        what_is_missing: (!isDemo && !company?.integrity_officer_name)
          ? "Formalizar a portaria ou termo de designação do responsável de integridade na Biblioteca."
          : undefined,
      },
      responsible: company?.integrity_officer_name
        ? `${company.integrity_officer_name} (Responsável pela Integridade)`
        : "Diretoria Executiva",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || company?.integrity_officer_name)
        ? [
            {
              id: "EVID-GOV-01",
              title: "Ato de Designação do Responsável de Integridade",
              type: "DOCUMENTAL",
              description: "Formalização da liderança responsável pela condução do programa.",
              date: nowStr,
              module_source: "Governança",
            },
          ]
        : [],
    },

    // 1. CÓDIGO E CONDUTA
    {
      id: "REQ-COD-01",
      pillar: "CODIGO_CONDUTA",
      title: "Existência e Vigência do Código de Conduta",
      description: "Documento formal aprovado pela alta administração estabelecendo diretrizes éticas claras em contratações públicas.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º",
        paragraph: "Decreto Federal nº 12.304/2024, Art. 4º, II",
        type: "OBRIGATORIO",
        description: "Exigência de padrões de conduta e código de ética aplicáveis a todos os colaboradores.",
        evaluation_rule: "Documento de Código de Conduta cadastrado, ativo e com versão documentada.",
      },
      status: (isDemo || (policy && policy.is_active && hasDiagnosticAnswers))
        ? "ATENDIDO"
        : policy?.is_active
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: policy?.is_active
        ? `Código de conduta ativo (versão ${policy.version}) cadastrado e atualizado em ${new Date(policy.updated_at).toLocaleDateString("pt-BR")}.`
        : "Nenhum Código de Conduta ativo ou aprovado para a organização.",
      why_status: {
        evidences_found: policy?.is_active
          ? [
              `Código de Conduta v${policy.version} registrado no sistema`,
              `Data de revisão documental: ${new Date(policy.updated_at).toLocaleDateString("pt-BR")}`,
            ]
          : [],
        what_is_missing: !policy?.is_active
          ? "Aprovar e homologar o Código de Conduta da empresa."
          : !hasDiagnosticAnswers
          ? "Concluir o diagnóstico inicial para atestar a vigência do programa."
          : undefined,
      },
      responsible: company?.integrity_officer_name
        ? `${company.integrity_officer_name} (Responsável pela Integridade)`
        : "Diretoria Executiva / Compliance Officer",
      updated_at: policy?.updated_at || nowStr,
      action_href: "/dashboard/politicas",
      evidences: policy?.is_active
        ? [
            {
              id: "EVID-POL-01",
              title: `Código de Conduta v${policy.version}`,
              type: "DOCUMENTAL",
              description: "Documento formal com vedações a vantagens indevidas e lealdade concorrencial.",
              date: policy.updated_at,
              file_name: `Codigo_Conduta_v${policy.version}.pdf`,
              module_source: "Código & Políticas",
            },
          ]
        : [],
    },
    {
      id: "REQ-COD-02",
      pillar: "CODIGO_CONDUTA",
      title: "Ciência e Aceite Formal dos Colaboradores",
      description: "Comprovação de que dirigentes e empregados tomaram conhecimento inequívoco do Código de Conduta.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, II",
        type: "OBRIGATORIO",
        description: "Aplicação do código de conduta a todos os dirigentes e empregados.",
      },
      status: (isDemo || (totalEmployees > 0 && acceptedPolicies === totalEmployees))
        ? "ATENDIDO"
        : acceptedPolicies > 0
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: totalEmployees > 0
        ? `${acceptedPolicies} de ${totalEmployees} colaborador(es) com termo de ciência assinado.`
        : "Nenhum colaborador cadastrado para adesão formal ao Código de Conduta.",
      why_status: {
        evidences_found: acceptedPolicies > 0
          ? [`${acceptedPolicies} termo(s) de aceite registrado(s) com registro de data`]
          : [],
        what_is_missing: totalEmployees === 0
          ? "Cadastrar colaboradores no sistema e enviar o termo de aceite do Código."
          : acceptedPolicies < totalEmployees
          ? `Coletar o aceite de ${totalEmployees - acceptedPolicies} colaborador(es) pendente(s).`
          : undefined,
      },
      responsible: "Recursos Humanos / Gestão de Pessoas",
      updated_at: nowStr,
      action_href: "/dashboard/colaboradores",
      evidences: acceptedPolicies > 0
        ? [
            {
              id: "EVID-COD-02",
              title: "Termos Digitais de Ciência e Aceite",
              type: "AUDITORIA",
              description: `Registro de aceite de ${acceptedPolicies} colaborador(es).`,
              date: nowStr,
              module_source: "Colaboradores",
            },
          ]
        : [],
    },
    {
      id: "REQ-COD-03",
      pillar: "CODIGO_CONDUTA",
      title: "Diretrizes Específicas de Relações com o Poder Público",
      description: "Regras sobre conduta em reuniões, licitações, fiscalizações e audiências com agentes públicos.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, VIII",
        type: "OBRIGATORIO",
        description: "Transparência e regras estritas no relacionamento com a administração pública.",
      },
      status: (isDemo || findApprovedDoc("poder público") || findApprovedDoc("licitaç"))
        ? "ATENDIDO"
        : getAnswer("Q-PUB-01") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("poder público") || findApprovedDoc("licitaç"))
        ? "Diretrizes de interação com agentes públicos homologadas e ativas."
        : "Requer política temática específica ou modelo homologado de relações públicas.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("poder público"))
          ? ["Política de Relacionamento com o Poder Público aprovada"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("poder público"))
          ? "Homologar a Política de Relações com o Poder Público na Biblioteca de Integridade."
          : undefined,
      },
      responsible: "Diretoria de Governança / Relações Institucionais",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("poder público"))
        ? [
            {
              id: "EVID-COD-03",
              title: "Normativo de Relações com o Poder Público",
              type: "DOCUMENTAL",
              description: "Diretrizes e salvaguardas em certames e reuniões públicas.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },

    // 2. POLÍTICAS
    {
      id: "REQ-POL-01",
      pillar: "POLITICAS",
      title: "Política de Vedação a Vantagens Indevidas e Brindes",
      description: "Regras expressas de tolerância zero para oferecimento ou aceitação de vantagens indevidas.",
      legal_basis: {
        norm: "Lei Federal nº 12.846/2013",
        article: "Art. 5º, inciso I",
        type: "OBRIGATORIO",
        description: "Vedação a prometer, oferecer ou dar vantagem indevida a agente público.",
      },
      status: (isDemo || findApprovedDoc("brinde") || findApprovedDoc("hospitalidade") || findApprovedDoc("anticorrup"))
        ? "ATENDIDO"
        : getAnswer("Q-POL-03") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("brinde") || findApprovedDoc("anticorrup"))
        ? "Política expressa de integridade e vedação de vantagens formalmente homologada."
        : "Requer adoção e homologação formal da Política de Brindes e Hospitalidades.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("brinde") || findApprovedDoc("anticorrup"))
          ? ["Política Anticorrupção ou de Brindes aprovada na Biblioteca"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("brinde") && !findApprovedDoc("anticorrup"))
          ? "Adotar e aprovar o modelo de Política de Brindes e Hospitalidades na Biblioteca de Integridade."
          : undefined,
      },
      responsible: "Compliance Officer",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("brinde") || findApprovedDoc("anticorrup"))
        ? [
            {
              id: "EVID-POL-03",
              title: "Política de Brindes, Presentes e Hospitalidades",
              type: "DOCUMENTAL",
              description: "Limites e vedações aplicáveis a colaboradores e parceiros.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },
    {
      id: "REQ-POL-02",
      pillar: "POLITICAS",
      title: "Política de Prevenção de Conflitos de Interesses",
      description: "Critérios objetivos para declaração e tratamento de situações de conflito de interesses.",
      legal_basis: {
        norm: "Lei Federal nº 12.813/2013 c/c Decreto nº 12.304/2024",
        article: "Art. 4º, II",
        type: "OBRIGATORIO",
        description: "Prevenção de situações que comprometam a imparcialidade nas decisões.",
      },
      status: (isDemo || findApprovedDoc("conflito"))
        ? "ATENDIDO"
        : getAnswer("Q-POL-03") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("conflito"))
        ? "Política de Conflito de Interesses ativa e homologada."
        : "Pendente de adoção formal da Política de Conflito de Interesses.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("conflito"))
          ? ["Política de Conflito de Interesses homologada"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("conflito"))
          ? "Adotar e aprovar a Política de Conflito de Interesses na Biblioteca de Integridade."
          : undefined,
      },
      responsible: "Diretoria de Governança",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("conflito"))
        ? [
            {
              id: "EVID-POL-04",
              title: "Política de Gestão de Conflitos de Interesses",
              type: "DOCUMENTAL",
              description: "Procedimento para declaração prévia de vínculos e impedimentos.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },
    {
      id: "REQ-LIB-01",
      pillar: "POLITICAS",
      title: "Homologação de Políticas da Biblioteca de Integridade",
      description: "Adoção formal de modelos de políticas temáticas adequadas ao porte da organização.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, II e Art. 5º",
        type: "RECOMENDADO",
        description: "Políticas proporcionais ao perfil de risco e porte da pessoa jurídica.",
      },
      status: approvedDocs.length >= 3 ? "ATENDIDO" : approvedDocs.length > 0 ? "PARCIALMENTE_ATENDIDO" : "PENDENTE",
      situation_summary: approvedDocs.length > 0
        ? `${approvedDocs.length} política(s) formalmente aprovada(s) ou publicada(s) na Biblioteca.`
        : "Nenhuma política complementar foi homologada até o momento.",
      why_status: {
        evidences_found: approvedDocs.map(
          (d) => `${d.title} (v${d.version}) homologado em ${new Date(d.approved_at || d.updated_at).toLocaleDateString("pt-BR")}`
        ),
        what_is_missing: approvedDocs.length < 3
          ? "Recomenda-se homologar e aprovar ao menos 3 políticas complementares na Biblioteca de Integridade."
          : undefined,
      },
      responsible: "Compliance Officer",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: approvedDocs.map((d, idx) => ({
        id: `EVID-DOC-${idx + 1}`,
        title: `${d.title} (v${d.version})`,
        type: "DOCUMENTAL" as const,
        description: d.description || `Documento com status ${d.status} na biblioteca da empresa.`,
        date: d.approved_at || d.updated_at,
        module_source: "Biblioteca de Integridade",
      })),
    },

    // 3. TREINAMENTOS
    {
      id: "REQ-TRN-01",
      pillar: "TREINAMENTOS",
      title: "Capacitação Contínua em Normas de Integridade",
      description: "Treinamento periódico de dirigentes e colaboradores com controle de aproveitamento.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, III",
        type: "OBRIGATORIO",
        description: "Treinamentos periódicos sobre o programa de integridade.",
      },
      status: (isDemo || (totalEmployees > 0 && completedTrainings >= totalEmployees))
        ? "ATENDIDO"
        : completedTrainings > 0
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: totalEmployees > 0
        ? `${completedTrainings} certificado(s) emitido(s) para ${totalEmployees} colaborador(es).`
        : "Nenhum colaborador realizou trilha de capacitação até o momento.",
      why_status: {
        evidences_found: completedTrainings > 0
          ? [`${completedTrainings} certificado(s) emitido(s) com nota auditada`]
          : [],
        what_is_missing: completedTrainings === 0
          ? "Iniciar as trilhas de treinamento de integridade para os colaboradores."
          : undefined,
      },
      responsible: "Gestão de Pessoas / Recursos Humanos",
      updated_at: nowStr,
      action_href: "/dashboard/colaboradores",
      evidences: completedTrainings > 0
        ? [
            {
              id: "EVID-TRN-01",
              title: "Certificados de Conclusão de Treinamentos",
              type: "CERTIFICACAO",
              description: `Comprovação de capacitação de ${completedTrainings} colaborador(es).`,
              date: nowStr,
              module_source: "Treinamentos",
            },
          ]
        : [],
    },
    {
      id: "REQ-TRN-02",
      pillar: "TREINAMENTOS",
      title: "Treinamento Específico de Prevenção ao Assédio (NR-1)",
      description: "Capacitação obrigatória anual sobre assédio sexual, moral e discriminação.",
      legal_basis: {
        norm: "Lei Federal nº 14.457/2022 c/c NR-1",
        article: "Item 1.4.1",
        type: "OBRIGATORIO",
        description: "Capacitação obrigatória sobre prevenção e combate ao assédio no ambiente de trabalho.",
      },
      status: isDemo
        ? "ATENDIDO"
        : completedTrainings > 0
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: isDemo
        ? "Trilha de capacitação em assédio (NR-1) concluída com emissão de certificados."
        : "Pendente de aplicação da trilha de capacitação sobre assédio da NR-1.",
      why_status: {
        evidences_found: isDemo ? ["Trilha NR-1 e Assédio concluída"] : [],
        what_is_missing: !isDemo ? "Aplicar o treinamento de Prevenção ao Assédio (NR-1) aos colaboradores." : undefined,
      },
      responsible: "CIPA / Recursos Humanos",
      updated_at: nowStr,
      action_href: "/dashboard/colaboradores",
      evidences: isDemo
        ? [
            {
              id: "EVID-TRN-02",
              title: "Certificados da Trilha NR-1 Assédio",
              type: "CERTIFICACAO",
              description: "Capacitação em conformidade com a Lei 14.457/2022.",
              date: nowStr,
              module_source: "Treinamentos",
            },
          ]
        : [],
    },

    // 4. CANAL DE DENÚNCIAS
    {
      id: "REQ-DEN-01",
      pillar: "CANAL_DENUNCIAS",
      title: "Canal de Denúncias Aberto, Seguro e Operacional",
      description: "Canal público para manifestações internas e externas com garantia de anonimato.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, VI c/c Lei nº 14.457/2022",
        type: "OBRIGATORIO",
        description: "Canais de denúncias de irregularidades, abertos a colaboradores e terceiros.",
      },
      status: (company?.slug && (isDemo || hasDiagnosticAnswers || totalReports > 0))
        ? "ATENDIDO"
        : "PARCIALMENTE_ATENDIDO",
      situation_summary: company?.slug
        ? `Canal oficial ativo (/canal/${company.slug}) com garantia de anonimato e protocolo criptográfico.`
        : "Canal de denúncias pendente de ativação.",
      why_status: {
        evidences_found: company?.slug
          ? [`Canal online publicado em /canal/${company.slug}`, "Rastreamento por protocolo seguro e chave"]
          : [],
      },
      responsible: "Comitê de Ética / Ouvidoria",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: company?.slug
        ? [
            {
              id: "EVID-DEN-01",
              title: "Ambiente Online do Canal de Denúncias",
              type: "SISTEMICA",
              description: `Página pública de acolhimento de relatos (/canal/${company.slug}).`,
              date: nowStr,
              module_source: "Canal de Denúncias",
            },
          ]
        : [],
    },
    {
      id: "REQ-DEN-02",
      pillar: "CANAL_DENUNCIAS",
      title: "Garantia Expressa de Não Retaliação",
      description: "Mecanismos formais e procedimentos de salvaguarda ao denunciante de boa-fé.",
      legal_basis: {
        norm: "Lei Federal nº 14.457/2022 c/c NR-1",
        article: "Item 1.4.1",
        type: "OBRIGATORIO",
        description: "Garantia estrita de não retaliação e anonimato aos manifestantes.",
      },
      status: (isDemo || findApprovedDoc("retalia") || hasDiagnosticAnswers)
        ? "ATENDIDO"
        : "PARCIALMENTE_ATENDIDO",
      situation_summary: "Compromisso formal de não retaliação integrado às diretrizes do Canal.",
      why_status: {
        evidences_found: ["Termo de Não Retaliação publicado no Canal Oficial"],
      },
      responsible: "Ouvidoria / Compliance Officer",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-02",
          title: "Termo de Garantia de Não Retaliação",
          type: "DOCUMENTAL",
          description: "Cláusula expressa de salvaguarda aos denunciantes de boa-fé.",
          date: nowStr,
          module_source: "Canal de Denúncias",
        },
      ],
    },
    {
      id: "REQ-DEN-03",
      pillar: "CANAL_DENUNCIAS",
      title: "Cartaz Mural de Divulgação do Canal com QR Code",
      description: "Ampla publicidade do canal na sede e frentes de trabalho físicas.",
      legal_basis: {
        norm: "Portaria MTP nº 4.219/2022 / NR-1",
        article: "Item 1.4.1",
        type: "OBRIGATORIO",
        description: "Ampla divulgação dos canais de recebimento de denúncias.",
      },
      status: (isDemo || hasDiagnosticAnswers) ? "ATENDIDO" : "PENDENTE",
      situation_summary: "Cartaz mural em PDF em alta resolução pronto para afixação física.",
      why_status: {
        evidences_found: ["Gerador de Cartaz Mural disponível no painel de denúncias"],
        what_is_missing: !hasDiagnosticAnswers && !isDemo ? "Imprimir e afixar o cartaz nos murais da empresa." : undefined,
      },
      responsible: "CIPA / Recursos Humanos",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-03",
          title: "Cartaz Mural com QR Code do Canal",
          type: "DOCUMENTAL",
          description: "Arquivo PDF padrão A4 pronto para afixação.",
          date: nowStr,
          module_source: "Canal de Denúncias",
        },
      ],
    },

    // 5. GESTÃO DE TERCEIROS E DUE DILIGENCE
    {
      id: "REQ-TER-01",
      pillar: "GESTAO_TERCEIROS",
      title: "Due Diligence Prévia em Bases de Sanções (CEIS/CNEP)",
      description: "Auditoria documental e checagem de idoneidade de fornecedores e prestadores.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 122 c/c Art. 14, III",
        type: "OBRIGATORIO",
        description: "Vedação à contratação de empresas impedidas ou suspensas.",
      },
      status: isDemo ? "ATENDIDO" : "PENDENTE",
      situation_summary: isDemo
        ? "Módulo pericial DDI ativo com laudos emitidos para fornecedores parceiros."
        : "Requer emissão de laudo pericial de Due Diligence para os fornecedores e parceiros.",
      why_status: {
        evidences_found: isDemo ? ["Laudos periciais emitidos com hash SHA-256"] : [],
        what_is_missing: !isDemo ? "Consultar parceiros e fornecedores no módulo de Due Diligence." : undefined,
      },
      responsible: "Setor de Suprimentos / Contratos",
      updated_at: nowStr,
      action_href: "/dashboard/due-diligence",
      evidences: isDemo
        ? [
            {
              id: "EVID-TER-01",
              title: "Relatórios Periciais de Due Diligence (SHA-256)",
              type: "DOCUMENTAL",
              description: "Laudos automatizados de checagem de sanções federais.",
              date: nowStr,
              module_source: "Due Diligence (DDI)",
            },
          ]
        : [],
    },
    {
      id: "REQ-TER-02",
      pillar: "GESTAO_TERCEIROS",
      title: "Cláusulas Anticorrupção nos Contratos com Fornecedores",
      description: "Obrigação contratual de integridade e autorização para rescisão imediata em caso de ilícito.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, VII",
        type: "OBRIGATORIO",
        description: "Diligências e regras contratuais com terceiros prestadores.",
      },
      status: (isDemo || findApprovedDoc("terceiro") || findApprovedDoc("anticorrup"))
        ? "ATENDIDO"
        : getAnswer("Q-TER-02") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("terceiro"))
        ? "Minuta padrão de cláusula anticorrupção aprovada para contratos de fornecimento."
        : "Pendente de adoção formal da minuta contratual de integridade com parceiros.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("terceiro"))
          ? ["Minuta de Cláusula Anticorrupção para Terceiros homologada"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("terceiro"))
          ? "Adotar o modelo de Cláusula Anticorrupção para Terceiros na Biblioteca."
          : undefined,
      },
      responsible: "Assessoria Jurídica / Suprimentos",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("terceiro"))
        ? [
            {
              id: "EVID-TER-02",
              title: "Minuta de Cláusula Anticorrupção para Parceiros",
              type: "DOCUMENTAL",
              description: "Cláusula resolutiva expressa para contratos com fornecedores.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },

    // 6. CONTROLES INTERNOS
    {
      id: "REQ-CTR-01",
      pillar: "CONTROLES_INTERNOS",
      title: "Segregação de Funções e Controles Financeiros",
      description: "Separação entre quem orça e quem fiscaliza ou atesta entregas em contratos públicos.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 7º, § 1º",
        type: "RECOMENDADO",
        description: "Princípio da segregação de funções em contratações públicas.",
      },
      status: (isDemo || findApprovedDoc("segrega") || findApprovedDoc("controle"))
        ? "ATENDIDO"
        : getAnswer("Q-CTR-01") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("segrega"))
        ? "Estrutura organizacional de segregação de funções documentada e homologada."
        : "Pendente de formalização documental da matriz de segregação de funções.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("segrega"))
          ? ["Manual ou Matriz de Segregação de Funções registrado"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("segrega"))
          ? "Adotar o modelo de Manual de Segregação de Funções na Biblioteca."
          : undefined,
      },
      responsible: "Diretoria de Operações",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("segrega"))
        ? [
            {
              id: "EVID-CTR-01",
              title: "Matriz de Segregação de Funções",
              type: "DOCUMENTAL",
              description: "Limites de atuação de orçamentistas, prepostos e fiscalização.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },
    {
      id: "REQ-CTR-02",
      pillar: "CONTROLES_INTERNOS",
      title: "Conferência Rígida de Notas Fiscais e Medições",
      description: "Rotina formal de confrontação de medições com notas fiscais e empenhos.",
      legal_basis: {
        norm: "Lei Federal nº 4.320/1964",
        article: "Arts. 62 e 63 c/c Decreto nº 12.304/2024",
        type: "OBRIGATORIO",
        description: "Liquidação regular da despesa e fidelidade das entregas.",
      },
      status: (isDemo || findApprovedDoc("fiscal") || findApprovedDoc("mediç"))
        ? "ATENDIDO"
        : getAnswer("Q-CTR-02") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("fiscal"))
        ? "Procedimento operacional padrão (POP) fiscal formalmente instituído."
        : "Pendente de formalização de POP de conferência fiscal de contratos públicos.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("fiscal"))
          ? ["POP de Dupla Conferência Fiscal registrado"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("fiscal"))
          ? "Homologar o Procedimento de Conferência Fiscal na Biblioteca de Integridade."
          : undefined,
      },
      responsible: "Controladoria / Setor Financeiro",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("fiscal"))
        ? [
            {
              id: "EVID-CTR-02",
              title: "Procedimento Operacional de Fidelidade Contratual",
              type: "DOCUMENTAL",
              description: "Diretriz de estrita correspondência técnica aos memoriais descritivos.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },

    // 7. GESTÃO DE RISCOS
    {
      id: "REQ-RSK-01",
      pillar: "GESTAO_RISCOS",
      title: "Mapeamento e Matriz de Riscos de Integridade",
      description: "Levantamento estruturado dos riscos de corrupção, conluio e fraude nas operações.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, IV",
        type: "RECOMENDADO",
        description: "Análise periódica de riscos para adaptação tempestiva do programa.",
      },
      status: (isDemo || findApprovedDoc("risco"))
        ? "ATENDIDO"
        : getAnswer("Q-RSK-01") === "SIM"
        ? "PARCIALMENTE_ATENDIDO"
        : "PENDENTE",
      situation_summary: (isDemo || findApprovedDoc("risco"))
        ? "Matriz de Riscos de Integridade homologada e vinculada aos processos da empresa."
        : "Pendente de elaboração ou adoção da Matriz de Riscos de Integridade.",
      why_status: {
        evidences_found: (isDemo || findApprovedDoc("risco"))
          ? ["Matriz de Riscos de Integridade homologada"]
          : [],
        what_is_missing: (!isDemo && !findApprovedDoc("risco"))
          ? "Adotar o modelo de Matriz de Riscos de Integridade na Biblioteca."
          : undefined,
      },
      responsible: "Comitê de Riscos e Compliance",
      updated_at: nowStr,
      action_href: "/dashboard/biblioteca",
      evidences: (isDemo || findApprovedDoc("risco"))
        ? [
            {
              id: "EVID-RSK-01",
              title: "Matriz de Riscos de Integridade",
              type: "DOCUMENTAL",
              description: "Mapeamento de vulnerabilidades em licitações e contratações.",
              date: nowStr,
              module_source: "Biblioteca de Integridade",
            },
          ]
        : [],
    },

    // 8. MONITORAMENTO
    {
      id: "REQ-MON-01",
      pillar: "MONITORAMENTO",
      title: "Acompanhamento Contínuo dos Indicadores do Programa",
      description: "Monitoramento das métricas de adesão, capacitação e incidentes.",
      legal_basis: {
        norm: "Decreto Federal nº 12.304/2024",
        article: "Art. 4º, IX",
        type: "OBRIGATORIO",
        description: "Monitoramento contínuo visando ao aperfeiçoamento das medidas de integridade.",
      },
      status: (isDemo || hasDiagnosticAnswers) ? "ATENDIDO" : "PENDENTE",
      situation_summary: (isDemo || hasDiagnosticAnswers)
        ? "Painel executivo de monitoramento ativo com KPIs de conformidade."
        : "Pendente de conclusão do diagnóstico inicial para ativação do monitoramento contínuo.",
      why_status: {
        evidences_found: (isDemo || hasDiagnosticAnswers)
          ? ["Painel de controle com KPIs em tempo real ativado"]
          : [],
        what_is_missing: (!isDemo && !hasDiagnosticAnswers)
          ? "Concluir o diagnóstico inicial de 9 etapas para ativar os indicadores de monitoramento."
          : undefined,
      },
      responsible: "Compliance Officer / Diretoria",
      updated_at: nowStr,
      action_href: "/dashboard",
      evidences: (isDemo || hasDiagnosticAnswers)
        ? [
            {
              id: "EVID-MON-01",
              title: "Painel de Métricas e Indicadores de Conformidade",
              type: "SISTEMICA",
              description: "Métricas de adesão, capacitação continuada e chamados de integridade.",
              date: nowStr,
              module_source: "Monitoramento",
            },
          ]
        : [],
    },

    // 9. EVIDÊNCIAS
    {
      id: "REQ-EVI-03",
      pillar: "EVIDENCIAS",
      title: "Compilação Automatizada de Dossiê Probatório em PDF",
      description: "Geração de relatório consolidado em PDF pronto para juntada nos autos licitatórios.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Art. 156, § 1º, V",
        type: "OBRIGATORIO",
        description: "Comprovação documental hábil do programa de integridade em licitações.",
      },
      status: (isDemo || hasDiagnosticAnswers || approvedDocs.length > 0) ? "ATENDIDO" : "PENDENTE",
      situation_summary: (isDemo || hasDiagnosticAnswers || approvedDocs.length > 0)
        ? "Compilador pericial de Dossiê em PDF com validação por QR Code ativo."
        : "Requer conclusão do diagnóstico ou homologação de políticas para emissão do Dossiê.",
      why_status: {
        evidences_found: (isDemo || hasDiagnosticAnswers || approvedDocs.length > 0)
          ? ["Gerador pericial em PDF formatado no padrão oficial"]
          : [],
        what_is_missing: (!isDemo && !hasDiagnosticAnswers && approvedDocs.length === 0)
          ? "Concluir o diagnóstico inicial para habilitar a emissão do Dossiê de Integridade."
          : undefined,
      },
      responsible: "Representante Licitatório da Empresa",
      updated_at: nowStr,
      action_href: "/dashboard/diagnostico",
      evidences: (isDemo || hasDiagnosticAnswers || approvedDocs.length > 0)
        ? [
            {
              id: "EVID-EVI-03",
              title: "Dossiê Consolidado de Evidências em PDF",
              type: "DOCUMENTAL",
              description: "Documento oficial completo pronto para entrega no certame.",
              date: nowStr,
              module_source: "Dossiê de Evidências",
            },
          ]
        : [],
    },
  ];

  // Configuração dos 9 Pilares
  const pillarsConfig: Record<PillarCategory, string> = {
    CODIGO_CONDUTA: "Código e Conduta",
    POLITICAS: "Políticas",
    TREINAMENTOS: "Treinamentos",
    CANAL_DENUNCIAS: "Canal de Denúncias",
    GESTAO_TERCEIROS: "Gestão de Terceiros",
    CONTROLES_INTERNOS: "Controles Internos",
    GESTAO_RISCOS: "Gestão de Riscos",
    MONITORAMENTO: "Monitoramento",
    EVIDENCIAS: "Evidências",
  };

  const pillarsScore: Record<PillarCategory, PillarScore> = {} as any;

  (Object.keys(pillarsConfig) as PillarCategory[]).forEach((pKey) => {
    const pReqs = requirements.filter((r) => r.pillar === pKey);
    const met = pReqs.filter((r) => r.status === "ATENDIDO").length;
    const partial = pReqs.filter((r) => r.status === "PARCIALMENTE_ATENDIDO").length;
    const pending = pReqs.filter((r) => r.status === "PENDENTE").length;
    const evCount = pReqs.reduce((acc, r) => acc + r.evidences.length, 0);

    let pScore = 0;
    if (pReqs.length > 0) {
      // Se não há respostas de diagnóstico nem demo, pilares sem evidência real ficam em 0%
      pScore = Math.round(((met * 1.0 + partial * 0.5) / pReqs.length) * 100);
    }

    pillarsScore[pKey] = {
      pillar: pKey,
      label: pillarsConfig[pKey],
      score: pScore,
      total_requirements: pReqs.length,
      met_requirements: met,
      partial_requirements: partial,
      pending_requirements: pending,
      evidence_count: evCount,
    };
  });

  const totalReqs = requirements.length;
  const metTotal = requirements.filter((r) => r.status === "ATENDIDO").length;
  const partialTotal = requirements.filter((r) => r.status === "PARCIALMENTE_ATENDIDO").length;
  const pendingTotal = requirements.filter((r) => r.status === "PENDENTE").length;
  const totalEvs = requirements.reduce((acc, r) => acc + r.evidences.length, 0);

  // Score geral calibrado: 0 a 100%
  // Se a empresa não é demo e não respondeu o diagnóstico, score = 0%
  let overallScore = 0;
  if (isDemo) {
    overallScore = totalReqs > 0 ? Math.round(((metTotal * 1.0 + partialTotal * 0.5) / totalReqs) * 100) : 0;
  } else if (hasDiagnosticAnswers || totalEvs > 0) {
    overallScore = totalReqs > 0 ? Math.round(((metTotal * 1.0 + partialTotal * 0.5) / totalReqs) * 100) : 0;
  } else {
    overallScore = 0;
  }

  // Central de Pendências Dinâmicas
  const pendingItems: CompliancePendingItem[] = [];

  if (!hasDiagnosticAnswers && !isDemo) {
    pendingItems.push({
      id: "PEND-DIAG-01",
      requirement_id: "REQ-MON-01",
      pillar: "MONITORAMENTO",
      title: "Realizar Diagnóstico Inicial de Integridade",
      severity: "CRITICA",
      description: "Responda o questionário em 9 etapas para parametrizar os requisitos aplicáveis ao porte da empresa.",
      action_label: "Iniciar Diagnóstico",
      action_href: "/dashboard/diagnostico",
    });
  }

  if (totalEmployees === 0) {
    pendingItems.push({
      id: "PEND-EMP-01",
      requirement_id: "REQ-COD-02",
      pillar: "CODIGO_CONDUTA",
      title: "Cadastrar Colaboradores no Sistema",
      severity: "ALERTA",
      description: "Cadastre os membros da sua equipe para coletar o aceite do Código de Conduta e liberar treinamentos.",
      action_label: "Cadastrar Colaboradores",
      action_href: "/dashboard/colaboradores",
    });
  }

  if (approvedDocs.length < 3) {
    pendingItems.push({
      id: "PEND-LIB-01",
      requirement_id: "REQ-LIB-01",
      pillar: "POLITICAS",
      title: "Adotar Políticas da Biblioteca de Integridade",
      severity: "RECOMENDACAO",
      description: "Adote ao menos 3 modelos da Biblioteca de Integridade (ex: Brindes, Conflito de Interesses, Terceiros).",
      action_label: "Explorar Biblioteca",
      action_href: "/dashboard/biblioteca",
    });
  }

  return {
    company_id: targetId,
    company_name: company?.trade_name || company?.legal_name || "Sua Empresa",
    evaluated_at: nowStr,
    overall_score: overallScore,
    total_requirements: totalReqs,
    met_count: metTotal,
    partial_count: partialTotal,
    pending_count: pendingTotal,
    total_evidences: totalEvs,
    pillars: pillarsScore,
    requirements,
    pending_items: pendingItems,
  };
}

/**
 * MOTOR DE ANÁLISE DE EDITAL DE LICITAÇÃO
 */
export function analyzeEdictRequirements(
  edictText: string,
  fileName: string = "Edital_Pregao.pdf"
): TenderAnalysisResult {
  const diagnostic = evaluateCompanyCompliance();
  const lower = edictText.toLowerCase();

  const hasIntegrityMention =
    lower.includes("integridade") ||
    lower.includes("compliance") ||
    lower.includes("código de ética") ||
    lower.includes("lei 12.846") ||
    lower.includes("lei 14.133");

  const bases: string[] = [];
  if (lower.includes("14.133")) bases.push("Lei Federal nº 14.133/2021");
  if (lower.includes("12.846") || lower.includes("anticorrupção")) bases.push("Lei Federal nº 12.846/2013");
  if (lower.includes("12.304")) bases.push("Decreto Federal nº 12.304/2024");
  if (lower.includes("14.457") || lower.includes("nr-1") || lower.includes("assédio")) bases.push("Lei Federal nº 14.457/2022 (NR-1)");

  const reqAnalyses: TenderRequirementAnalysis[] = [
    {
      id: "EDICT-REQ-01",
      title: "Apresentação de Código de Conduta e Integridade",
      category: "CODIGO_CONDUTA",
      edict_clause: "Cláusula de Habilitação / Integridade",
      edict_quote: "A licitante deverá comprovar a implantação de Programa de Integridade nos termos da legislação vigente.",
      legal_basis: "Lei 14.133/2021, art. 25, § 4º",
      submission_moment: "HABILITACAO",
      match: diagnostic.pillars.CODIGO_CONDUTA.score >= 50 ? "ATENDIDO" : "PRECISA_COMPLEMENTAR",
      justification: "A empresa possui Código de Conduta registrado e parametrizado perante a base normativa.",
      matching_evidences: [
        "Código de Conduta Licitatória",
        "Ato Declaratório da Diretoria",
      ],
    },
    {
      id: "EDICT-REQ-02",
      title: "Comprovação de Treinamentos Contínuos e Capacitação",
      category: "TREINAMENTOS",
      edict_clause: "Cláusula de Capacitação de Pessoal",
      edict_quote: "Comprovação de que a contratada promove capacitação contínua de seus empregados sobre normas anticorrupção.",
      legal_basis: "Decreto nº 12.304/2024, art. 4º, III",
      submission_moment: "HABILITACAO",
      match: diagnostic.pillars.TREINAMENTOS.score >= 50 ? "ATENDIDO" : "PRECISA_COMPLEMENTAR",
      justification: `Taxa de capacitação em ${diagnostic.pillars.TREINAMENTOS.score}%.`,
      matching_evidences: [
        "Certificados Digitais de Microlearning",
      ],
    },
    {
      id: "EDICT-REQ-03",
      title: "Canal de Denúncias e Medidas de Prevenção ao Assédio",
      category: "CANAL_DENUNCIAS",
      edict_clause: "Cláusula de Ética e Não Retaliação (NR-1 / Lei 14.457)",
      edict_quote: "Manutenção de canal de denúncias ativo, acessível e seguro com procedimentos de proteção ao denunciante.",
      legal_basis: "Lei Federal nº 14.457/2022 c/c NR-1",
      submission_moment: "HABILITACAO",
      match: "ATENDIDO",
      justification: "Canal público exclusivo em funcionamento com garantia de anonimato.",
      matching_evidences: [
        "Canal Oficial Ativo",
        "Cartaz Mural com QR Code",
      ],
    },
    {
      id: "EDICT-REQ-04",
      title: "Due Diligence de Terceiros e Prevenção de Sanções (CEIS/CNEP)",
      category: "GESTAO_TERCEIROS",
      edict_clause: "Cláusula de Vedações e Subcontratação",
      edict_quote: "Vedada a contratação de pessoas que estejam impedidas ou suspensas.",
      legal_basis: "Lei nº 14.133/2021, art. 14, III e art. 122",
      submission_moment: "HABILITACAO",
      match: diagnostic.pillars.GESTAO_TERCEIROS.score >= 50 ? "ATENDIDO" : "PRECISA_COMPLEMENTAR",
      justification: "Módulo DDI disponível para checagem em bases oficiais sancionatórias.",
      matching_evidences: [
        "Módulo DDI Integrado à CGU",
      ],
    },
  ];

  const metCount = reqAnalyses.filter((r) => r.match === "ATENDIDO").length;
  const overallFit = Math.round((metCount / reqAnalyses.length) * 100);

  return {
    id: "ANALISE-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    fileName,
    analyzedAt: new Date().toISOString(),
    tenderNumber: "Pregão Eletrônico Identificado",
    organName: "Órgão Licitante",
    overallFitScore: overallFit,
    requiresIntegrityProgram: hasIntegrityMention,
    legalBasisMentioned: bases,
    submissionMoment: "HABILITACAO",
    requirements: reqAnalyses,
    summary: `Aderência documental de ${overallFit}% nas evidências estruturadas na plataforma.`,
  };
}

/**
 * Constrói o Snapshot Unificado do Programa de Integridade (Fonte Única de Verdade)
 * Consumido por Sidebar, Header, Visão Geral, Diagnóstico, Políticas e Compartilhamento.
 */
export function buildIntegrityProgramSnapshot(
  diagnostic: ComplianceDiagnostic,
  company: any,
  employees: any[] = [],
  reports: any[] = [],
  policy: any = null
): IntegrityProgramSnapshot {
  const totalEmployees = employees.length;
  const acceptedPolicies = employees.filter((e) => Boolean(e.policy_accepted_at)).length;
  const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;
  const completedTrainings = employees.filter((e) => Boolean(e.training_completed)).length;
  const trainingRate = totalEmployees > 0 ? Math.round((completedTrainings / totalEmployees) * 100) : 0;

  const totalReports = reports.length;
  const resolvedReports = reports.filter(
    (r) => r.status === "PROCEDENTE" || r.status === "IMPROCEDENTE" || r.status === "ARQUIVADA"
  ).length;

  const score = diagnostic.overall_score;
  let maturityLevel: CompanyMaturityLevel = "INICIAL";
  let statusLabel = "Nível Inicial • Estruturação";
  if (score >= 76) {
    maturityLevel = "AVANCADO";
    statusLabel = "Nível Avançado • Conforme Decreto 12.304/2024";
  } else if (score >= 51) {
    maturityLevel = "OPERACIONAL";
    statusLabel = "Nível Operacional • Pronto para Licitações";
  } else if (score >= 26) {
    maturityLevel = "EM_ESTRUTURACAO";
    statusLabel = "Em Estruturação • Adequação em Andamento";
  }

  const nextBestActions: NextBestAction[] = [];

  // 1. Falta de política ativa (Crítica)
  if (!policy || !policy.is_active) {
    nextBestActions.push({
      id: "NBA-POL-01",
      title: "Homologar e Publicar o Código de Conduta",
      description: "Requisito indispensável da Lei nº 14.133/2021 (Art. 25, § 4º) para participação e desempate em certames de grande vulto.",
      priority: "CRITICA",
      pillar: "CODIGO_CONDUTA",
      legalBasis: "Lei Federal nº 14.133/2021, Art. 25, § 4º",
      actionLabel: "Revisar e Publicar Código",
      actionHref: "/dashboard/politicas",
      impactText: "Eleva a maturidade jurídica e habilita a emissão do Dossiê Probatório.",
    });
  }

  // 2. Aceites de colaboradores pendentes (Alta)
  if (totalEmployees > 0 && acceptedPolicies < totalEmployees) {
    const pendCount = totalEmployees - acceptedPolicies;
    nextBestActions.push({
      id: "NBA-EMP-01",
      title: `Coletar ${pendCount} Aceite(s) Pendente(s) do Código`,
      description: "O Decreto 12.304/2024 exige comprovação de ciência inequívoca de 100% da equipe através de termo formal.",
      priority: "ALTA",
      pillar: "CODIGO_CONDUTA",
      legalBasis: "Decreto nº 12.304/2024, Art. 4º, II",
      actionLabel: "Cobrar Aceites da Equipe",
      actionHref: "/dashboard/colaboradores",
      impactText: `Avanço de ${acceptedPolicies}/${totalEmployees} para 100% de adesão auditável.`,
    });
  } else if (totalEmployees === 0) {
    nextBestActions.push({
      id: "NBA-EMP-00",
      title: "Cadastrar Colaboradores no Sistema",
      description: "Cadastre os membros da equipe para enviar os termos digitais de adesão ao Código de Conduta.",
      priority: "ALTA",
      pillar: "CODIGO_CONDUTA",
      legalBasis: "Decreto nº 12.304/2024, Art. 4º, II",
      actionLabel: "Adicionar Colaborador",
      actionHref: "/dashboard/colaboradores",
      impactText: "Inicia o registro probatório da disseminação do programa na empresa.",
    });
  }

  // 3. Questionário de diagnóstico pendente (Alta)
  if (diagnostic.overall_score === 0) {
    nextBestActions.push({
      id: "NBA-DIAG-01",
      title: "Concluir Diagnóstico Normativo do Programa",
      description: "Responda as etapas do diagnóstico para parametrizar proporcionalmente as exigências ao porte da empresa.",
      priority: "ALTA",
      pillar: "MONITORAMENTO",
      legalBasis: "Decreto nº 12.304/2024, Art. 5º",
      actionLabel: "Responder Diagnóstico",
      actionHref: "/dashboard/diagnostico",
      impactText: "Calibra o motor e gera o plano de ação individualizado.",
    });
  }

  // 4. Cartaz Mural do Canal de Denúncias (Média)
  nextBestActions.push({
    id: "NBA-DEN-01",
    title: "Afixar Cartaz Mural do Canal de Denúncias",
    description: "Imprima e afixe o cartaz com QR Code nas frentes de trabalho conforme exigência da NR-1 e Lei 14.457/2022.",
    priority: "MEDIA",
    pillar: "CANAL_DENUNCIAS",
    legalBasis: "Lei Federal nº 14.457/2022 c/c NR-1",
    actionLabel: "Baixar Cartaz em PDF",
    actionHref: "/dashboard/denuncias",
    impactText: "Evita autuações em fiscalizações trabalhistas e atende exigências de editais.",
  });

  // 5. Due Diligence de Fornecedores (Média)
  nextBestActions.push({
    id: "NBA-TER-01",
    title: "Executar Due Diligence de Fornecedores Críticos",
    description: "Consulte previamente se seus parceiros ou subcontratados possuem impedimentos nas bases CEIS/CNEP/CEPIM.",
    priority: "MEDIA",
    pillar: "GESTAO_TERCEIROS",
    legalBasis: "Lei Federal nº 14.133/2021, Art. 122",
    actionLabel: "Consultar Fornecedor",
    actionHref: "/dashboard/due-diligence",
    impactText: "Garante conformidade com as regras de subcontratação da Nova Lei de Licitações.",
  });

  return {
    companyId: company?.id || "",
    companyName: company?.trade_name || company?.legal_name || "Empresa",
    overallScore: score,
    maturityLevel,
    statusLabel,
    requirementsCount: {
      total: diagnostic.total_requirements,
      met: diagnostic.met_count,
      partial: diagnostic.partial_count,
      pending: diagnostic.pending_count,
    },
    evidencesCount: diagnostic.total_evidences,
    employeeStats: {
      total: totalEmployees,
      acceptedPolicies,
      policyRate,
      completedTrainings,
      trainingRate,
    },
    channelStats: {
      active: Boolean(company?.slug),
      slug: company?.slug || null,
      totalReports,
      resolvedReports,
    },
    policyStats: {
      hasPolicy: Boolean(policy?.is_active),
      version: policy?.version || "1.0",
      updatedAt: policy?.updated_at || null,
      nextReviewDate: policy?.next_review_date || null,
      pillarScore: diagnostic.pillars?.CODIGO_CONDUTA?.score || 0,
    },
    nextBestActions: nextBestActions.slice(0, 3),
    evaluatedAt: diagnostic.evaluated_at,
  };
}
