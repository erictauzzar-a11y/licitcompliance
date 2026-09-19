"use client";

import Link from "next/link";
import {
  Building2,
  Gauge,
  AlertTriangle,
  FileCheck2,
  Search,
  FileDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Cadastre a Empresa",
      desc: "Informe os dados básicos da sua empresa e o segmento de contratações públicas.",
      icon: Building2,
      preview: "CNPJ & Segmento",
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      num: "02",
      title: "Diagnostique",
      desc: "Responda ao questionário calibrado e descubra seu índice inicial de maturidade.",
      icon: Gauge,
      preview: "Score em % & Radar",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      num: "03",
      title: "Resolva Pendências",
      desc: "Receba a priorização exata do que falta: canal de denúncias, treinamentos ou políticas.",
      icon: AlertTriangle,
      preview: "Plano de Ação",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      num: "04",
      title: "Evidencie Tudo",
      desc: "Armazene os comprovantes e certificados individuais com chancela de integridade.",
      icon: FileCheck2,
      preview: "Hashes SHA-256",
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      num: "05",
      title: "Analise o Edital",
      desc: "Cruze com inteligência artificial as exigências do edital com a documentação existente.",
      icon: Search,
      preview: "Aderência em %",
      accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      num: "06",
      title: "Gere o Dossiê",
      desc: "Exporte o relatório probatório completo com QR Code de conferência pública para pregoeiros.",
      icon: FileDown,
      preview: "PDF com QR Code",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Luz sutil de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>MÉTODO EM 6 PASSOS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Do diagnóstico à evidência em 6 etapas
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Um fluxo linear, sem burocracia desnecessária, projetado para colocar a conformidade da sua empresa em ordem de forma prática e auditável.
          </p>
        </div>

        {/* Grid dos 6 Passos com Numeração Tipográfica e Micro-Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group shadow-xl relative overflow-hidden"
              >
                {/* Numeração de Fundo Estilizada */}
                <div className="absolute -right-2 -bottom-2 text-6xl font-black text-slate-800/20 select-none pointer-events-none group-hover:text-blue-500/10 transition-colors">
                  {step.num}
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      ETAPA {step.num}
                    </span>
                    <div className={`p-2 rounded-xl border ${step.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Entrega:</span>
                  <span className="text-blue-400 font-semibold">{step.preview}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Compacto */}
        <div className="text-center pt-2">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 text-xs transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>INICIAR COM O DIAGNÓSTICO GRATUITO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
