"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { HeroLiveSoftwareDemo } from "@/components/HeroLiveSoftwareDemo";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-10 sm:pt-14 pb-16 lg:pb-24">
      {/* Luz ambiente e gradientes sutis */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Lado Esquerdo: Copywriting e CTAs de Conversão */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>PARA EMPRESAS QUE VENDEM PARA O GOVERNO</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
              Sua empresa está preparada para apresentar seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                Programa de Integridade?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-sm font-normal">
              Descubra o que sua empresa já possui, o que pode ser exigido em suas contratações e quais pontos precisam ser estruturados e evidenciados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="#diagnostico"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-7 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>FAZER DIAGNÓSTICO GRATUITO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#como-funciona"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold px-6 py-4 rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Ver como funciona →</span>
              </Link>
            </div>

            {/* 3 Checkmarks de Baixo Atrito */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Diagnóstico inicial gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Resultado em poucos minutos</span>
              </div>
            </div>

            {/* Referência Técnica e Institucional */}
            <div className="pt-6 border-t border-white/10 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center lg:text-left">
                Alinhado aos parâmetros técnicos de:
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-300">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Lei 14.133/2021</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Decreto 12.304/2024</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Lei 14.457/2022</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Demonstração Visual de Software em Ação */}
          <div className="lg:col-span-7 relative">
            <div className="hidden xl:block absolute -top-8 left-12 z-20 text-blue-200 text-xs font-medium italic opacity-90">
              Do diagnóstico ao dossiê, tudo em um único ambiente. ↗
            </div>
            <HeroLiveSoftwareDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
