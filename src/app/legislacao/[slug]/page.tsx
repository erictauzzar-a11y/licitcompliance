import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Scale,
  FileText,
  AlertTriangle,
  Award,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";
import { LEGISLATION_ITEMS } from "@/config/navigation";

interface LegislationDetail {
  slug: string;
  title: string;
  subtitle?: string;
  officialName: string;
  badge: string;
  summary: string;
  keyArticles: { article: string; requirement: string; impact: string }[];
  platformRole: string[];
  disclaimers: string[];
}

const LEGISLATION_DATA: Record<string, LegislationDetail> = {
  "lei-14133": {
    slug: "lei-14133",
    title: "Lei nº 14.133/2021",
    officialName: "Nova Lei Geral de Licitações e Contratos Administrativos",
    badge: "Marco Regulatório",
    summary:
      "A Lei Federal nº 14.133/2021 estabeleceu a obrigatoriedade da implantação de Programa de Integridade em contratações públicas de grande vulto (acima de R$ 200 milhões) no prazo de até 6 meses após a celebração do contrato, além de instituir a integridade como critério formal de desempate entre propostas.",
    keyArticles: [
      {
        article: "Art. 25, § 4º",
        requirement:
          "Nas contratações de obras, serviços e fornecimentos de grande vulto, o edital obrigatoriamente exigirá a implantação de programa de integridade pelo contratado.",
        impact: "Impedimento de execução ou rescisão contratual caso a empresa não comprove a estrutura.",
      },
      {
        article: "Art. 60, inciso IV",
        requirement:
          "Em caso de empate entre 2 (duas) ou mais propostas, será utilizado como critério de desempate o desenvolvimento pelo licitante de ações de integridade.",
        impact: "Vantagem competitiva direta para empresas que já possuem o programa estruturado.",
      },
      {
        article: "Art. 156, § 1º, inciso V",
        requirement:
          "A implantação ou o aperfeiçoamento de programa de integridade deve ser considerado na dosimetria e atenuação de eventuais sanções administrativas.",
        impact: "Redução de penalidades e multas mediante comprovação de mecanismos preventivos.",
      },
    ],
    platformRole: [
      "Diagnostica a aderência prévia aos requisitos normativos do Art. 25 e 60.",
      "Armazena e certifica digitalmente as evidências do programa com carimbo de tempo imutável.",
      "Gera Dossiê Probatório em PDF estruturado para atendimento aos editais federais, estaduais e municipais.",
    ],
    disclaimers: [
      "O TechCompliance é uma ferramenta de gestão tecnológica e documental.",
      "O sistema NÃO emite certificado oficial de validação jurídica nem substitui o julgamento da Comissão de Contratação do órgão público.",
    ],
  },
  "decreto-12304": {
    slug: "decreto-12304",
    title: "Decreto Federal nº 12.304/2024",
    officialName: "Regulamentação das Diretrizes de Integridade em Contratos Públicos",
    badge: "Decreto Federal",
    summary:
      "O Decreto Federal nº 12.304/2024 e o Decreto Federal nº 11.129/2022 disciplinam os parâmetros práticos para a avaliação e aceitação de Programas de Integridade nos órgãos e entidades da administração pública federal direta, autárquica e fundacional.",
    keyArticles: [
      {
        article: "Padrões de Efetividade",
        requirement:
          "Não basta a existência meramente formal de manuais; o programa deve demonstrar aplicação rotineira e efetividade prática.",
        impact: "Reprovação sumária de programas 'de papel' (paper compliance).",
      },
      {
        article: "Due Diligence de Terceiros",
        requirement:
          "Diligência apropriada para contratação e supervisão de fornecedores, prestadores de serviço e consorciados.",
        impact: "Obrigatoriedade de checagem de sócios e vínculos vedados com agentes públicos.",
      },
    ],
    platformRole: [
      "Controla a rotina de capacitações e questionários de fixação da equipe.",
      "Disponibiliza módulo de Due Diligence de Integridade (DDI) para verificação de fornecedores.",
      "Mantém registros auditáveis de apuração de denúncias e melhorias de processos.",
    ],
    disclaimers: [
      "A aferição de efetividade cabe privativamente à autoridade fiscalizadora competente.",
      "A plataforma atua como repositório e instrumento probatório das ações executadas pela empresa.",
    ],
  },
  "lei-14457": {
    slug: "lei-14457",
    title: "Lei nº 14.457/2022",
    officialName: "Programa Emprega + Mulheres e Prevenção ao Assédio no Ambiente de Trabalho",
    badge: "Exigência Social & NR-1",
    summary:
      "Instituiu medidas obrigatórias para a promoção de um ambiente de trabalho sadio, seguro e sem assédio. Todas as empresas obrigadas a constituir CIPA devem implantar canal de denúncias específico e treinamentos periódicos.",
    keyArticles: [
      {
        article: "Art. 23, inciso I e II",
        requirement:
          "Inclusão de regras de conduta a respeito do assédio moral e sexual no regimento interno da empresa, com ampla divulgação.",
        impact: "Exigência de Código de Conduta divulgado a 100% dos empregados.",
      },
      {
        article: "Art. 23, inciso III",
        requirement:
          "Fixação de procedimentos para recebimento e acompanhamento de denúncias, para apuração dos fatos e aplicação de sanções administrativas.",
        impact: "Obrigatoriedade de canal com garantia de anonimato.",
      },
      {
        article: "Art. 23, inciso IV",
        requirement:
          "Realização, no mínimo a cada 12 meses, de ações de capacitação, orientação e sensibilização de todos os empregados.",
        impact: "Comprovação de treinamentos anuais auditáveis.",
      },
    ],
    platformRole: [
      "Fornece Canal de Denúncias seguro hospedado externamente com proteção total ao denunciante.",
      "Disponibiliza módulo de Treinamento em Prevenção ao Assédio com emissão automática de atas.",
      "Registra o termo de ciência dos colaboradores com assinatura e carimbo digital.",
    ],
    disclaimers: [
      "O cumprimento das normas trabalhistas depende da execução real das capacitações e apurações internas.",
    ],
  },
  "nr-1": {
    slug: "nr-1",
    title: "Norma Regulamentadora NR-1",
    officialName: "Disposições Gerais e Gerenciamento de Riscos Ocupacionais",
    badge: "Norma MTE",
    summary:
      "Aprovada pelo Ministério do Trabalho e Emprego, a NR-1 estabelece diretrizes gerais sobre gerenciamento de riscos ocupacionais (GRO), incluindo riscos psicossociais, assédio e a obrigatoriedade de comunicação segura e capacitação documentada dos trabalhadores.",
    keyArticles: [
      {
        article: "Item 1.4 e 1.5",
        requirement:
          "Dever do empregador de adotar medidas de prevenção a riscos ocupacionais e implementar canais de comunicação com os trabalhadores.",
        impact: "Fiscalização ativa pelo Ministério do Trabalho e auditorias em licitações públicas.",
      },
      {
        article: "Capacitação Documentada",
        requirement:
          "Todos os treinamentos obrigatórios devem ter registro formal com data, carga horária, conteúdo e lista de presença assinada.",
        impact: "Invalidade jurídica de treinamentos sem atas auditáveis.",
      },
    ],
    platformRole: [
      "Automatiza a geração de certificados e atas nos moldes exigidos pela NR-1.",
      "Mantém os registros armazenados em nuvem para fácil comprovação em inspeções.",
    ],
    disclaimers: [
      "O sistema fornece o suporte documental e tecnológico para a gestão de conformidade ocupacional.",
    ],
  },
  "programa-de-integridade": {
    slug: "programa-de-integridade",
    title: "Programa de Integridade Efetivo",
    subtitle: "Parâmetros do TCU, CGU e Portarias Ministeriais",
    officialName: "Guia de Integridade nas Contratações Públicas",
    badge: "Padrão de Mercado",
    summary:
      "Segundo os guias oficiais da Controladoria-Geral da União (CGU) e a jurisprudência do Tribunal de Contas da União (TCU), um Programa de Integridade só tem validade se possuir comprometimento da alta direção, padrões de ética comunicados, canal de denúncias transparente, gestão contínua de riscos e aplicação de sanções a eventuais desvios.",
    keyArticles: [
      {
        article: "Comprometimento da Direção",
        requirement:
          "Liderança corporativa demonstrando apoio inequívoco aos padrões de ética e transparência.",
        impact: "Critério de análise obrigatório por comissões de licitação.",
      },
      {
        article: "Gestão de Terceiros e Riscos",
        requirement:
          "Monitoramento preventivo de desvios, conflito de interesses e relações com agentes públicos.",
        impact: "Atesto de ausência de fraudes e lealdade concorrencial.",
      },
    ],
    platformRole: [
      "Permite o acompanhamento centralizado de todos os pilares recomendados pelo TCU/CGU.",
      "Gera relatórios de auditoria e dossiês de integridade prontos para anexar em propostas.",
    ],
    disclaimers: [
      "O TechCompliance atua como ferramenta tecnológica e repositório probatório para as empresas licitantes.",
      "A plataforma NÃO audita nem valida o mérito das propostas apresentadas pelas empresas em procedimentos licitatórios.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(LEGISLATION_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const leg = LEGISLATION_DATA[slug];
  if (!leg) return { title: "Legislação | TechCompliance" };

  return {
    title: `${leg.title} | Legislação TechCompliance`,
    description: leg.summary,
  };
}

export default async function LegislacaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const leg = LEGISLATION_DATA[slug];

  if (!leg) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HEADER DA LEGISLAÇÃO */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>{leg.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {leg.title}
          </h1>

          <p className="text-blue-300 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            {leg.officialName}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {leg.summary}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <span>Adequar Minha Empresa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/como-funciona"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 transition-all text-sm"
            >
              Ver como funciona o software
            </Link>
          </div>
        </div>
      </section>

      {/* DISPOSITIVOS NORMATIVOS PRINCIPAIS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Dispositivos Legais Relevantes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              O que o texto da lei determina para a sua empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leg.keyArticles.map((art) => (
              <div
                key={art.article}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg w-fit border border-blue-500/20">
                    {art.article}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &quot;{art.requirement}&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                    Impacto em Licitações
                  </span>
                  <p className="text-xs text-white font-medium">{art.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMO O TECHCOMPLIANCE AUXILIA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-blue-950/30 to-slate-900/80 border border-blue-500/30 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Aplicação Prática no Sistema
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Como o TechCompliance apoia o cumprimento desta norma
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {leg.platformRole.map((role, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apoio Operacional #{idx + 1}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AVISO DE ISENÇÃO LEGAL OBRIGATÓRIA */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Aviso Legal Regulatório Obrigatório</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
            {leg.disclaimers.map((d, i) => (
              <p key={i}>• {d}</p>
            ))}
            <p className="text-slate-400 pt-1 text-[11px]">
              O TechCompliance não garante vitória em licitações públicas, não emite parecer jurídico e não substitui a soberania da autoridade julgadora nem a atuação de assessoria jurídica especializada.
            </p>
          </div>
        </div>

        {/* OUTRAS NORMAS RELACIONADAS */}
        <div className="pt-10 border-t border-slate-800">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-6">
            Outras normas e diretrizes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LEGISLATION_ITEMS.filter((item) => item.href !== `/legislacao/${leg.slug}`)
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
            Estruture o compliance da sua empresa hoje mesmo
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Acesso imediato a todas as ferramentas e modelos prontos da plataforma.
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
