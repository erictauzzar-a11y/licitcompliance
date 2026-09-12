"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import { simulatePaymentSuccessAction } from "@/app/actions/stripe";

export default function SimularPagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("•••");
  const [name, setName] = useState("EMPRESA DEMO LTDA");

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await simulatePaymentSuccessAction();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* Header Institucional */}
      <div className="max-w-4xl w-full flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span>TechCompliance</span>
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Ambiente de Simulação de Fluxo
        </span>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Resumo do Pedido / Stripe Checkout */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Simulador Oficial do Checkout Stripe
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Assinatura TechCompliance
            </h1>
            <p className="text-xs text-slate-400">
              Teste exatamente a experiência que o seu cliente terá ao passar o cartão e ser liberado no sistema.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Produto</span>
              <span className="font-bold text-white">Plano Empresarial Completo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Recorrência</span>
              <span className="text-slate-300 font-semibold">Mensal (Cancele quando quiser)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Taxa de Adesão</span>
              <span className="text-emerald-400 font-bold">R$ 0,00</span>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
              <span className="font-bold text-white text-base">Total a Pagar</span>
              <div className="text-right">
                <span className="text-2xl font-black text-white">R$ 189,90</span>
                <span className="text-xs text-slate-400 block">/mês</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Liberação imediata do Dossiê Probatório Lei 14.133</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Canal de denúncias independente e seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Análise de editais e Due Diligence automática</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário Simulado de Cartão */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Pagamento com Cartão</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Criptografia Stripe 256-bit</span>
            </div>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Número do Cartão de Crédito
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full font-mono text-sm px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="absolute right-3.5 top-3 text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Validade (MM/AA)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full font-mono text-sm px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  CVC / CVV
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full font-mono text-sm px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nome no Cartão
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Processando Pagamento e Liberando SaaS...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmar Pagamento Simulado e Acessar SaaS</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[11px] text-center text-slate-500">
            Nenhuma cobrança real será efetuada neste modo de simulação. Ao clicar, sua sessão autenticada será criada e você entrará diretamente no painel ativo com a confirmação da Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
