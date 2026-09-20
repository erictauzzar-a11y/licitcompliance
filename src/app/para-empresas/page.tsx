import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  AlertTriangle,
  FileCheck2,
  Search,
  FileDown,
  Award,
  Users,
  Lock,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Para Empresas Licitantes e Fornecedores do Poder Público | TechCompliance",
  description:
    "Prepare sua empresa para fornecer ao poder público. Saiba quem deve utilizar o TechCompliance, quais problemas resolve e como estruturar suas evidências para licitações públicas.",
};

const ENTERPRISE_FLOW = [
  {
    step: "1",
    label: "DIAGNOSTICAR",
    title: "Avaliação da maturidade atual",
    description: "Cruza os dados da empresa contra os 32 requisitos normativos da Lei nº 14.133 e da NR-1.",
  },
  {
    step: "2",
    label: "CORRIGIR",
    title: "Eliminação de pendências críticas",
    description: "Adota modelos estruturados de Código de Ética, políticas antifraude e procedimentos internos.",
  },
  {
    step: "3",
    label: "ORGANIZAR",
    title: "Centralização probatória em nuvem",
    description: "Reúne certidões, termos e atas com registro criptográfico de data e hora inviolável.",
  },
  {
    step: "4",
    label: "COMPROVAR",
    title: "Validação contínua da equipe",
    description: "Capacita os colaboradores em combate ao assédio e garante canal anônimo ativo.",
  },
  {
    step: "5",
    label: "ANALISAR",
    title: "Confronto do edital com IA",
    description: "Verifica antes da sessão pública se todos os requisitos de integridade do certame estão atendidos.",
  },
  {
    step: "6",
    label: "APRESENTAR",
    title: "Dossiê com QR Code para pregoeiros",
    description: "Anexa na proposta o relatório probatório com validação pública instantânea.",
  },
];

const TARGET_PROFILES = [
  {
    title: "Fornecedores de Bens e Serviços",
    description:
      "Empresas que disputam pregões eletrônicos federais, estaduais e municipais e necessitam comprovar integridade para desempate e habilitação.",
    icon: Building2,
  },
  {
    title: "Empreiteiras e Construtoras",
    description:
      "Contratos de obras e serviços de engenharia de grande vulto (acima de R$ 200M) com obrigação expressa de implantar compliance em até 6 meses.",
    icon: ShieldCheck,
  },
  {
    title: "Empresas com mais de 20 Colaboradores",
    description:
      "Obrigadas por lei a manter canal de denúncias ativo com garantia de não retaliação e treinamentos regulares sobre combate ao assédio.",
    icon: Users,
  },
  {
    title: "PMEs e Startups Inovadoras",
    description:
      "Negócios em crescimento que buscam vender para o governo pela primeira vez com segurança documental e sem custos de auditorias astronômicas.",
    icon: Sparkles,
  },
];

export default function ParaEmpresasPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HERO DA PÁGINA */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>SOLUÇÃO PARA O MERCADO LICITATÓRIO</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Prepare sua empresa para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200">
              fornecer ao poder público.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Elimine o risco de inabilitação, desclassificação ou perda de desempate licitatório. Uma plataforma pensada para a rotina de quem vende para o governo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <CheckoutButton
              label="Acessar versão demo"
              showIcon={false}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 text-sm"
            />
            <Link
              href="/como-funciona"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 transition-all text-sm"
            >
              Ver como funciona o fluxo
            </Link>
          </div>
        </div>
      </section>

      {/* QUEM DEVE UTILIZAR */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Público-Alvo</span>
          <h2 className="text-3xl font-black text-white">Para quem é o TechCompliance?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Qualquer pessoa jurídica que pretenda vender produtos, serviços ou obras para o Poder Público — direta ou indiretamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TARGET_PROFILES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-blue-500/40 transition-colors"
              >
                <div className="p-3 bg-blue-500/15 text-blue-400 rounded-2xl w-fit border border-blue-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* O FLUXO EM 6 ETAPAS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Metodologia de Preparação
            </span>
            <h2 className="text-3xl font-black text-white">
              O fluxo de conformidade da sua empresa
            </h2>
            <p className="text-slate-400 text-sm">
              Um caminho claro e objetivo do primeiro diagnóstico até a apresentação oficial perante o pregoeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {ENTERPRISE_FLOW.map((f) => (
              <div
                key={f.step}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    {f.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                    {f.label}
                  </span>
                  <h4 className="font-bold text-xs text-white">{f.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUAIS PROBLEMAS O SOFTWARE RESOLVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Segurança Operacional
          </span>
          <h2 className="text-3xl font-black text-white">
            Quais problemas o TechCompliance resolve para você?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl w-fit border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Medo de Inabilitação por Falta de Documentos</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O motor analisa o edital e cruza com seu acervo previamente, impedindo surpresas durante a fase de julgamento da habilitação.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit border border-amber-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Compliance &quot;de Gaveta&quot; Sem Prova Prática</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Órgãos públicos desconsideram manuais estáticos sem evidências reais. O sistema gera registros auditáveis de canal, treinamentos e termos assinados.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Perda de Empates em Disputas Acirradas</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A Lei 14.133 define o Programa de Integridade como critério de desempate preferencial. Tenha o dossiê pronto para apresentar em minutos.
            </p>
          </div>
        </div>
      </section>

      {/* BANNER FINAL */}
      <section className="py-16 px-4 bg-slate-900 border-t border-slate-800 text-center space-y-5">
        <h2 className="text-3xl font-black text-white">Comece agora a preparar sua empresa</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          Tenha acesso imediato a todas as ferramentas, sem taxa de adesão ou fidelidade.
        </p>
        <div className="pt-2">
          <CheckoutButton
            label="Acessar versão demo"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm inline-flex items-center gap-2"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
