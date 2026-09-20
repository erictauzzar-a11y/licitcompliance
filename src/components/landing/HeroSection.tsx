"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroLiveSoftwareDemo } from "@/components/HeroLiveSoftwareDemo";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24">
      {/* Luz ambiente e gradientes sutis */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Lado Esquerdo: Copywriting e CTAs de Conversão com Entrada Escalonada */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* 1. Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>PARA EMPRESAS QUE VENDEM PARA O GOVERNO</span>
            </div>

            {/* 2. Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md animate-fade-in-up [animation-delay:100ms]">
              Sua empresa está preparada para apresentar seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                Programa de Integridade?
              </span>
            </h1>

            {/* 3. Subheadline */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-sm font-normal animate-fade-in-up [animation-delay:200ms]">
              Descubra o que sua empresa já possui, o que pode ser exigido em suas contratações e quais pontos precisam ser estruturados e evidenciados.
            </p>

            {/* 4. CTA Principal */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 animate-fade-in-up [animation-delay:300ms]">
              <Link
                href="/acessar-demo"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:ring-1 hover:ring-blue-300/50 text-sm flex items-center justify-center gap-2 transition-all group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Acessar versão demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 5. Três Checkmarks de Baixo Atrito */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300 animate-fade-in [animation-delay:400ms]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Demonstração completa</span>
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

            {/* 6. Referência Técnica e Institucional */}
            <div className="pt-5 border-t border-white/10 text-left animate-fade-in [animation-delay:500ms]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center lg:text-left">
                Alinhado aos parâmetros técnicos de:
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold text-slate-300">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Lei 14.133/2021</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Decreto 12.304/2024</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Lei 14.457/2022 (NR-1)</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Demonstração Visual de Software em Ação */}
          <div className="lg:col-span-7 relative animate-fade-in-up [animation-delay:250ms]">
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
