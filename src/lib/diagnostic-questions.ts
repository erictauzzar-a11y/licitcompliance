import { PillarCategory } from "@/types/compliance";

export interface DiagnosticQuestion {
  id: string;
  code: string;
  step: number;
  title: string;
  question: string;
  explanation: string;
  legal_reference: string;
  requirement_id: string;
  pillar: PillarCategory;
  applicable_to_me_epp: boolean;
  help_tip?: string;
  suggested_action_href?: string;
  suggested_action_label?: string;
}

export interface DiagnosticStepMeta {
  step: number;
  title: string;
  short_title: string;
  description: string;
  icon_name: string;
  normative_focus: string;
}

export const DIAGNOSTIC_STEPS: DiagnosticStepMeta[] = [
  {
    step: 1,
    title: "1. Comprometimento da Alta Administração e Governança",
    short_title: "Alta Administração",
    description: "Apoio inequívoco, liderança visível e destinação formal de responsabilidades e recursos ao programa de integridade.",
    icon_name: "Building2",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, I / Lei nº 14.133/2021",
  },
  {
    step: 2,
    title: "2. Código de Conduta e Políticas de Integridade",
    short_title: "Código e Políticas",
    description: "Normas claras de comportamento ético, vedações a vantagens indevidas e tratamento de conflitos de interesses.",
    icon_name: "BookOpen",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, II / Lei nº 12.846/2013",
  },
  {
    step: 3,
    title: "3. Treinamentos e Comunicação Contínua",
    short_title: "Treinamentos",
    description: "Capacitação periódica de dirigentes, colaboradores e representantes em licitações sobre normas anticorrupção.",
    icon_name: "Users",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, III",
  },
  {
    step: 4,
    title: "4. Gestão de Riscos de Integridade",
    short_title: "Gestão de Riscos",
    description: "Identificação, avaliação, mitigação e monitoramento contínuo dos riscos de corrupção, fraude e desvios éticos.",
    icon_name: "ShieldAlert",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, IV",
  },
  {
    step: 5,
    title: "5. Controles Internos e Registros Contábeis",
    short_title: "Controles Internos",
    description: "Segregação de funções, dupla conferência em notas fiscais, medições e rastreabilidade contábil estrita.",
    icon_name: "FileCheck",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, V / Lei nº 4.320/1964",
  },
  {
    step: 6,
    title: "6. Canal de Denúncias e Proteção ao Denunciante",
    short_title: "Canal de Denúncias",
    description: "Mecanismo acessível, confidencial, com garantia de não retaliação e rito formal de apuração (NR-1 e Lei 14.457/2022).",
    icon_name: "AlertTriangle",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, VI / Lei nº 14.457/2022",
  },
  {
    step: 7,
    title: "7. Gestão de Terceiros e Due Diligence (DDI)",
    short_title: "Gestão de Terceiros",
    description: "Auditoria prévia e contínua de idoneidade de fornecedores, subcontratados e parceiros (CEIS/CNEP/CEPIM).",
    icon_name: "Briefcase",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, VII / Lei nº 14.133/2021, Art. 122",
  },
  {
    step: 8,
    title: "8. Relações com o Poder Público e Licitações",
    short_title: "Relações com Poder Público",
    description: "Procedimentos e cautelas em certames, audiências, reuniões com agentes públicos e apresentação de propostas.",
    icon_name: "Landmark",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, VIII / Lei nº 14.133/2021, Art. 25, § 4º",
  },
  {
    step: 9,
    title: "9. Monitoramento Contínuo e Aprimoramento",
    short_title: "Monitoramento",
    description: "Auditorias periódicas, revisão de políticas, ações disciplinares e geração do Dossiê de Evidências.",
    icon_name: "Activity",
    normative_focus: "Decreto nº 12.304/2024, Art. 4º, IX",
  },
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // ETAPA 1: ALTA ADMINISTRAÇÃO E GOVERNANÇA
  {
    id: "Q-GOV-01",
    code: "1.1",
    step: 1,
    pillar: "CODIGO_CONDUTA",
    requirement_id: "REQ-COD-01",
    title: "Ato Formal de Instituição do Programa pela Diretoria",
    question: "A alta administração formalizou a criação e o apoio inequívoco ao Programa de Integridade da empresa mediante documento assinado?",
    explanation: "O comprometimento da liderança é o alicerce indispensável de qualquer programa de integridade, sendo expressamente avaliado em auditorias e certames licitatórios.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, I c/c Lei nº 14.133/2021",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Adotar Modelo na Biblioteca",
  },
  {
    id: "Q-GOV-02",
    code: "1.2",
    step: 1,
    pillar: "CODIGO_CONDUTA",
    requirement_id: "REQ-GOV-01",
    title: "Designação de Responsável ou Instância de Integridade",
    question: "Há um responsável ou comitê formalmente designado pela diretoria para coordenar as ações de compliance e zelar pelas políticas?",
    explanation: "Para ME e EPP, a atribuição pode ser exercida diretamente por um dos sócios ou gestor-chave, sem exigência de estrutura segregada custosa.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, I e Art. 5º (parâmetro de proporcionalidade)",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Formalizar Portaria de Designação",
  },

  // ETAPA 2: CÓDIGO DE CONDUTA E POLÍTICAS
  {
    id: "Q-POL-01",
    code: "2.1",
    step: 2,
    pillar: "CODIGO_CONDUTA",
    requirement_id: "REQ-COD-01",
    title: "Código de Ética e Conduta Formalmente Publicado",
    question: "A empresa possui Código de Ética e Conduta aprovado, contendo regras claras sobre lealdade concorrencial e relações públicas?",
    explanation: "O código deve proibir terminantemente o pagamento ou oferta de propina, brindes ilícitos, fraudes e práticas anticoncorrenciais.",
    legal_reference: "Lei nº 14.133/2021, Art. 25, § 4º c/c Decreto nº 12.304/2024, Art. 4º, II",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/politicas",
    suggested_action_label: "Configurar Código de Conduta",
  },
  {
    id: "Q-POL-02",
    code: "2.2",
    step: 2,
    pillar: "CODIGO_CONDUTA",
    requirement_id: "REQ-COD-02",
    title: "Termos de Ciência e Aceite dos Colaboradores",
    question: "Todos os colaboradores e dirigentes assinaram termo formal (físico ou eletrônico) atestando conhecimento e cumprimento do Código?",
    explanation: "A mera existência do documento não é suficiente; é obrigatório demonstrar a adesão nominal de quem atua pela pessoa jurídica.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, II",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/colaboradores",
    suggested_action_label: "Coletar Aceites de Colaboradores",
  },
  {
    id: "Q-POL-03",
    code: "2.3",
    step: 2,
    pillar: "POLITICAS",
    requirement_id: "REQ-POL-01",
    title: "Políticas Anticorrupção e de Conflito de Interesses",
    question: "A empresa instituiu políticas específicas sobre prevenção de conflitos de interesses, regras para recebimento de brindes e hospitalidades?",
    explanation: "Recomenda-se adotar políticas temáticas que parametrizem limites e proibições no relacionamento com servidores públicos.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, II",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Adotar Políticas da Biblioteca",
  },

  // ETAPA 3: TREINAMENTOS E CAPACITAÇÃO
  {
    id: "Q-TRN-01",
    code: "3.1",
    step: 3,
    pillar: "TREINAMENTOS",
    requirement_id: "REQ-TRN-01",
    title: "Programa Periódico de Capacitação em Integridade",
    question: "A empresa aplica treinamentos periódicos com registros comprobatórios de presença e aproveitamento para seus colaboradores?",
    explanation: "Os editais e a Lei 14.133 exigem comprovação de que a empresa mantém capacitação contínua, com certificados ou listas de presença.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, III c/c Lei nº 14.133/2021",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/colaboradores",
    suggested_action_label: "Iniciar Trilhas de Microlearning",
  },
  {
    id: "Q-TRN-02",
    code: "3.2",
    step: 3,
    pillar: "TREINAMENTOS",
    requirement_id: "REQ-TRN-02",
    title: "Treinamento Específico sobre Assédio e NR-1",
    question: "Foi realizado treinamento focado na prevenção e combate ao assédio sexual, moral e discriminação conforme a Lei nº 14.457/2022 e NR-1?",
    explanation: "Obrigatoriedade anual para todas as empresas com empregados, vinculando a gestão de integridade à saúde e segurança do trabalho.",
    legal_reference: "Lei Federal nº 14.457/2022 c/c Norma Regulamentadora NR-1",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/colaboradores",
    suggested_action_label: "Capacitar em Assédio (NR-1)",
  },

  // ETAPA 4: GESTÃO DE RISCOS
  {
    id: "Q-RSK-01",
    code: "4.1",
    step: 4,
    pillar: "GESTAO_RISCOS",
    requirement_id: "REQ-RSK-01",
    title: "Mapeamento dos Riscos de Integridade e Licitações",
    question: "A empresa realizou levantamento estruturado dos principais riscos de corrupção, conluio ou fraude em seus processos de contratação?",
    explanation: "A matriz de riscos identifica vulnerabilidades na precificação, interação com agentes públicos e execução de contratos.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, IV",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Adotar Matriz de Riscos",
  },

  // ETAPA 5: CONTROLES INTERNOS E CONTÁBEIS
  {
    id: "Q-CTR-01",
    code: "5.1",
    step: 5,
    pillar: "CONTROLES_INTERNOS",
    requirement_id: "REQ-CTR-01",
    title: "Segregação de Funções em Contratos Públicos",
    question: "Existe clara separação entre os responsáveis por orçar/propor licitações e os responsáveis pela medição e recebimento de recursos?",
    explanation: "Evita a concentração de poderes na mão de um único colaborador, mitigando pagamentos indevidos e fraudes operacionais.",
    legal_reference: "Lei nº 14.133/2021, Art. 7º, § 1º c/c Decreto nº 12.304/2024, Art. 4º, V",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Ver Manual de Segregação",
  },
  {
    id: "Q-CTR-02",
    code: "5.2",
    step: 5,
    pillar: "CONTROLES_INTERNOS",
    requirement_id: "REQ-CTR-02",
    title: "Conferência Rígida de Notas de Empenho e Medições",
    question: "A empresa adota rotina documentada de dupla conferência para confrontar notas de empenho, ordens de serviço e quantidades entregues?",
    explanation: "Assegura a liquidação regular da despesa pública e afasta qualquer acusação de sobrepreço ou superfaturamento.",
    legal_reference: "Lei Federal nº 4.320/1964, Arts. 62 e 63 c/c Decreto nº 12.304/2024",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Formalizar POP Fiscal",
  },

  // ETAPA 6: CANAL DE DENÚNCIAS E PROTEÇÃO
  {
    id: "Q-DEN-01",
    code: "6.1",
    step: 6,
    pillar: "CANAL_DENUNCIAS",
    requirement_id: "REQ-DEN-01",
    title: "Canal de Denúncias Seguro e Aberto a Terceiros",
    question: "A empresa disponibiliza canal oficial seguro de manifestações, acessível tanto para colaboradores internos quanto para o público externo?",
    explanation: "O canal deve permitir relatos anônimos ou identificados, garantindo rastreamento por protocolo e chave criptográfica.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, VI c/c Lei nº 14.457/2022",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/denuncias",
    suggested_action_label: "Acessar Canal de Denúncias",
  },
  {
    id: "Q-DEN-02",
    code: "6.2",
    step: 6,
    pillar: "CANAL_DENUNCIAS",
    requirement_id: "REQ-DEN-02",
    title: "Política Expressa de Não Retaliação",
    question: "Existe norma formal assegurando que nenhum denunciante de boa-fé sofrerá retaliação, punição ou perda de emprego?",
    explanation: "Exigência legal expressa da Lei nº 14.457/2022 e do Decreto nº 12.304/2024 para garantir a efetividade dos relatos.",
    legal_reference: "Lei Federal nº 14.457/2022 c/c NR-1, Item 1.4.1",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/denuncias",
    suggested_action_label: "Ver Termo de Não Retaliação",
  },
  {
    id: "Q-DEN-03",
    code: "6.3",
    step: 6,
    pillar: "CANAL_DENUNCIAS",
    requirement_id: "REQ-DEN-03",
    title: "Divulgação com Cartaz Mural e QR Code",
    question: "O canal foi amplamente divulgado na sede e locais de trabalho físico através de cartaz mural padronizado com QR Code?",
    explanation: "A fiscalização trabalhista e os editais de obras e serviços exigem publicidade efetiva do canal no ambiente presencial.",
    legal_reference: "Portaria MTP nº 4.219/2022 c/c NR-1",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/denuncias",
    suggested_action_label: "Imprimir Cartaz Mural em PDF",
  },

  // ETAPA 7: GESTÃO DE TERCEIROS E DUE DILIGENCE
  {
    id: "Q-TER-01",
    code: "7.1",
    step: 7,
    pillar: "GESTAO_TERCEIROS",
    requirement_id: "REQ-TER-01",
    title: "Due Diligence Prévia em Bases de Sanções (CEIS/CNEP)",
    question: "A empresa realiza consulta formal prévia para verificar se seus subcontratados e fornecedores constam no CEIS, CNEP ou CEPIM?",
    explanation: "A Lei 14.133/2021 veda expressamente a subcontratação de empresas impedidas ou inidôneas perante o Poder Público.",
    legal_reference: "Lei Federal nº 14.133/2021, Art. 122 c/c Art. 14, III",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/due-diligence",
    suggested_action_label: "Consultar Fornecedores no DDI",
  },
  {
    id: "Q-TER-02",
    code: "7.2",
    step: 7,
    pillar: "GESTAO_TERCEIROS",
    requirement_id: "REQ-TER-02",
    title: "Cláusulas Anticorrupção nos Contratos com Parceiros",
    question: "Os contratos e ordens de fornecimento celebrados com terceiros possuem cláusula resolutiva expressa de anticorrupção e integridade?",
    explanation: "Permite a rescisão imediata e isenção de penalidades caso o subcontratado cometa ato ilícito contra a Administração.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, VII",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Adotar Cláusulas Anticorrupção",
  },

  // ETAPA 8: RELAÇÕES COM O PODER PÚBLICO E LICITAÇÕES
  {
    id: "Q-PUB-01",
    code: "8.1",
    step: 8,
    pillar: "CODIGO_CONDUTA",
    requirement_id: "REQ-COD-03",
    title: "Diretrizes Rigorosas em Reuniões com Agentes Públicos",
    question: "Existe orientação formal determinando que reuniões e audiências com agentes públicos sejam previamente agendadas e registradas?",
    explanation: "Resguarda os representantes da empresa e comprova a transparência total nas tratativas de esclarecimentos e recursos em licitações.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, VIII",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/biblioteca",
    suggested_action_label: "Consultar Guia de Relacionamento",
  },
  {
    id: "Q-PUB-02",
    code: "8.2",
    step: 8,
    pillar: "POLITICAS",
    requirement_id: "REQ-POL-02",
    title: "Vedação a Acordos Colusivos e Conluio Licitatório",
    question: "A empresa possui política taxativa proibindo combinação de preços, divisão de lotes ou conluio com concorrentes em licitações?",
    explanation: "Atendimento estrito ao Art. 337-F e Art. 337-I do Código Penal e à Lei nº 12.529/2011 (Defesa da Concorrência / CADE).",
    legal_reference: "Lei Federal nº 14.133/2021 c/c Lei nº 12.529/2011 e CPB, Art. 337-F",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/politicas",
    suggested_action_label: "Verificar Código de Conduta",
  },

  // ETAPA 9: MONITORAMENTO CONTÍNUO E DOSSIÊ
  {
    id: "Q-MON-01",
    code: "9.1",
    step: 9,
    pillar: "MONITORAMENTO",
    requirement_id: "REQ-MON-01",
    title: "Acompanhamento Contínuo e Auditoria dos Registros",
    question: "A empresa realiza acompanhamento periódico do cumprimento de suas políticas e do funcionamento de seu canal de denúncias?",
    explanation: "O programa de integridade deve ser vivo e atualizado continuamente, demonstrando sua efetividade perante pregoeiros e órgãos de controle.",
    legal_reference: "Decreto nº 12.304/2024, Art. 4º, IX",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard",
    suggested_action_label: "Monitorar Painel de Controle",
  },
  {
    id: "Q-MON-02",
    code: "9.2",
    step: 9,
    pillar: "EVIDENCIAS",
    requirement_id: "REQ-EVI-03",
    title: "Emissão Periódica do Dossiê Probatório em PDF",
    question: "A empresa consolida suas evidências probatórias em Dossiê estruturado com atestados e QR Code para juntada nos certames?",
    explanation: "Consolida os documentos e relatórios exigidos pelos editais no formato oficial pronto para entrega em licitações públicas.",
    legal_reference: "Lei Federal nº 14.133/2021, Art. 25, § 4º c/c Art. 156, § 1º, V",
    applicable_to_me_epp: true,
    suggested_action_href: "/dashboard/diagnostico",
    suggested_action_label: "Gerar Dossiê de Integridade",
  },
];
