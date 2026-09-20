"use client";

import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Gauge,
  Search,
  Building2,
  FileQuestion,
} from "lucide-react";

export function FreeDiagnosticSection() {
  const flowSteps = [
    {
      step: "01",
      title: "CNPJ",
      desc: "Consulta dados públicos oficiais",
      icon: Search,
    },
    {
      step: "02",
      title: "Perfil da empresa",
      desc: "Porte e contratações públicas",
      icon: Building2,
    },
    {
      step: "03",
      title: "Perguntas inteligentes",
      desc: "Mapeamento rápido dos pilares essenciais",
      icon: FileQuestion,
    },
    {
      step: "04",
      title: "Diagnóstico",
      desc: "Confronto com a Lei 14.133/2021",
      icon: Gauge,
    },
    {
      step: "05",
      title: "Resultado",
      desc: "Score e pontos de atenção",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="diagnostico" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Luz ambiente de destaque */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AVALIAÇÃO DE INTEGRIDADE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Descubra onde sua empresa está hoje
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Faça uma avaliação inicial e veja o que já está estruturado, o que precisa de atenção e quais evidências ainda precisam ser organizadas.
          </p>
        </div>

        {/* Demonstração VISUAL / SIMULADA do Diagnóstico (Sem formulário de CNPJ) */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 shadow-2xl shadow-blue-950/50 backdrop-blur-xl max-w-3xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Exemplo de Diagnóstico • Simulação Visual
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Demonstração Ilustrativa
            </span>
          </div>

          {/* Checklist Demonstrativo */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Estrutura organizacional</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Atendido
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Código de Conduta</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Atendido
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">Treinamentos periódicos</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Atenção
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">Gestão de riscos</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Atenção
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-semibold text-white">Monitoramento e auditoria</span>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                A desenvolver
              </span>
            </div>
          </div>

          {/* Barra de Score Simulada */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-300">Resultado Médio Inicial</div>
              <div className="text-[11px] text-slate-400">
                Mapeamento baseado nos parâmetros da Lei 14.133/2021
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-black text-white">61%</div>
                <div className="text-[9px] font-bold text-blue-400 uppercase">estruturado</div>
              </div>
              <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full w-[61%]" />
              </div>
            </div>
          </div>

          {/* CTA para a Tela Exclusiva /diagnostico */}
          <div className="pt-2 text-center space-y-3">
            <Link
              href="/acessar-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm transition-all"
            >
              <span>Acessar versão demo →</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sem necessidade de cartão
              </span>
              <span>•</span>
              <span>Resultado em 3 minutos</span>
              <span>•</span>
              <span>Avaliação sigilosa</span>
            </div>
          </div>
        </div>

        {/* Representação Visual do Fluxo em 5 Etapas */}
        <div className="space-y-4">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            Fluxo da ferramenta de diagnóstico
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {flowSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {s.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  {idx < flowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
