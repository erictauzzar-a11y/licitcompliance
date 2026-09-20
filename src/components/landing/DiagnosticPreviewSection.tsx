"use client";

import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

export function DiagnosticPreviewSection() {
  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>EXEMPLO DE ENTREGA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Veja como você recebe o resultado
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Uma visão clara, objetiva e sem termos burocráticos sobre o que sua empresa já possui e onde precisa focar.
          </p>
        </div>

        {/* Card do Resultado Simulado (Identificado como SIMULAÇÃO) */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-950 border border-slate-700/80 shadow-2xl shadow-black/60 space-y-8">
          {/* Badge de Alerta: SIMULAÇÃO ILUSTRATIVA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                Seu diagnóstico está pronto
              </h3>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Simulação Ilustrativa • Empresa Modelo
            </span>
          </div>

          {/* Grid de Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score Geral */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center sm:text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nível de Estruturação
              </div>
              <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white">61%</span>
                <span className="text-xs font-bold text-blue-400">estruturado</span>
              </div>
              {/* Barra de progresso */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full"
                  style={{ width: "61%" }}
                />
              </div>
            </div>

            {/* Pontos Estruturados */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center sm:text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Atendidos</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">14</div>
              <p className="text-[11px] text-slate-400">pontos estruturados</p>
            </div>

            {/* Pontos de Atenção */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center sm:text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Atenção</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">6</div>
              <p className="text-[11px] text-slate-400">pontos de atenção</p>
            </div>

            {/* Pontos a Desenvolver */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center sm:text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>A Desenvolver</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-300">7</div>
              <p className="text-[11px] text-slate-400">pontos a desenvolver</p>
            </div>
          </div>

          {/* Mensagem Analítica Conclusiva */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Avaliação Preliminar
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Encontramos pontos que podem ser aprimorados na estrutura e na evidenciação do seu Programa de Integridade para mitigar riscos em contratações públicas e reforçar sua segurança jurídica.
              </p>
            </div>
          </div>

          {/* Mini Amostra de Requisitos Mapeados */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exemplo de Requisitos Avaliados no Diagnóstico:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">Código de Conduta Ética</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Estruturado
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">Canal de Denúncias Seguro</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Atenção
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">Due Diligence de Terceiros</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  A desenvolver
                </span>
              </div>
            </div>
          </div>

          {/* CTA de Continuidade para o Produto */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Descubra a situação real da sua empresa com perguntas rápidas e sem custo.
            </div>

            <Link
              href="/acessar-demo"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>Acessar versão demo →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
