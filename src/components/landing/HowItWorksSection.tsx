"use client";

import {
  Building2,
  Gauge,
  AlertTriangle,
  FileCheck2,
  Search,
  FileDown,
  Sparkles,
} from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Cadastre",
      desc: "Informe os dados da sua empresa.",
      icon: Building2,
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      num: "02",
      title: "Diagnostique",
      desc: "Descubra o que já está estruturado.",
      icon: Gauge,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      num: "03",
      title: "Resolva",
      desc: "Identifique pontos de atenção e pendências.",
      icon: AlertTriangle,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      num: "04",
      title: "Evidencie",
      desc: "Organize documentos e evidências.",
      icon: FileCheck2,
      accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      num: "05",
      title: "Analise",
      desc: "Compare exigências de editais com sua estrutura.",
      icon: Search,
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      num: "06",
      title: "Gere o Dossiê",
      desc: "Organize as evidências do Programa de Integridade.",
      icon: FileDown,
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <section id="como-funciona" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>COMO FUNCIONA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Do diagnóstico à evidência em 6 passos
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Um método claro e estruturado para sair da incerteza e ter um programa de integridade organizado e auditável.
          </p>
        </div>

        {/* Grid dos 6 Passos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {step.num}
                    </span>
                    <div className={`p-2 rounded-xl border ${step.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
