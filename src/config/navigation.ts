export interface NavItem {
  title: string;
  href: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const SOLUTIONS_ITEMS: NavItem[] = [
  {
    title: "Programa de Integridade",
    href: "/solucoes/programa-de-integridade",
    description: "Estruturação completa dos pilares exigidos pela Lei nº 14.133/2021.",
    iconName: "ShieldCheck",
  },
  {
    title: "Diagnóstico de Conformidade",
    href: "/solucoes/diagnostico-de-conformidade",
    description: "Avaliação instantânea da maturidade documental da sua empresa.",
    iconName: "CheckCircle2",
  },
  {
    title: "Gestão de Evidências",
    href: "/solucoes/gestao-de-evidencias",
    description: "Repositório central com certificação de autenticidade SHA-256.",
    iconName: "FileCheck2",
  },
  {
    title: "Canal de Denúncias",
    href: "/solucoes/canal-de-denuncias",
    description: "Canal externo independente com garantia legal de anonimato e não retaliação.",
    iconName: "Lock",
  },
  {
    title: "Treinamentos & Capacitação",
    href: "/solucoes/treinamentos",
    description: "Capacitação contínua da equipe com registro de atas e certificados.",
    iconName: "Users",
  },
  {
    title: "Análise de Editais com IA",
    href: "/solucoes/analise-de-editais",
    description: "Extração inteligente de cláusulas e cruzamento contra suas evidências.",
    iconName: "Search",
    badge: "IA",
  },
  {
    title: "Dossiê de Evidências",
    href: "/solucoes/dossie-de-evidencias",
    description: "Relatório probatório consolidado com QR Code público para pregoeiros.",
    iconName: "FileDown",
  },
];

export const RESOURCES_ITEMS: NavItem[] = [
  {
    title: "Dashboard de Conformidade",
    href: "/recursos/dashboard",
    description: "Visão 360º com indicadores de preparação, pendências e alertas.",
    iconName: "Layers",
  },
  {
    title: "Diagnóstico de Requisitos",
    href: "/recursos/diagnostico",
    description: "Detalhamento pilar por pilar da conformidade normativa.",
    iconName: "FileText",
  },
  {
    title: "Gestão de Pendências",
    href: "/recursos/pendencias",
    description: "Planos de ação objetivos para sanar apontamentos com rapidez.",
    iconName: "AlertTriangle",
  },
  {
    title: "Acervo de Evidências",
    href: "/recursos/evidencias",
    description: "Políticas, termos de adesão e atas com carimbo de tempo imutável.",
    iconName: "FileCheck2",
  },
  {
    title: "Módulo de Treinamentos",
    href: "/recursos/treinamentos",
    description: "Cursos autoguiados sobre combate ao assédio e lealdade concorrencial.",
    iconName: "Users",
  },
  {
    title: "Canal de Denúncias Seguro",
    href: "/recursos/canal-de-denuncias",
    description: "Gestão sigilosa com protocolo público para o denunciante acompanhar.",
    iconName: "Lock",
  },
  {
    title: "Confronto de Editais por IA",
    href: "/recursos/analise-edital",
    description: "Leitor de PDFs de termos de referência e editais em segundos.",
    iconName: "Search",
    badge: "IA",
  },
  {
    title: "Dossiê Probatório em PDF",
    href: "/recursos/dossie",
    description: "Documento oficial pronto para anexar na fase de habilitação.",
    iconName: "FileDown",
  },
  {
    title: "Validação Pública por QR Code",
    href: "/recursos/validacao-publica",
    description: "Link público seguro para comissões atestarem a veracidade dos dados.",
    iconName: "Award",
  },
];

export const LEGISLATION_ITEMS: NavItem[] = [
  {
    title: "Lei nº 14.133/2021",
    href: "/legislacao/lei-14133",
    description: "Nova Lei de Licitações: exigência e desempate por Programa de Integridade.",
    iconName: "Scale",
  },
  {
    title: "Decreto Federal nº 12.304/2024",
    href: "/legislacao/decreto-12304",
    description: "Diretrizes federais para avaliação de compliance em contratos públicos.",
    iconName: "FileText",
  },
  {
    title: "Lei nº 14.457/2022",
    href: "/legislacao/lei-14457",
    description: "Programa Emprega + Mulheres e medidas de prevenção ao assédio.",
    iconName: "ShieldCheck",
  },
  {
    title: "Norma Regulamentadora NR-1",
    href: "/legislacao/nr-1",
    description: "Obrigatoriedade de canal de denúncias e treinamentos periódicos.",
    iconName: "AlertCircle",
  },
  {
    title: "Programa de Integridade Efetivo",
    href: "/legislacao/programa-de-integridade",
    description: "Critérios de completude e aplicação prática aceitos pelo TCU e CGU.",
    iconName: "CheckCircle2",
  },
];
