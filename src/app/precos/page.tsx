import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Check,
  HelpCircle,
  Lock,
  FileCheck2,
  Clock,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Planos e Preços | LicitCompliance",
  description:
    "Plano completo de gestão de integridade licitatória por apenas R$ 189,90/mês. Sem taxa de adesão, sem carência e com cancelamento a qualquer momento.",
};

const INCLUDED_FEATURES = [
  "Diagnóstico contínuo dos 32 requisitos da Lei nº 14.133/2021",
  "Motor de Análise de Editais de Licitação com Inteligência Artificial",
  "Canal de Denúncias Externo com anonimato garantido (Lei 14.457 / NR-1)",
  "Módulo de Treinamentos para colaboradores com emissão de atas e certificados",
  "Repositório central de evidências com hash criptográfico SHA-256",
  "Geração de Dossiê Probatório em PDF com QR Code de validação pública",
  "Módulo de Due Diligence de Integridade (DDI) para terceiros e fornecedores",
  "Modelos prontos de Código de Conduta, Políticas Antifraude e Termos",
  "Suporte especializado em compliance licitatório",
  "Atualizações regulatórias e normativas contínuas",
];

const FAQS = [
  {
    question: "Existe fidelidade ou carência contratual?",
    answer:
      "Não. A assinatura é mensal no valor de R$ 189,90. Você pode cancelar a qualquer momento diretamente pelo painel da empresa, sem multa ou taxa rescisória.",
  },
  {
    question: "O sistema emite uma certificação oficial válida perante a lei?",
    answer:
      "Não. O LicitCompliance é uma plataforma tecnológica de gestão, organização e estruturação probatória. O sistema não atua como órgão certificador oficial do Estado, não emite parecer jurídico vinculante e não substitui a avaliação soberana da comissão de contratação do órgão público.",
  },
  {
    question: "Quantos colaboradores posso cadastrar para treinamento?",
    answer:
      "Não há limite de colaboradores cadastrados para realização dos módulos de capacitação e emissão de certificados com validação pública.",
  },
  {
    question: "Como o pregoeiro verifica a autenticidade do dossiê?",
    answer:
      "Cada Dossiê de Evidências gerado em PDF possui um QR Code e um código hash exclusivo. Ao apontar a câmera ou digitar o código em nosso validador público, a comissão de licitação acessa a página oficial que atesta a vigência e a autenticidade das evidências.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Como se trata de uma assinatura mensal recorrente (SaaS), aceitamos exclusivamente Cartão de Crédito (Visa, Mastercard, Elo, Hipercard e American Express) com renovação automática e ativação instantânea da conta.",
  },
];

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HEADER DA PÁGINA */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>TRANSPARÊNCIA TOTAL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Um único plano.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200">
              Tudo o que sua empresa precisa.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Sem custos ocultos por módulo, sem limite de colaboradores capacitados e sem complexidade. Tenha a integridade da sua empresa em conformidade com o poder público.
          </p>
        </div>
      </section>

      {/* CARD PRINCIPAL DO PLANO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-blue-500/30 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/30">
                PLANO COMPLETO EMPRESARIAL
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Assinatura Mensal LicitCompliance
              </h2>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1 text-white">
                <span className="text-2xl font-bold text-slate-400">R$</span>
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">189,90</span>
                <span className="text-sm font-semibold text-slate-400">/mês</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Sem taxa de adesão • Cancele quando quiser</span>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Lista de Recursos Inclusos */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Funcionalidades 100% Inclusas no Plano:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {INCLUDED_FEATURES.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA e Garantias */}
            <div className="lg:col-span-4 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Pronto para Começar?
                </div>
                <p className="text-[11px] text-slate-400">
                  Liberação instantânea logo após o cadastro da empresa.
                </p>
              </div>

              <Link
                href="/cadastro"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/40 transition-all text-sm flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Assinar por R$ 189,90/mês</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center justify-center gap-1.5 text-blue-300">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pagamento Seguro SSL 256-bit</span>
                </div>
                <div>Garantia incondicional de satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES (FAQ) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Tire Suas Dúvidas</span>
          <h2 className="text-3xl font-black text-white">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-left"
            >
              <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
