import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Lock,
  Users,
  Search,
  FileDown,
  Building2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SOLUTIONS_ITEMS } from "@/config/navigation";

// Base de dados das Soluções
interface SolutionDetail {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  problemSolved: string;
  benefits: string[];
  deliverables: string[];
  legalBasis: string;
  ctaText: string;
}

const SOLUTIONS_DATA: Record<string, SolutionDetail> = {
  "programa-de-integridade": {
    slug: "programa-de-integridade",
    title: "Programa de Integridade",
    subtitle: "Estruturação completa dos pilares exigidos pela Lei nº 14.133/2021",
    badge: "Pilar Principal",
    description:
      "Transforme as exigências complexas da Nova Lei de Licitações em uma rotina de integridade prática e contínua. Mapeie riscos, aprove políticas internas e capacite sua equipe com respaldo técnico.",
    problemSolved:
      "A Lei 14.133/2021 exige Programa de Integridade para contratações de grande vulto e como critério legal de desempate. Empresas sem comprovação estruturada correm o risco de inabilitação imediata.",
    benefits: [
      "Atendimento pleno aos 32 requisitos normativos da Lei 14.133",
      "Segurança jurídica para disputar grandes contratos públicos",
      "Vantagem competitiva em situações de desempate licitatório",
      "Prevenção contra multas da Lei Anticorrupção (Lei 12.846/2013)",
    ],
    deliverables: [
      "Código de Conduta e Ética personalizado e vigente",
      "Políticas de Prevenção a Fraudes e Brindes/Hospitalidades",
      "Controles internos e gestão de riscos licitatórios",
      "Relatório de maturidade documental periódico",
    ],
    legalBasis: "Art. 25, § 4º e Art. 60, inciso IV da Lei Federal nº 14.133/2021",
    ctaText: "Estruturar Programa de Integridade",
  },
  "diagnostico-de-conformidade": {
    slug: "diagnostico-de-conformidade",
    title: "Diagnóstico de Conformidade",
    subtitle: "Avaliação instantânea da maturidade documental da sua empresa",
    badge: "Motor de Avaliação",
    description:
      "Descubra em minutos o índice exato de conformidade da sua empresa em relação aos padrões de integridade exigidos por comissões de licitação em todo o país.",
    problemSolved:
      "A incerteza se a empresa cumpre ou não todos os itens exigidos no edital antes de ingressar na disputa do pregão.",
    benefits: [
      "Score de maturidade percentual imediato (0 a 100%)",
      "Identificação prévia de falhas documentais inabilitantes",
      "Comparativo com as exigências do TCU, CGU e órgãos contratantes",
      "Visão executiva do status de prontidão para licitar",
    ],
    deliverables: [
      "Painel com classificação de requisitos atendidos e pendentes",
      "Diagnóstico separado por eixos temáticos (Conduta, Treinamento, Canal)",
      "Recomendações técnicas de ajuste prioritário",
    ],
    legalBasis: "Decreto Federal nº 11.129/2022 e Portarias CGU",
    ctaText: "Realizar Diagnóstico da Minha Empresa",
  },
  "gestao-de-evidencias": {
    slug: "gestao-de-evidencias",
    title: "Gestão de Evidências",
    subtitle: "Repositório central com certificação de autenticidade SHA-256",
    badge: "Auditabilidade Criptográfica",
    description:
      "Não basta ter políticas; é obrigatório provar sua existência e aplicação prática. Centralize seus comprovantes com hash criptográfico e carimbo de tempo inviolável.",
    problemSolved:
      "Documentos espalhados em pastas locais que perdem validade ou cuja autenticidade é questionada por pregoeiros e concorrentes.",
    benefits: [
      "Criptografia SHA-256 gerada para cada evidência arquivada",
      "Histórico inalterável de datas, versões e aprovações",
      "Acesso instantâneo a atas, listas de presença e termos",
      "Conformidade com a LGPD e sigilo documental corporativo",
    ],
    deliverables: [
      "Acervo probatório digital padronizado",
      "Certificados de integridade de arquivos em lote",
      "Controle de vigência e alertas de renovação documental",
    ],
    legalBasis: "Princípio da Publicidade e Rastreabilidade Documental na Lei 14.133/2021",
    ctaText: "Organizar Acervo de Evidências",
  },
  "canal-de-denuncias": {
    slug: "canal-de-denuncias",
    title: "Canal de Denúncias",
    subtitle: "Canal externo independente com garantia legal de anonimato",
    badge: "Obrigatoriedade Legal",
    description:
      "Atenda à exigência legal da Lei nº 14.457/2022 e NR-1 com um canal seguro hospedado fora dos servidores da sua empresa, garantindo proteção ao denunciante e ausência de retaliação.",
    problemSolved:
      "Empresas com mais de 20 funcionários ou participantes de licitações públicas que não dispõem de canal anônimo auditável correm risco de pesadas sanções do Ministério do Trabalho e impedimento de contratar.",
    benefits: [
      "Hospedagem externa e imparcial sem rastreamento de IP",
      "Geração de código de protocolo para acompanhamento seguro",
      "Painel de triagem e governança de relatos para o compliance",
      "Cumprimento integral da Lei 14.457 (Emprega + Mulheres)",
    ],
    deliverables: [
      "Página exclusiva do canal da sua empresa (ex: /canal/sua-empresa)",
      "Formulário criptografado com upload de evidências",
      "Registro de ações corretivas e relatórios estatísticos",
    ],
    legalBasis: "Lei Federal nº 14.457/2022 e NR-1 (Ministério do Trabalho e Emprego)",
    ctaText: "Ativar Canal de Denúncias",
  },
  "treinamentos": {
    slug: "treinamentos",
    title: "Treinamentos & Capacitação",
    subtitle: "Capacitação contínua da equipe com emissão de atas e certificados",
    badge: "Cultura de Integridade",
    description:
      "Capacite seus colaboradores sobre ética concorrencial, prevenção a fraudes e combate ao assédio, registrando a adesão de 100% do time com certificação auditável.",
    problemSolved:
      "Dificuldade de engajar equipes e ausência de listas de presença formais exigidas em auditorias de licitações.",
    benefits: [
      "Módulos objetivos e interativos prontos para consumo",
      "Controle de presença e comprovação automática de conclusão",
      "Emissão de certificados individuais com validação pública",
      "Geração de atas probatórias para anexar em propostas",
    ],
    deliverables: [
      "Módulo de Treinamento em Integridade e Lei Anticorrupção",
      "Módulo de Prevenção ao Assédio Moral e Sexual (NR-1)",
      "Relatório consolidado de colaboradores certificados",
    ],
    legalBasis: "Art. 23 da Lei nº 14.457/2022 e Diretrizes do TCU",
    ctaText: "Capacitar Minha Equipe",
  },
  "analise-de-editais": {
    slug: "analise-de-editais",
    title: "Análise de Editais com IA",
    subtitle: "Extração inteligente de cláusulas e cruzamento de evidências",
    badge: "Inteligência Artificial Licitatória",
    description:
      "Envie o edital em PDF e deixe nosso motor de inteligência artificial mapear instantaneamente todas as obrigações de compliance, cruzando contra os documentos da sua empresa.",
    problemSolved:
      "Gastar horas lendo editais de centenas de páginas e correr o risco de deixar passar uma exigência sutil de habilitação jurídica ou integridade.",
    benefits: [
      "Identificação automática de cláusulas de programa de integridade",
      "Checagem de prazos de implantação concedidos pelo órgão público",
      "Pontuação de compatibilidade documental antes do envio da proposta",
      "Redução de custos operacionais do time de licitações",
    ],
    deliverables: [
      "Relatório executivo de conformidade do edital",
      "Lista de documentos faltantes para regularização antes do pregão",
      "Sugestões de impugnação ou esclarecimento técnico",
    ],
    legalBasis: "Editais padronizados da AGU, TCU e Ministérios Federais",
    ctaText: "Analisar Meu Primeiro Edital",
  },
  "dossie-de-evidencias": {
    slug: "dossie-de-evidencias",
    title: "Dossiê de Evidências",
    subtitle: "Relatório probatório consolidado com QR Code público para pregoeiros",
    badge: "Comprovação Oficial",
    description:
      "Gere em segundos um relatório técnico completo em PDF, consolidando todas as evidências da empresa com QR Code de validação pública para a comissão de licitação.",
    problemSolved:
      "Apresentar documentos soltos, desorganizados e de difícil verificação, o que frequentemente gera diligências, atrasos ou inabilitações sumárias.",
    benefits: [
      "Relatório estruturado nos padrões aceitos pela administração pública",
      "QR Code que permite ao pregoeiro checar a autenticidade online",
      "Carimbo de data, versão e responsabilidade técnica",
      "Pronto para anexar na plataforma Compras.gov.br ou portais estaduais",
    ],
    deliverables: [
      "PDF A4 diagramado e assinado digitalmente",
      "Página pública de conferência de autenticidade (URL dedicada)",
      "Índice probatório com links diretos para cada evidência",
    ],
    legalBasis: "Art. 67 e 68 da Lei Federal nº 14.133/2021",
    ctaText: "Gerar Dossiê de Integridade",
  },
};

export function generateStaticParams() {
  return Object.keys(SOLUTIONS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sol = SOLUTIONS_DATA[slug];
  if (!sol) return { title: "Solução | TechCompliance" };

  return {
    title: `${sol.title} | Soluções TechCompliance`,
    description: sol.description,
  };
}

export default async function SolucaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sol = SOLUTIONS_DATA[slug];

  if (!sol) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HEADER DA SOLUÇÃO */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{sol.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {sol.title}
          </h1>

          <p className="text-blue-300 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            {sol.subtitle}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {sol.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <span>{sol.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/como-funciona"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 transition-all text-sm"
            >
              Entenda o fluxo completo
            </Link>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16">
        {/* O PROBLEMA QUE RESOLVE */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              O Desafio das Licitações Públicas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Por que sua empresa precisa dessa solução?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed pt-1">
              {sol.problemSolved}
            </p>
          </div>
        </div>

        {/* BENEFÍCIOS E ENTREGÁVEIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefícios */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Principais Benefícios</span>
            </h3>
            <ul className="space-y-3">
              {sol.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* O que está incluído */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
              <span>O que está incluído</span>
            </h3>
            <ul className="space-y-3">
              {sol.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BASE NORMATIVA E DISCLAIMER */}
        <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Fundamentação Jurídica Associada</span>
          </div>
          <p className="text-sm font-semibold text-white">{sol.legalBasis}</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            * O TechCompliance fornece apoio probatório, estruturação tecnológica e organização de evidências, não substituindo o julgamento da comissão de contratação nem configurando garantia judicial automática.
          </p>
        </div>

        {/* NAVEGAÇÃO ENTRE OUTRAS SOLUÇÕES */}
        <div className="pt-10 border-t border-slate-800">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-6">
            Conheça outras soluções do TechCompliance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOLUTIONS_ITEMS.filter((item) => item.href !== `/solucoes/${sol.slug}`)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-2 group"
                >
                  <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* BANNER DE PREÇO */}
      <section className="py-16 px-4 bg-slate-900/70 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tenha acesso completo a esta e todas as outras soluções
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Com todas as ferramentas integradas em um único painel e ativação imediata.
          </p>
          <div className="pt-2">
            <CheckoutButton
              label="Começar agora"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm inline-flex items-center gap-2"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
