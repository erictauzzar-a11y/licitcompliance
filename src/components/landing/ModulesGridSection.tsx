"use client";

import Link from "next/link";
import {
  Gauge,
  FileText,
  FileCheck2,
  GraduationCap,
  Megaphone,
  UserCheck,
  Search,
  FileDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function ModulesGridSection() {
  const modules = [
    {
      title: "Diagnóstico",
      desc: "Identifique requisitos e pontos que precisam ser desenvolvidos.",
      icon: Gauge,
      badge: "Maturidade Contínua",
    },
    {
      title: "Políticas",
      desc: "Organize Código de Conduta e políticas de integridade.",
      icon: FileText,
      badge: "Personalização",
    },
    {
      title: "Evidências",
      desc: "Centralize documentos e evidências do programa.",
      icon: FileCheck2,
      badge: "Validação SHA-256",
    },
    {
      title: "Treinamentos",
      desc: "Registre treinamentos e acompanhe a participação.",
      icon: GraduationCap,
      badge: "Gestão de Colaboradores",
    },
    {
      title: "Canal de Denúncias",
      desc: "Estruture o canal e acompanhe ocorrências.",
      icon: Megaphone,
      badge: "Anonimato Seguro",
    },
    {
      title: "Due Diligence",
      desc: "Avalie terceiros e riscos relacionados.",
      icon: UserCheck,
      badge: "Análise de Riscos",
    },
    {
      title: "Análise de Editais",
      desc: "Analise o edital e identifique possíveis exigências relacionadas à integridade.",
      icon: Search,
      badge: "Extração Inteligente",
    },
    {
      title: "Dossiê",
      desc: "Organize as evidências em um dossiê apresentável.",
      icon: FileDown,
      badge: "Exportação com QR Code",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>O QUE O TECHCOMPLIANCE RESOLVE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Transforme o diagnóstico em um programa organizado
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Módulos integrados que cobrem todo o ciclo de estruturação, acompanhamento e comprovação da integridade da sua empresa.
          </p>
        </div>

        {/* Grid dos 8 Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA da Seção */}
        <div className="text-center pt-4">
          <Link
            href="/acessar-demo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 text-sm transition-all"
          >
            <span>Acessar versão demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
