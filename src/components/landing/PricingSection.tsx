"use client";

import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";

export function PricingSection() {
  return (
    <section id="planos" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-950">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Card Principal do Plano */}
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-blue-500/30 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
          {/* Header do Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>PLANO COMPLETO • ACESSO TOTAL</span>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span>Sem taxa de adesão • Cancele quando quiser</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8">
            {/* Lado Esquerdo: Chamada e Recursos */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Comece a estruturar seu Programa de Integridade
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                  Estruture e comprove seu programa de integridade em um único ambiente integrado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diagnóstico Contínuo de Integridade</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Análise de Editais e Exigências</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Canal de Denúncias com Anonimato</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dossiês com QR Code e Hash SHA-256</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Treinamentos e Registro de Participação</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Due Diligence de Terceiros e Sócios</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Preço e Botão */}
            <div className="lg:col-span-5 bg-gradient-to-b from-blue-950/40 via-slate-900/80 to-slate-950 p-7 sm:p-8 rounded-2xl border border-blue-500/30 text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-2 py-2">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  TechCompliance Premium
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Acesso Completo à Plataforma
                </div>
                <p className="text-xs text-blue-300 font-medium pt-1">
                  Ativação imediata • Suporte especializado
                </p>
              </div>

              <div className="space-y-3">
                <CheckoutButton
                  label="Acessar versão demo"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/40 text-sm"
                />

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Demonstração Guiada</span>
                  </div>
                  <span>•</span>
                  <span>Sem Cartão de Crédito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
