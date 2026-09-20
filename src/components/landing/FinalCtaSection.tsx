"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Luz e brilho de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8 p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>COMECE SEM RISCO</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Descubra o que sua empresa precisa organizar
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Faça gratuitamente uma avaliação inicial do seu Programa de Integridade e veja quais pontos merecem atenção.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/acessar-demo"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold px-9 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Acessar versão demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sem cartão de crédito.</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Resultado em minutos</span>
          </div>
          <span>•</span>
          <span>Sigilo empresarial garantido</span>
        </div>
      </div>
    </section>
  );
}
