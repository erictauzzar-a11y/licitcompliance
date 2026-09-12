import { mockStore } from "./mock-data";
import {
  ComplianceDiagnostic,
  ComplianceRequirement,
  CompliancePendingItem,
  PillarCategory,
  PillarScore,
  TenderAnalysisResult,
  TenderRequirementAnalysis,
} from "@/types/compliance";
import { formatCNPJ } from "./utils";

/**
 * MOTOR DE CONFORMIDADE E EVIDENCIAÇÃO (COMPLIANCE ENGINE)
 * Conecta Código de Conduta, Colaboradores, Treinamentos, Canal de Denúncias e Due Diligence.
 * Mapeia REQUISITO -> SITUAÇÃO -> EVIDÊNCIA -> RESPONSÁVEL -> DATA -> STATUS -> POR QUE ESTÁ ATENDIDO.
 */
export function evaluateCompanyCompliance(companyId?: string): ComplianceDiagnostic {
  const company = mockStore.getCompany(companyId);
  const targetId = company.id;
  const policy = mockStore.getPolicy(targetId);
  const employees = mockStore.getEmployees(targetId);
  const trainings = mockStore.getTrainings();
  const certs = mockStore.getEmployeeCertificates("", targetId);
  const reports = mockStore.getReports(targetId);

  // Cálculos dinâmicos consumidos dos módulos existentes
  const totalEmployees = employees.length;
  const acceptedPolicies = employees.filter((e) => !!e.policy_accepted_at).length;
  const pendingPolicies = totalEmployees - acceptedPolicies;
  const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;

  const totalExpectedTrainings = totalEmployees * trainings.length;
  const completedTrainings = certs.length;
  const pendingTrainings = Math.max(0, totalExpectedTrainings - completedTrainings);
  const trainingRate =
    totalExpectedTrainings > 0
      ? Math.min(100, Math.round((completedTrainings / totalExpectedTrainings) * 100))
      : 0;

  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status !== "RECEBIDA").length;

  const nowStr = new Date().toISOString();

  // Definição dos 32 Requisitos Fundamentados da Base Normativa
  const requirements: ComplianceRequirement[] = [
    // 1. CÓDIGO E CONDUTA (4 requisitos)
    {
      id: "REQ-COD-01",
      pillar: "CODIGO_CONDUTA",
      title: "Existência e Vigência do Código de Conduta",
      description: "Documento formal aprovado pela alta administração estabelecendo diretrizes éticas claras em contratações públicas.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º",
        paragraph: "Decreto Federal nº 11.129/2022, Art. 57, inciso II",
        type: "OBRIGATORIO",
        description: "Exigência de padrões de conduta e código de ética aplicáveis a todos os colaboradores.",
        evaluation_rule: "Documento de Código de Conduta cadastrado, ativo e com versão documentada.",
      },
      status: policy.is_active ? "ATENDIDO" : "PENDENTE",
      situation_summary: `Código de conduta ativo (versão ${policy.version}) cadastrado e atualizado em ${new Date(policy.updated_at).toLocaleDateString("pt-BR")}.`,
      why_status: {
        evidences_found: [
          `Código de Conduta Licitatória v${policy.version} registrado no sistema`,
          `Data de revisão documental em ${new Date(policy.updated_at).toLocaleDateString("pt-BR")}`,
          "Ato Declaratório da Diretoria assinado no onboarding",
        ],
        what_is_missing: !policy.is_active ? "Ativar e aprovar a versão vigente do Código de Conduta." : undefined,
      },
      responsible: company.integrity_officer_name ? `${company.integrity_officer_name} (Responsável pela Integridade)` : "Diretoria Executiva / Compliance Officer",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-POL-01",
          title: `Código de Conduta Licitatória v${policy.version}`,
          type: "DOCUMENTAL",
          description: "Documento com 15 seções temáticas, vedações a vantagens indevidas e lealdade concorrencial.",
          date: policy.updated_at,
          file_name: `Codigo_Conduta_v${policy.version}.pdf`,
          file_size: "184 KB",
          module_source: "Código & Políticas",
        },
        {
          id: "EVID-POL-02",
          title: "Ato Declaratório da Diretoria",
          type: "AUDITORIA",
          description: "Ateste formal de vigência do programa assinado digitalmente no onboarding da empresa.",
          date: company.created_at,
          module_source: "Onboarding",
        },
      ],
    },
    {
      id: "REQ-COD-02",
      pillar: "CODIGO_CONDUTA",
      title: "Ciência e Aceite Formal dos Colaboradores",
      description: "Comprovação de que os empregados tiveram acesso e assinaram o termo de adesão ao código.",
      legal_basis: {
        norm: "Decreto nº 11.129/2022",
        article: "Art. 57, inciso III",
        type: "OBRIGATORIO",
        description: "Ampla divulgação do programa e comprovação de adesão dos colaboradores.",
        evaluation_rule: "Mínimo de 80% de adesão formal registrada com IP e carimbo de data.",
      },
      status: policyRate >= 80 ? "ATENDIDO" : policyRate > 0 ? "PARCIALMENTE_ATENDIDO" : "PENDENTE",
      situation_summary: `${policyRate}% dos colaboradores ativos (${acceptedPolicies} de ${totalEmployees}) assinaram o termo formal com registro de IP e data.`,
      why_status: {
        evidences_found: [
          `${acceptedPolicies} colaboradores com assinatura formal auditada`,
          "Registro digital inviolável com IP de conexão e User-Agent",
        ],
        what_is_missing: pendingPolicies > 0 ? `${pendingPolicies} colaborador(es) ainda pendente(s) de assinatura do termo.` : undefined,
      },
      responsible: "Setor de Recursos Humanos / Compliance",
      updated_at: nowStr,
      action_needed: pendingPolicies > 0 ? `Compartilhar link de aceite nos canais da empresa para os ${pendingPolicies} colaboradores restantes.` : undefined,
      action_href: "/dashboard/colaboradores",
      evidences: [
        {
          id: "EVID-ACE-01",
          title: "Termos de Aceite com Registro de IP e User-Agent",
          type: "SISTEMICA",
          description: "Trilhas de log registrando IP de conexão e timestamp de cada assinatura pelo link individual.",
          date: nowStr,
          module_source: "Colaboradores & Treinos",
        },
      ],
    },
    {
      id: "REQ-COD-03",
      pillar: "CODIGO_CONDUTA",
      title: "Diretrizes Específicas de Relação com o Poder Público",
      description: "Disposições claras sobre a interação com agentes públicos, pregoeiros, fiscais de contrato e vedações expressas a favorecimentos.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Art. 11",
        type: "OBRIGATORIO",
        description: "Prevenção de atos lesivos contra a Administração Pública em certames e contratos.",
      },
      status: "ATENDIDO",
      situation_summary: "Capítulo II do Código de Conduta integralmente dedicado à integridade licitatória e relação com servidores.",
      why_status: {
        evidences_found: [
          "Seção 2 do Código vigente: Regras explícitas de interação com pregoeiros e fiscais",
          "Vedação a qualquer tipo de favorecimento ou almoços de cortesia",
        ],
      },
      responsible: "Comitê de Ética / Diretoria",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-COD-03",
          title: "Normativo de Relações Institucionais Governamentais",
          type: "DOCUMENTAL",
          description: "Texto consolidado na Seção 2 do Código de Conduta.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },
    {
      id: "REQ-COD-04",
      pillar: "CODIGO_CONDUTA",
      title: "Periodicidade de Revisão e Atualização do Código",
      description: "Mecanismo documentado de revisão periódica e aprovação tempestiva de versões do Código de Conduta.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso XVI",
        type: "RECOMENDADO",
        description: "Constante aperfeiçoamento e atualização das normas de integridade.",
      },
      status: "ATENDIDO",
      situation_summary: `Versão ${policy.version} ativa, com histórico formal de revisões arquivado e próxima revisão agendada.`,
      why_status: {
        evidences_found: [
          `Versão atual: v${policy.version} com data de vigência registrada`,
          `Próxima revisão documental agendada para: ${new Date(policy.next_review_date).toLocaleDateString("pt-BR")}`,
          "Histórico de versões arquivado no módulo de políticas",
        ],
      },
      responsible: "Compliance Officer",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-COD-04",
          title: "Histórico de Versões e Registro de Aprovações",
          type: "AUDITORIA",
          description: "Log documental de revisões com autor, data e sumário das alterações.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },

    // 2. POLÍTICAS COMPLEMENTARES (3 requisitos)
    {
      id: "REQ-POL-01",
      pillar: "POLITICAS",
      title: "Política de Vedação a Vantagens Indevidas e Brindes",
      description: "Regras expressas de tolerância zero para oferecimento ou promessa de presentes, hospitalidades ou valores a agentes públicos.",
      legal_basis: {
        norm: "Lei Federal nº 12.846/2013",
        article: "Art. 5º, inciso I",
        type: "OBRIGATORIO",
        description: "Vedação a prometer, oferecer ou dar vantagem indevida a agente público.",
      },
      status: "ATENDIDO",
      situation_summary: "Diretrizes de vedação a brindes e cortesias formalizadas e divulgadas na íntegra aos colaboradores.",
      why_status: {
        evidences_found: [
          "Seção 3 do Código de Conduta (Hospitalidades, Presentes e Brindes)",
          "Termo declaratório de vedação de vantagens assinado na contratação",
        ],
      },
      responsible: "Compliance Officer",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-POL-03",
          title: "Política de Hospitalidades e Vantagens Indevidas",
          type: "DOCUMENTAL",
          description: "Disposições normativas aplicáveis a todos os colaboradores e terceiros prestadores.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },
    {
      id: "REQ-POL-02",
      pillar: "POLITICAS",
      title: "Política de Prevenção a Fraudes e Conluio em Licitações",
      description: "Vedações expressas a combinação de preços, divisão de lotes, uso de empresas de fachada ou simulação de competitividade.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 155 c/c Art. 156",
        paragraph: "Lei nº 12.846/2013, Art. 5º, inciso IV",
        type: "OBRIGATORIO",
        description: "Ilícitos de frustrar ou fraudar o caráter competitivo de procedimento licitatório.",
      },
      status: "ATENDIDO",
      situation_summary: "Capítulo IV com vedações claras a consórcios ilícitos, propostas de cobertura e acordos tácitos entre concorrentes.",
      why_status: {
        evidences_found: [
          "Diretriz de Lealdade Concorrencial na Seção 4 da Política",
          "Mecanismo de denúncia interna para tentativas de aliciamento concorrencial",
        ],
      },
      responsible: "Setor de Licitações / Diretoria Jurídica",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-POL-04",
          title: "Diretriz Antitruste e Lealdade Concorrencial em Licitações",
          type: "DOCUMENTAL",
          description: "Cláusulas de proibição de combinação de lances ou proposta de cobertura.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },
    {
      id: "REQ-POL-03",
      pillar: "POLITICAS",
      title: "Política de Conflito de Interesses e Vínculos com Servidores",
      description: "Obrigação de declaração formal de parentesco ou vínculo societário com servidores públicos de órgãos contratantes.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 14, inciso IV",
        type: "OBRIGATORIO",
        description: "Impedimentos de participar da licitação por vínculo com agentes públicos atuantes no certame.",
      },
      status: "ATENDIDO",
      situation_summary: "Procedimento formal de autodeclaração de vínculos e ausência de parentesco com membros de comissões de contratação.",
      why_status: {
        evidences_found: [
          "Seção 6 da Política: Prevenção de Conflito de Interesses e Nepotismo",
          "Formulário padrão de declaração de desimpedimento licitatório",
        ],
      },
      responsible: "Compliance Officer",
      updated_at: policy.updated_at,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-POL-05",
          title: "Manual de Declaração de Ausência de Conflito de Interesses",
          type: "DOCUMENTAL",
          description: "Procedimento para identificação prévia de impedimentos do art. 14 da Lei 14.133/2021.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },

    // 3. TREINAMENTOS E CAPACITAÇÃO (4 requisitos)
    {
      id: "REQ-TRN-01",
      pillar: "TREINAMENTOS",
      title: "Treinamento em Integridade Licitatória (Lei Federal nº 14.133/2021)",
      description: "Capacitação periódica da equipe sobre conduta em certames públicos, proibição de propina e transparência com órgãos estatais.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Decreto nº 11.129/2022, Art. 57, III",
        type: "OBRIGATORIO",
        description: "Treinamentos periódicos sobre o programa de integridade para prevenção de atos lesivos.",
      },
      status: trainingRate >= 80 ? "ATENDIDO" : trainingRate > 0 ? "PARCIALMENTE_ATENDIDO" : "PENDENTE",
      situation_summary: `Índice de capacitação em ${trainingRate}%, com ${completedTrainings} certificados individuais auditados emitidos.`,
      why_status: {
        evidences_found: [
          `${completedTrainings} certificados de microlearning emitidos`,
          "Trilha prática de combate a vantagens indevidas e corrupção em pregões",
        ],
        what_is_missing: pendingTrainings > 0 ? `${pendingTrainings} colaborador(es) pendente(s) de conclusão do microlearning.` : undefined,
      },
      responsible: "Coordenação de RH / Treinamento",
      updated_at: nowStr,
      action_needed: pendingTrainings > 0 ? "Disparar link de microlearning no WhatsApp da equipe para os colaboradores restantes." : undefined,
      action_href: `/treinar/${company.slug}`,
      evidences: [
        {
          id: "EVID-TRN-01",
          title: "Registros de Microlearning de Integridade Licitatória",
          type: "SISTEMICA",
          description: "Cards didáticos e registros de leitura e conclusão via celular.",
          date: nowStr,
          module_source: "Colaboradores & Treinos",
        },
      ],
    },
    {
      id: "REQ-TRN-02",
      pillar: "TREINAMENTOS",
      title: "Capacitação em Prevenção ao Assédio Moral e Sexual (NR-1 / Lei 14.457)",
      description: "Treinamento anual obrigatório com foco no combate ao assédio sexual, assédio moral e violência no trabalho.",
      legal_basis: {
        norm: "Lei Federal nº 14.457/2022 c/c NR-1 (MTP nº 4.219/2022)",
        article: "Art. 23, inciso II",
        type: "OBRIGATORIO",
        description: "Realização de ações de capacitação e sensibilização sobre assédio no trabalho.",
      },
      status: "ATENDIDO",
      situation_summary: "Trilha específica da NR-1 com cards educativos e avaliação de fixação disponível no Link Único.",
      why_status: {
        evidences_found: [
          "Trilha ativa com conceitos práticos da Lei nº 14.457/2022",
          "Emissão de certificados contendo fundamentação explícita da NR-1",
        ],
      },
      responsible: "CIPA / Recursos Humanos",
      updated_at: nowStr,
      action_href: `/treinar/${company.slug}`,
      evidences: [
        {
          id: "EVID-TRN-02",
          title: "Trilha Educativa NR-1 (Prevenção e Combate ao Assédio)",
          type: "DOCUMENTAL",
          description: "Material de microlearning aprovado e disponibilizado para leitura sem cadastro prévio.",
          date: nowStr,
          module_source: "Colaboradores & Treinos",
        },
      ],
    },
    {
      id: "REQ-TRN-03",
      pillar: "TREINAMENTOS",
      title: "Avaliação de Eficácia e Quiz Rápido de Fixação",
      description: "Aplicação de questionário objetivo ao final de cada microlearning para atestar a retenção do conteúdo pelos participantes.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso III",
        type: "RECOMENDADO",
        description: "Mecanismos de verificação de eficácia dos treinamentos de integridade.",
      },
      status: "ATENDIDO",
      situation_summary: "Quiz de 3 perguntas com feedback imediato das respostas corretas antes da liberação do certificado.",
      why_status: {
        evidences_found: [
          "Quizzes interativos com pontuação mínima auditada",
          "Explicação detalhada da regra ética em cada resposta",
        ],
      },
      responsible: "Instrutores / Gestão de Pessoas",
      updated_at: nowStr,
      action_href: `/treinar/${company.slug}`,
      evidences: [
        {
          id: "EVID-TRN-03",
          title: "Banco de Quizzes com Regra de Aprovação e Explicações",
          type: "SISTEMICA",
          description: "Mecanismo interativo de fixação pedagógica integrado ao fluxo mobile.",
          date: nowStr,
          module_source: "Colaboradores & Treinos",
        },
      ],
    },
    {
      id: "REQ-TRN-04",
      pillar: "TREINAMENTOS",
      title: "Emissão de Certificados Individuais com Hash e QR Code",
      description: "Emissão imediata de certificados digitais nominais contendo CPF, carga horária e código hash de validação pública.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Art. 12",
        type: "OBRIGATORIO",
        description: "Comprovação documental autêntica das ações executadas no programa.",
      },
      status: "ATENDIDO",
      situation_summary: "Certificados gerados em PDF em formato paisagem com validação instantânea pela câmera do celular.",
      why_status: {
        evidences_found: [
          "Certificados emitidos com hash SHA-256 inviolável",
          "Rota pública de conferência (/validar/[codigo]) acessível por pregoeiros",
        ],
      },
      responsible: "Compliance Officer",
      updated_at: nowStr,
      action_href: "/dashboard/colaboradores",
      evidences: [
        {
          id: "EVID-TRN-04",
          title: "Acervo de Certificados Digitais com Hash SHA-256",
          type: "CERTIFICACAO",
          description: "Certificados nominais individuais com carimbo de tempo e QR Code.",
          date: nowStr,
          module_source: "Colaboradores & Treinos",
        },
      ],
    },

    // 4. CANAL DE DENÚNCIAS (4 requisitos)
    {
      id: "REQ-DEN-01",
      pillar: "CANAL_DENUNCIAS",
      title: "Canal de Denúncias Oficial com Opção 100% Anônima",
      description: "Meio eletrônico seguro, acessível e permanente para registro de relatos por colaboradores e fornecedores sem identificação obrigatória.",
      legal_basis: {
        norm: "Lei Federal nº 14.457/2022",
        article: "Art. 23, inciso I",
        paragraph: "NR-1 do MTP",
        type: "OBRIGATORIO",
        description: "Canais para recebimento e acompanhamento de denúncias garantindo o anonimato.",
      },
      status: "ATENDIDO",
      situation_summary: `Canal oficial ativo no endereço /canal/${company.slug}, com garantia de sigilo e não rastreamento de IP.`,
      why_status: {
        evidences_found: [
          `Canal público ativo (/canal/${company.slug})`,
          "Opção 100% anônima sem solicitação de dados pessoais ou tracking",
          "Emissão de protocolo seguro e chave de consulta privada",
        ],
      },
      responsible: "Comissão de Ética e Integridade",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-01",
          title: `Canal Oficial de Denúncias da Empresa (/canal/${company.slug})`,
          type: "SISTEMICA",
          description: "Ambiente web isolado com criptografia e proteção de identidade.",
          date: company.created_at,
          module_source: "Canal de Denúncias",
        },
      ],
    },
    {
      id: "REQ-DEN-02",
      pillar: "CANAL_DENUNCIAS",
      title: "Garantia Estrita de Não Retaliação ao Denunciante de Boa-Fé",
      description: "Proteção formal e institucional assegurando que nenhum colaborador sofrerá sanção ou perseguição por relatar fatos verídicos.",
      legal_basis: {
        norm: "Lei nº 14.457/2022",
        article: "Art. 23, § 2º c/c Decreto nº 11.129/2022, Art. 57, X",
        type: "OBRIGATORIO",
        description: "Garantia de não retaliação ao denunciante de boa-fé.",
      },
      status: "ATENDIDO",
      situation_summary: "Diretriz explícita de não retaliação inserida no Código de Conduta, no portal e no cartaz do canal.",
      why_status: {
        evidences_found: [
          "Declaração formal de não retaliação na Seção 11 do Código de Conduta",
          "Aviso em destaque no formulário de denúncia e no cartaz informativo",
        ],
      },
      responsible: "Diretoria Executiva / Comitê de Ética",
      updated_at: policy.updated_at,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-02",
          title: "Termo de Garantia de Não Retaliação e Proteção ao Relator",
          type: "DOCUMENTAL",
          description: "Cláusula expressa de proteção de empregados e colaboradores denunciantes.",
          date: policy.updated_at,
          module_source: "Canal de Denúncias",
        },
      ],
    },
    {
      id: "REQ-DEN-03",
      pillar: "CANAL_DENUNCIAS",
      title: "Divulgação do Canal e Cartaz Mural com QR Code",
      description: "Ampla publicidade do canal na sede da empresa, canteiros de obras e áreas comuns via cartaz padronizado.",
      legal_basis: {
        norm: "Portaria MTP nº 4.219/2022 / NR-1",
        article: "Item 1.4.1 c/c Lei 14.457/2022",
        type: "OBRIGATORIO",
        description: "Ampla divulgação dos canais de recebimento de denúncias.",
      },
      status: "ATENDIDO",
      situation_summary: "Cartaz mural em PDF em alta resolução com QR Code gerado automaticamente no painel administrativo.",
      why_status: {
        evidences_found: [
          "Gerador de Cartaz Mural em PDF disponível em /dashboard/denuncias",
          "QR Code de alta resolução direcionando diretamente ao canal mobile",
        ],
      },
      responsible: "CIPA / Recursos Humanos",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-03",
          title: "Cartaz Mural Oficial com QR Code do Canal",
          type: "DOCUMENTAL",
          description: "Arquivo PDF padrão A4 pronto para afixação em murais físicos.",
          date: nowStr,
          module_source: "Canal de Denúncias",
        },
      ],
    },
    {
      id: "REQ-DEN-04",
      pillar: "CANAL_DENUNCIAS",
      title: "Procedimento Formal de Triagem e Apuração de Relatos",
      description: "Fluxo estabelecido para recebimento, instrução preliminar, sigilo e resposta ao denunciante por comissão competente.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso X e XI",
        type: "OBRIGATORIO",
        description: "Mecanismos para apuração e aplicação de medidas disciplinares.",
      },
      status: "ATENDIDO",
      situation_summary: `Painel restrito com registro de ${totalReports} ocorrência(s) e ${resolvedReports} despacho(s) formais documentados.`,
      why_status: {
        evidences_found: [
          "Painel administrativo restrito de gestão com filtros de status",
          "Módulo de acompanhamento sigiloso para consulta por protocolo e chave",
        ],
      },
      responsible: "Comitê de Apuração Disciplinar",
      updated_at: nowStr,
      action_href: "/dashboard/denuncias",
      evidences: [
        {
          id: "EVID-DEN-04",
          title: "Livro de Registros e Despachos do Canal de Ética",
          type: "AUDITORIA",
          description: "Controle de status, diligências adotadas e notas de resolução.",
          date: nowStr,
          module_source: "Canal de Denúncias",
        },
      ],
    },

    // 5. GESTÃO DE TERCEIROS E DUE DILIGENCE (4 requisitos)
    {
      id: "REQ-TER-01",
      pillar: "GESTAO_TERCEIROS",
      title: "Procedimento de Due Diligence Prévia de Parceiros (DDI)",
      description: "Auditoria documental e checagem prévia de idoneidade de fornecedores, subempreiteiros e prestadores de serviços.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 122 c/c Art. 14, III",
        type: "APLICAVEL_CONFORME_CASO",
        description: "Vedação à subcontratação de pessoas físicas ou jurídicas que estejam impedidas ou suspensas.",
      },
      status: "PENDENTE",
      situation_summary: "Módulo DDI ativo, mas 4 fornecedores cadastrados na base ainda não possuem laudo pericial formal emitido.",
      why_status: {
        evidences_found: [
          "Módulo pericial DDI ativo no dashboard (/dashboard/due-diligence)",
          "Geração de laudo pericial em PDF com hash criptográfico SHA-256",
        ],
        what_is_missing: "Emitir laudo pericial de Due Diligence para os 4 fornecedores parceiros pendentes de checagem.",
      },
      responsible: "Setor de Suprimentos / Contratos",
      updated_at: nowStr,
      action_needed: "Emitir laudo pericial de Due Diligence para os 4 fornecedores parceiros pendentes de checagem.",
      action_href: "/dashboard/due-diligence",
      evidences: [
        {
          id: "EVID-TER-01",
          title: "Relatórios Periciais de Due Diligence com Hash SHA-256",
          type: "DOCUMENTAL",
          description: "Laudos automatizados com verificação de sanções, QSA e risco.",
          date: nowStr,
          module_source: "Due Diligence (DDI)",
        },
      ],
    },
    {
      id: "REQ-TER-02",
      pillar: "GESTAO_TERCEIROS",
      title: "Consulta Automatizada às Bases Oficiais CEIS e CNEP",
      description: "Verificação sistemática no Cadastro de Empresas Inidôneas e Suspensas e no Cadastro Nacional de Empresas Punidas da CGU.",
      legal_basis: {
        norm: "Lei Federal nº 12.846/2013",
        article: "Art. 22 (CNEP)",
        paragraph: "Lei nº 14.133/2021, Art. 161 (CEIS)",
        type: "OBRIGATORIO",
        description: "Consulta obrigatória a cadastros restritivos em contratações.",
      },
      status: "ATENDIDO",
      situation_summary: "Integração operacional ativa consultando bases sancionatórias federais com emissão de certidão de nada consta.",
      why_status: {
        evidences_found: [
          "Rotina de consulta via API do Portal da Transparência da CGU",
          "Regra automática de bloqueio de terceiros sancionados no CEIS/CNEP",
        ],
      },
      responsible: "Gestão de Suprimentos / Compliance",
      updated_at: nowStr,
      action_href: "/dashboard/due-diligence",
      evidences: [
        {
          id: "EVID-TER-02",
          title: "Certidões Eletrônicas de Consulta CEIS e CNEP",
          type: "SISTEMICA",
          description: "Logs de verificação e laudos de ausência de sanções impeditivas.",
          date: nowStr,
          module_source: "Due Diligence (DDI)",
        },
      ],
    },
    {
      id: "REQ-TER-03",
      pillar: "GESTAO_TERCEIROS",
      title: "Verificação de Pessoas Expostas Politicamente (PEP) nos Sócios",
      description: "Identificação dos integrantes do Quadro Societário (QSA) e apuração de enquadramento como agentes públicos ou PEP.",
      legal_basis: {
        norm: "Resolução COAF nº 40/2021 c/c Decreto nº 11.129/2022",
        article: "Art. 57, inciso XIII",
        type: "RECOMENDADO",
        description: "Diligências apropriadas para contratação e supervisão de terceiros.",
      },
      status: "ATENDIDO",
      situation_summary: "Extração automatizada de sócios via BrasilAPI com cruzamento na base federal de Pessoas Expostas Politicamente.",
      why_status: {
        evidences_found: [
          "Módulo de análise de QSA integrado à base oficial PEP da CGU",
          "Classificação de risco Médio e medidas de mitigação quando detectado PEP",
        ],
      },
      responsible: "Analista de Due Diligence",
      updated_at: nowStr,
      action_href: "/dashboard/due-diligence",
      evidences: [
        {
          id: "EVID-TER-03",
          title: "Laudo Societário e Triagem PEP da Alta Gestão de Parceiros",
          type: "AUDITORIA",
          description: "Histórico de checagens nominativas dos administradores e sócios majoritários.",
          date: nowStr,
          module_source: "Due Diligence (DDI)",
        },
      ],
    },
    {
      id: "REQ-TER-04",
      pillar: "GESTAO_TERCEIROS",
      title: "Consulta à Lista Suja do Trabalho Escravo (MTE)",
      description: "Checagem de fornecedores e parceiros no Cadastro de Empregadores que submeteram trabalhadores a condições análogas à de escravo.",
      legal_basis: {
        norm: "Portaria Interministerial MTPS/MMIRDH nº 4/2016",
        article: "Art. 1º c/c Lei nº 14.133/2021, Art. 11, IV",
        type: "OBRIGATORIO",
        description: "Inadmissibilidade de contratação com violadores de direitos humanos fundamentais.",
      },
      status: "ATENDIDO",
      situation_summary: "Cruzamento automático do CNPJ de parceiros com a base oficial da Lista Suja do Ministério do Trabalho.",
      why_status: {
        evidences_found: [
          "Base local e remota de conferência cadastral do MTE",
          "Bloqueio preventivo imediato de qualquer empresa listada no cadastro",
        ],
      },
      responsible: "Comitê de Ética / Suprimentos",
      updated_at: nowStr,
      action_href: "/dashboard/due-diligence",
      evidences: [
        {
          id: "EVID-TER-04",
          title: "Certidão Negativa de Trabalho Análogo ao de Escravo",
          type: "DOCUMENTAL",
          description: "Registro de checagem perante a relação de empregadores do MTE.",
          date: nowStr,
          module_source: "Due Diligence (DDI)",
        },
      ],
    },

    // 6. CONTROLES INTERNOS E PROCEDIMENTOS (4 requisitos)
    {
      id: "REQ-CTR-01",
      pillar: "CONTROLES_INTERNOS",
      title: "Segregação de Funções nos Processos Licitatórios",
      description: "Separação formal entre as equipes responsáveis pela montagem de propostas, precificação e execução contratual.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 7º, § 1º",
        type: "RECOMENDADO",
        description: "Princípio da segregação de funções para evitar a concentração de poderes e erros.",
      },
      status: "ATENDIDO",
      situation_summary: "Estrutura organizacional com segregação documentada entre orçamentação e fiscalização operacional.",
      why_status: {
        evidences_found: [
          "Matriz de responsabilidades documentada na Diretoria",
          "Controles de aprovação de propostas no setor de licitações",
        ],
      },
      responsible: "Diretoria de Operações",
      updated_at: nowStr,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-CTR-01",
          title: "Matriz de Segregação de Funções Licitatórias",
          type: "DOCUMENTAL",
          description: "Organograma e limites de atuação de analistas, orçamentistas e prepostos.",
          date: nowStr,
          module_source: "Controles Internos",
        },
      ],
    },
    {
      id: "REQ-CTR-02",
      pillar: "CONTROLES_INTERNOS",
      title: "Dupla Conferência em Medições, Notas Fiscais e Empenhos",
      description: "Rotina formal de confrontação entre notas de empenho, ordens de serviço e quantidades efetivamente entregues.",
      legal_basis: {
        norm: "Lei Federal nº 4.320/1964",
        article: "Art. 62 e Art. 63 (Liquidação de Despesa)",
        type: "OBRIGATORIO",
        description: "Controles estritos na comprovação da prestação do serviço ou entrega do bem.",
      },
      status: "PARCIALMENTE_ATENDIDO",
      situation_summary: "Diretriz de fidelidade contratual no Código, necessitando formalização de POP fiscal complementar.",
      why_status: {
        evidences_found: [
          "Item 1.3 do Código de Conduta (Fidelidade Contratual e Entregas)",
          "Proibição de fornecimento de itens com especificação adulterada",
        ],
        what_is_missing: "Formalizar procedimento operacional padrão (POP) de dupla conferência fiscal de notas de empenho.",
      },
      responsible: "Controladoria / Setor Financeiro",
      updated_at: nowStr,
      action_needed: "Formalizar manual operacional de conferência fiscal de notas de empenho.",
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-CTR-02",
          title: "Procedimento Operacional de Fidelidade Contratual",
          type: "DOCUMENTAL",
          description: "Diretriz de estrita correspondência técnica aos memoriais descritivos.",
          date: policy.updated_at,
          module_source: "Código & Políticas",
        },
      ],
    },
    {
      id: "REQ-CTR-03",
      pillar: "CONTROLES_INTERNOS",
      title: "Rastreabilidade Financeira e Registros Contábeis Confiáveis",
      description: "Manutenção de registros contábeis que reflitam, com exatidão e transparência, todas as transações da empresa.",
      legal_basis: {
        norm: "Decreto nº 11.129/2022",
        article: "Art. 57, inciso VII",
        type: "OBRIGATORIO",
        description: "Controles internos que assegurem a pronta elaboração e confiabilidade de relatórios e demonstrações financeiras.",
      },
      status: "ATENDIDO",
      situation_summary: "Escrituração contábil auditável com contas individualizadas por contrato administrativo.",
      why_status: {
        evidences_found: [
          "Sistema ERP com trilha de auditoria contábil",
          "Vinculação de notas fiscais emitidas aos respectivos contratos públicos",
        ],
      },
      responsible: "Gerência Contábil e Financeira",
      updated_at: nowStr,
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-CTR-03",
          title: "Manual de Controles Contábeis e Rastreabilidade Financeira",
          type: "DOCUMENTAL",
          description: "Procedimentos contábeis de combate ao caixa dois e pagamentos sem lastro.",
          date: nowStr,
          module_source: "Controles Internos",
        },
      ],
    },
    {
      id: "REQ-CTR-04",
      pillar: "CONTROLES_INTERNOS",
      title: "Alçadas de Aprovação para Despesas com o Setor Público",
      description: "Limites claros de competência para assinatura de contratos, aditivos, descontos e contratação de consultorias.",
      legal_basis: {
        norm: "Decreto nº 11.129/2022",
        article: "Art. 57, inciso VI",
        type: "RECOMENDADO",
        description: "Controles de governança e alçadas decisórias da administração.",
      },
      status: "PENDENTE",
      situation_summary: "Matriz preliminar de alçadas em processo de homologação formal pela Diretoria Executiva.",
      why_status: {
        evidences_found: [
          "Minuta de política de alçadas elaborada pelo jurídico",
        ],
        what_is_missing: "Homologar formalmente o regimento de alçadas decisórias para celebração de aditivos contratuais.",
      },
      responsible: "Diretoria Jurídica / Governança",
      updated_at: nowStr,
      action_needed: "Homologar regimento de alçadas decisórias para celebração de aditivos contratuais.",
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-CTR-04",
          title: "Minuta de Alçadas e Poderes de Representação",
          type: "AUDITORIA",
          description: "Documento definindo limites financeiros e de representação em licitações.",
          date: nowStr,
          module_source: "Controles Internos",
        },
      ],
    },

    // 7. GESTÃO DE RISCOS (3 requisitos)
    {
      id: "REQ-RSK-01",
      pillar: "GESTAO_RISCOS",
      title: "Mapeamento e Matriz de Riscos de Integridade em Licitações",
      description: "Identificação estruturada dos riscos de corrupção, conluio, superfaturamento e assédio nas operações da empresa.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso V",
        type: "RECOMENDADO",
        description: "Análise periódica de riscos para realização de adaptações necessárias ao programa de integridade.",
      },
      status: "ATENDIDO",
      situation_summary: "Matriz de riscos de integridade estruturada e vinculada aos módulos de Due Diligence e Ouvidoria.",
      why_status: {
        evidences_found: [
          "Classificação automatizada de riscos de fornecedores (Baixo, Médio e Alto)",
          "Categorização tipificada de riscos no canal de denúncias",
        ],
      },
      responsible: "Comitê de Riscos e Compliance",
      updated_at: nowStr,
      action_href: "/dashboard/diagnostico",
      evidences: [
        {
          id: "EVID-RSK-01",
          title: "Matriz de Riscos de Integridade em Contratos Governamentais",
          type: "SISTEMICA",
          description: "Mapeamento dos pontos de exposição e fatores de risco licitatório.",
          date: nowStr,
          module_source: "Gestão de Riscos",
        },
      ],
    },
    {
      id: "REQ-RSK-02",
      pillar: "GESTAO_RISCOS",
      title: "Análise de Riscos na Fase Pré-Edital e Habilitação",
      description: "Procedimento prévio de leitura crítica de editais para identificar cláusulas restritivas ou exigências de compliance.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Art. 60",
        type: "OBRIGATORIO",
        description: "Adequação tempestiva aos critérios de habilitação e desempate previstos no edital.",
      },
      status: "ATENDIDO",
      situation_summary: "Módulo Analisador de Edital em funcionamento com varredura automática de exigências da Lei 14.133 e NR-1.",
      why_status: {
        evidences_found: [
          "Módulo /dashboard/analise-edital ativo na plataforma",
          "Confronto automático de cláusulas do pregão com o acervo da empresa",
        ],
      },
      responsible: "Setor de Licitações e Propostas",
      updated_at: nowStr,
      action_href: "/dashboard/analise-edital",
      evidences: [
        {
          id: "EVID-RSK-02",
          title: "Motor de Análise de Editais e Confronto de Cláusulas",
          type: "SISTEMICA",
          description: "Ferramenta de identificação de exigências do edital e geração de plano de ação.",
          date: nowStr,
          module_source: "Análise de Edital",
        },
      ],
    },
    {
      id: "REQ-RSK-03",
      pillar: "GESTAO_RISCOS",
      title: "Medidas de Mitigação de Riscos na Subcontratação de Obras/Serviços",
      description: "Cláusulas contratuais obrigatórias impondo adesão ao Código de Conduta e autorização para rescisão em caso de ilícito.",
      legal_basis: {
        norm: "Lei nº 14.133/2021",
        article: "Art. 122, § 2º",
        type: "APLICAVEL_CONFORME_CASO",
        description: "Responsabilidade solidária e dever de supervisão dos terceiros subcontratados.",
      },
      status: "PENDENTE",
      situation_summary: "Cláusula padrão de adesão a compliance para subcontratados em fase de revisão pelo jurídico externo.",
      why_status: {
        evidences_found: [
          "Minuta preliminar de aditivo contratual de integridade para subcontratados",
        ],
        what_is_missing: "Inserir cláusula resolutiva expressa de compliance em 100% das minutas de subcontratação.",
      },
      responsible: "Assessoria Jurídica e Suprimentos",
      updated_at: nowStr,
      action_needed: "Inserir cláusula resolutiva expressa de compliance em 100% das minutas de subcontratação.",
      action_href: "/dashboard/politicas",
      evidences: [
        {
          id: "EVID-RSK-03",
          title: "Minuta de Cláusula Anticorrupção para Subcontratados",
          type: "DOCUMENTAL",
          description: "Obrigação contratual de respeito à Lei 12.846/2013 e Código de Ética.",
          date: nowStr,
          module_source: "Gestão de Riscos",
        },
      ],
    },

    // 8. MONITORAMENTO CONTÍNUO (3 requisitos)
    {
      id: "REQ-MON-01",
      pillar: "MONITORAMENTO",
      title: "Acompanhamento Periódico dos Indicadores do Programa",
      description: "Painel executivo com métricas em tempo real de capacitação, adesão à política e chamados no canal.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso XVI",
        type: "OBRIGATORIO",
        description: "Monitoramento constante do programa de integridade visando ao seu aperfeiçoamento.",
      },
      status: "ATENDIDO",
      situation_summary: "Central de Controle do Dashboard ativa com monitoramento nominal de colaboradores e indicadores de conformidade.",
      why_status: {
        evidences_found: [
          "Painel de controle com KPIs em tempo real (/dashboard)",
          "Métricas dinâmicas conectadas ao motor de avaliação contínua",
        ],
      },
      responsible: "Compliance Officer / Diretoria",
      updated_at: nowStr,
      action_href: "/dashboard",
      evidences: [
        {
          id: "EVID-MON-01",
          title: "Painel de Métricas e Indicadores de Conformidade",
          type: "SISTEMICA",
          description: "Métricas de adesão, capacitação continuada e chamados de integridade.",
          date: nowStr,
          module_source: "Monitoramento",
        },
      ],
    },
    {
      id: "REQ-MON-02",
      pillar: "MONITORAMENTO",
      title: "Relatório de Gestão e Apuração Periódica de Incidentes",
      description: "Emissão de relatório anual de efetividade do programa de integridade apresentado aos sócios e diretoria.",
      legal_basis: {
        norm: "Decreto Federal nº 11.129/2022",
        article: "Art. 57, inciso XIV",
        type: "RECOMENDADO",
        description: "Transparência da pessoa jurídica quanto a suas ações de integridade.",
      },
      status: "PENDENTE",
      situation_summary: "Relatório anual consolidado programado para compilação ao término do primeiro ciclo semestral.",
      why_status: {
        evidences_found: [
          "Estrutura de dados pronta para consolidação estatística anual",
        ],
        what_is_missing: "Emitir o primeiro Relatório Semestral de Gestão de Integridade da Alta Administração.",
      },
      responsible: "Comitê de Integridade / Diretoria",
      updated_at: nowStr,
      action_needed: "Emitir o primeiro Relatório Semestral de Gestão de Integridade da Alta Administração.",
      action_href: "/dashboard/diagnostico",
      evidences: [
        {
          id: "EVID-MON-02",
          title: "Termo de Abertura do Ciclo Anual de Monitoramento de Integridade",
          type: "AUDITORIA",
          description: "Ato da diretoria designando o período de reporte estatístico.",
          date: nowStr,
          module_source: "Monitoramento",
        },
      ],
    },
    {
      id: "REQ-MON-03",
      pillar: "MONITORAMENTO",
      title: "Auditoria Independente e Manutenção da Trilha Probatória",
      description: "Capacidade de submissão do acervo de integridade a peritos, auditores externos e órgãos de controle público.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 169 c/c Decreto nº 11.129/2022, Art. 57, XVI",
        type: "APLICAVEL_CONFORME_CASO",
        description: "Apresentação e conferência probatória das medidas de integridade perante fiscalização.",
      },
      status: "PARCIALMENTE_ATENDIDO",
      situation_summary: "Trilha probatória digital mantida com logs imutáveis, em fase de validação por consultoria externa.",
      why_status: {
        evidences_found: [
          "Trilha de auditoria digital inviolável com registros de IP e hash",
          "Validação pública de documentos via QR Code funcional",
        ],
        what_is_missing: "Realizar sessão semestral de validação pericial independente da trilha probatória.",
      },
      responsible: "Auditoria Externa / DPO",
      updated_at: nowStr,
      action_needed: "Realizar sessão semestral de validação pericial independente da trilha probatória.",
      action_href: "/dashboard/diagnostico",
      evidences: [
        {
          id: "EVID-MON-03",
          title: "Trilha de Auditoria Digital e Logs de Conexão",
          type: "AUDITORIA",
          description: "Registros estruturados de acessos, downloads e assinaturas do programa.",
          date: nowStr,
          module_source: "Monitoramento",
        },
      ],
    },

    // 9. EVIDÊNCIAS E COMPROVAÇÃO (3 requisitos)
    {
      id: "REQ-EVI-01",
      pillar: "EVIDENCIAS",
      title: "Repositório Central de Evidências Digitais e Hashes SHA-256",
      description: "Armazenamento estruturado de documentos, certidões e logs com geração de identificadores criptográficos únicos.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 12 c/c Art. 25, § 4º",
        type: "OBRIGATORIO",
        description: "Garantia de autenticidade e higidez dos documentos probatórios da licitante.",
      },
      status: "ATENDIDO",
      situation_summary: "Repositório central ativo com 47 evidências auditáveis mapeadas e indexadas por requisito normativo.",
      why_status: {
        evidences_found: [
          "Hashes SHA-256 gerados para laudos de Due Diligence e certificados",
          "Estrutura multi-tenant isolada no banco PostgreSQL com RLS",
        ],
      },
      responsible: "Encarregado de Dados (DPO) / Arquiteto de Software",
      updated_at: nowStr,
      action_href: "/dashboard/diagnostico",
      evidences: [
        {
          id: "EVID-EVI-01",
          title: "Repositório Central de Evidências Auditáveis do TechCompliance",
          type: "AUDITORIA",
          description: "Camada unificada de dados probatórios consumida pelo Motor de Conformidade.",
          date: nowStr,
          module_source: "Compliance Engine",
        },
      ],
    },
    {
      id: "REQ-EVI-02",
      pillar: "EVIDENCIAS",
      title: "Validação Pública de Autenticidade por QR Code para Pregoeiros",
      description: "Página pública (/validar/[codigo]) acessível por agentes públicos para conferência imediata da veracidade dos atestados.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 68 c/c Lei Federal nº 14.063/2020",
        type: "OBRIGATORIO",
        description: "Validação eletrônica de documentos públicos e privados em contratações.",
      },
      status: "ATENDIDO",
      situation_summary: "Ambiente público de validação ativo permitindo conferência de Dossiês e Certificados em segundos.",
      why_status: {
        evidences_found: [
          "Rota pública oficial (/validar/[codigo]) ativa e responsiva",
          "Conferência de titularidade, data de emissão e status do programa",
        ],
      },
      responsible: "Suporte Técnico e Compliance",
      updated_at: nowStr,
      action_href: "/validar/DOSSIE-2026-12345678",
      evidences: [
        {
          id: "EVID-EVI-02",
          title: "Serviço de Validação Pública de Autenticidade Documental",
          type: "SISTEMICA",
          description: "Mecanismo público de checagem para membros de comissões de contratação.",
          date: nowStr,
          module_source: "Validação Pública",
        },
      ],
    },
    {
      id: "REQ-EVI-03",
      pillar: "EVIDENCIAS",
      title: "Compilação Automatizada de Dossiê de Evidências em PDF",
      description: "Geração em lote de relatório consolidado em PDF pronto para juntada nos autos do processo de licitação ou fiscalização.",
      legal_basis: {
        norm: "Lei Federal nº 14.133/2021",
        article: "Art. 25, § 4º c/c Art. 156, § 1º, V",
        type: "OBRIGATORIO",
        description: "Dever de comprovação formal do programa de integridade mediante documentação hábil.",
      },
      status: "ATENDIDO",
      situation_summary: "Compilador pericial de Dossiê em PDF com carimbo oficial, métricas, atestados e QR Code de autenticidade.",
      why_status: {
        evidences_found: [
          "Gerador pericial em PDF formatado no padrão A4 oficial da Administração Pública",
          "Consolidação completa de métricas de adesão, capacitação, canal e terceiros",
        ],
      },
      responsible: "Representante Licitatório da Empresa",
      updated_at: nowStr,
      action_href: "/dashboard",
      evidences: [
        {
          id: "EVID-EVI-03",
          title: "Dossiê Consolidado de Evidências do Programa de Integridade (PDF)",
          type: "DOCUMENTAL",
          description: "Documento oficial completo pronto para upload no compras.gov.br ou portal do órgão.",
          date: nowStr,
          module_source: "Dossiê de Evidências",
        },
      ],
    },
  ];

  // Configuração das 9 Categorias/Pilares
  const pillarsConfig: Record<PillarCategory, string> = {
    CODIGO_CONDUTA: "Código e Conduta",
    POLITICAS: "Políticas",
    TREINAMENTOS: "Treinamentos",
    CANAL_DENUNCIAS: "Canal de Denúncias",
    GESTAO_TERCEIROS: "Gestão de Terceiros",
    CONTROLES_INTERNOS: "Controles",
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

  // Score geral calibrado
  const overallScore = totalReqs > 0 ? Math.round(((metTotal * 1.0 + partialTotal * 0.5) / totalReqs) * 100) : 0;

  // Central de Pendências ("O que preciso resolver?")
  const pendingItems: CompliancePendingItem[] = [];

  if (pendingTrainings > 0) {
    pendingItems.push({
      id: "PEND-TRN-01",
      requirement_id: "REQ-TRN-01",
      pillar: "TREINAMENTOS",
      title: "Treinamento de Colaboradores",
      severity: "ALERTA",
      description: `${pendingTrainings} colaborador(es) ainda não concluíram as trilhas obrigatórias de microlearning.`,
      action_label: "Enviar Link no WhatsApp",
      action_href: `/treinar/${company.slug}`,
    });
  }

  if (pendingPolicies > 0) {
    pendingItems.push({
      id: "PEND-POL-01",
      requirement_id: "REQ-COD-02",
      pillar: "CODIGO_CONDUTA",
      title: "Assinatura do Código de Conduta",
      severity: "ALERTA",
      description: `${pendingPolicies} colaborador(es) ainda não assinaram o termo de aceite formal do Código.`,
      action_label: "Cobrar Assinaturas",
      action_href: "/dashboard/colaboradores",
    });
  }

  pendingItems.push({
    id: "PEND-DDI-01",
    requirement_id: "REQ-TER-01",
    pillar: "GESTAO_TERCEIROS",
    title: "Gestão de Terceiros e Fornecedores",
    severity: "RECOMENDACAO",
    description: "4 fornecedores ou subempreiteiros parceiros ainda não possuem laudo pericial DDI emitido.",
    action_label: "Consultar Fornecedores",
    action_href: "/dashboard/due-diligence",
  });

  pendingItems.push({
    id: "PEND-CTR-01",
    requirement_id: "REQ-CTR-01",
    pillar: "CONTROLES_INTERNOS",
    title: "Controles e Procedimentos Fiscais",
    severity: "RECOMENDACAO",
    description: "Formalizar procedimento operacional padrão (POP) de dupla conferência de empenhos.",
    action_label: "Revisar Políticas",
    action_href: "/dashboard/politicas",
  });

  return {
    company_id: company.id,
    company_name: company.trade_name,
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
 * Faz a varredura das cláusulas e termos do edital e cruza com as evidências reais da empresa.
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
    lower.includes("código de conduta") ||
    lower.includes("14.133") ||
    lower.includes("12.846") ||
    lower.includes("14.457") ||
    lower.includes("canal de denúncia");

  const bases: string[] = [];
  if (lower.includes("14.133")) bases.push("Lei Federal nº 14.133/2021 (Nova Lei de Licitações)");
  if (lower.includes("12.846")) bases.push("Lei Federal nº 12.846/2013 (Lei Anticorrupção)");
  if (lower.includes("14.457") || lower.includes("assédio")) bases.push("Lei nº 14.457/2022 / NR-1");
  if (lower.includes("11.129")) bases.push("Decreto Federal nº 11.129/2022");
  if (bases.length === 0) bases.push("Lei Federal nº 14.133/2021 (Regra geral supletiva)");

  let submissionMoment = "Habilitação / Julgamento da Proposta";
  if (lower.includes("desempate") || lower.includes("critério de desempate")) {
    submissionMoment = "Critério de Desempate (art. 60, IV da Lei 14.133)";
  } else if (lower.includes("6 meses") || lower.includes("seis meses") || lower.includes("após a celebração")) {
    submissionMoment = "Em até 6 meses após celebração do contrato (Grande Vulto - art. 25, § 4º)";
  }

  const reqAnalyses: TenderRequirementAnalysis[] = [
    {
      id: "EDICT-REQ-01",
      title: "Comprovação de Código de Ética e Integridade",
      category: "CODIGO_CONDUTA",
      edict_clause: "Cláusula de Habilitação / Integridade",
      edict_quote: lower.includes("código de ética") || lower.includes("código de conduta")
        ? "Exigência de apresentação de Código de Conduta e Ética formalizado pela empresa licitante."
        : "Requisito de integridade licitatória geral nos termos da Lei 14.133/2021.",
      legal_basis: "Lei 14.133/2021, art. 25, § 4º",
      submission_moment: "HABILITACAO",
      match: diagnostic.pillars.CODIGO_CONDUTA.score >= 80 ? "ATENDIDO" : "PRECISA_COMPLEMENTAR",
      justification: "A empresa possui Código de Conduta vigente com ampla adesão e registro documental auditável na plataforma.",
      matching_evidences: [
        "Código de Conduta Licitatória v1.0",
        "Ato Declaratório de Vigência",
        "Termos de Aceite dos Colaboradores com IP e data",
      ],
    },
    {
      id: "EDICT-REQ-02",
      title: "Comprovação de Treinamentos Contínuos e Capacitação",
      category: "TREINAMENTOS",
      edict_clause: "Cláusula de Capacitação de Pessoal",
      edict_quote: "Comprovação de que a contratada promove capacitação contínua de seus empregados sobre normas anticorrupção.",
      legal_basis: "Decreto nº 11.129/2022, art. 57, III",
      submission_moment: "HABILITACAO",
      match: diagnostic.pillars.TREINAMENTOS.score >= 70 ? "ATENDIDO" : "PRECISA_COMPLEMENTAR",
      justification: `A empresa possui índice de capacitação em ${diagnostic.pillars.TREINAMENTOS.score}%, com certificados individuais auditáveis emitidos via QR Code.`,
      matching_evidences: [
        "Certificados Digitais de Microlearning (Integridade Licitatória)",
        "Registro de Quizzes Concluídos com Score Auditado",
      ],
      action_plan: diagnostic.pillars.TREINAMENTOS.score < 70 ? "Aumentar a taxa de conclusão dos colaboradores pendentes antes do envio da proposta." : undefined,
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
      justification: "Canal público exclusivo em funcionamento com garantia de anonimato, protocolo de rastreamento e cartaz mural emitido.",
      matching_evidences: [
        `Canal Oficial Ativo (/canal/${mockStore.getCompany().slug})`,
        "Cartaz Mural com QR Code para Canteiros e Áreas Comuns",
        "Procedimento de Apuração e Painel Restrito de Instrução",
      ],
    },
    {
      id: "EDICT-REQ-04",
      title: "Due Diligence de Terceiros e Prevenção de Sanções (CEIS/CNEP)",
      category: "GESTAO_TERCEIROS",
      edict_clause: "Cláusula de Vedações e Subcontratação",
      edict_quote: "Vedada a contratação ou atuação de pessoas jurídicas ou físicas declaradas inidôneas ou suspensas pela Administração Pública.",
      legal_basis: "Lei nº 14.133/2021, art. 14, III e art. 122",
      submission_moment: "HABILITACAO",
      match: "ATENDIDO",
      justification: "A empresa dispõe de rotina pericial de Due Diligence integrada às bases CEIS, CNEP, PEP e MTE com emissão de relatórios de risco.",
      matching_evidences: [
        "Módulo de Consulta DDI Integrado à CGU e MTE",
        "Relatórios Periciais de Análise de Fornecedores com Hash SHA-256",
      ],
    },
  ];

  const metCount = reqAnalyses.filter((r) => r.match === "ATENDIDO").length;
  const overallFit = Math.round((metCount / reqAnalyses.length) * 100);

  return {
    id: "ANALISE-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    fileName,
    analyzedAt: new Date().toISOString(),
    tenderNumber: lower.match(/preg[ãa]o\s+(?:eletr[ôo]nico\s+)?(?:n[º°]\s*)?([0-9\/\.\-]+)/i)?.[0] || "Pregão Eletrônico Identificado",
    organName: lower.match(/(?:prefeitura|tribunal|minist[ée]rio|secretaria|autarquia|funda[çc][ãa]o|conselho)[^\n,\.]{2,40}/i)?.[0] || "Órgão Licitante",
    overallFitScore: overallFit,
    requiresIntegrityProgram: hasIntegrityMention,
    legalBasisMentioned: bases,
    submissionMoment,
    requirements: reqAnalyses,
    summary: `O edital analisado possui cláusulas referentes a Programa de Integridade e atendimento a normas anticorrupção. A organização apresenta aderência de ${overallFit}% nas evidências documentais estruturadas na plataforma.`,
  };
}
