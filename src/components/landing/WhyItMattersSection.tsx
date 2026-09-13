"use client";

import Link from "next/link";
import {
  Building2,
  Scale,
  FileSpreadsheet,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export function WhyItMattersSection() {
  const points = [
    {
      title: "Contratações de Grande Vulto",
      description:
        "Em determinadas contratações de grande vulto, o edital pode prever a implantação de Programa de Integridade pelo vencedor.",
      icon: Building2,
      badge: "Art. 25, § 4º da Lei 14.133",
      accent: "border-blue-500/30 group-hover:border-blue-500/60 bg-blue-950/20",
      iconColor: "text-blue-400 bg-blue-500/10",
    },
    {
      title: "Critério de Desempate",
      description:
        "A existência de Programa de Integridade aparece entre os critérios de desempate previstos na Lei 14.133/2021.",
      icon: Scale,
      badge: "Art. 60 da Lei 14.133",
      accent: "border-emerald-500/30 group-hover:border-emerald-500/60 bg-emerald-950/20",
      iconColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Exigências Específicas",
      description:
        "Estados, municípios, órgãos e determinados editais podem estabelecer regras próprias de conformidade e integridade.",
      icon: FileSpreadsheet,
      badge: "Leis Estaduais e Distritais",
      accent: "border-amber-500/30 group-hover:border-amber-500/60 bg-amber-950/20",
      iconColor: "text-amber-400 bg-amber-500/10",
    },
    {
      title: "Reabilitação de Empresas",
      description:
        "Em determinadas hipóteses, a legislação relaciona a reabilitação da empresa perante o poder público ao Programa de Integridade.",
      icon: RotateCcw,
      badge: "Art. 163 da Lei 14.133",
      accent: "border-purple-500/30 group-hover:border-purple-500/60 bg-purple-950/20",
      iconColor: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>POR QUE ISSO IMPORTA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Programa de Integridade não é uma exigência para toda licitação.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Mas pode fazer diferença.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A legislação brasileira e as administrações públicas estabelecem situações claras em que ter um programa organizado e evidenciado é relevante ou determinante para a contratação.
          </p>
        </div>

        {/* Grid dos 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group shadow-lg ${point.accent}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border border-white/5 ${point.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                      {point.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {point.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA da Seção */}
        <div className="text-center pt-2">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>Descobrir meu nível de preparação</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
