import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Lock,
  Smartphone,
  CheckCircle2,
  FileText,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";
import { HeroInteractiveSimulator } from "@/components/HeroInteractiveSimulator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Topo Navegação */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="tracking-tight">LicitCompliance</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa
            </Link>
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all hidden sm:flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
            >
              Painel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Principal - 2 Colunas com Mockup Animado e Imagem Integrada */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Luzes decorativas sutis de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* Coluna Esquerda: Headline, Proposta de Valor e CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-400/25">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Conformidade & Integridade para Fornecedores Públicos</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Com poucos cliques, organize sua conformidade e{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-200">
                apresente suas evidências.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              A plataforma definitiva para estruturar, acompanhar e comprovar o Programa de Integridade da sua empresa conforme a <strong>Lei nº 14.133/2021</strong> e <strong>NR-1</strong>. Diagnóstico rápido, canal de denúncias ativo e dossiê probatório pronto em minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/cadastro"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.98]"
              >
                <Building2 className="w-4 h-4" />
                <span>Começar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#como-funciona"
                className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3.5 rounded-xl border border-slate-700/80 transition-all text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
              >
                <span>Ver como funciona</span>
              </Link>
            </div>

            {/* Micro-benefícios abaixo dos botões */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  100% Digital
                </div>
                <p className="text-[11px] text-slate-400">Sem consultorias demoradas</p>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Auditável
                </div>
                <p className="text-[11px] text-slate-400">Validação com QR Code</p>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Lei 14.133
                </div>
                <p className="text-[11px] text-slate-400">Foco em licitações</p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Mockup Realista com Simulação Animada + Fotografia Integrada */}
          <div className="lg:col-span-6 relative">
            {/* Foto Realista Integrada à Composição */}
            <div className="relative rounded-3xl overflow-hidden mb-4 border border-slate-800 shadow-xl hidden md:block">
              <div className="relative h-44 sm:h-52 w-full">
                <Image
                  src="/hero-professional.jpg"
                  alt="Profissional de Compliance gerenciando o programa de integridade"
                  fill
                  priority
                  className="object-cover object-top filter brightness-[0.88] contrast-[1.05]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-slate-200">
                      Painel Operacional em Tempo Real
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                    Simulação Interativa Contínua
                  </span>
                </div>
              </div>
            </div>

            {/* Simulador Interativo do Sistema com as 5 Cenas */}
            <HeroInteractiveSimulator />
          </div>
        </div>
      </section>

      {/* 3 Pilares Legais e Diferenciais */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Lei nº 14.133/2021 (Integridade)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cumprimento prático do Programa de Integridade exigido em contratações de grande vulto e desempate licitatório. Proibição de vantagens e lealdade concorrencial.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">NR-1 / Lei nº 14.457/2022</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prevenção obrigatória ao assédio moral e sexual, capacitação continuada da equipe e disponibilização de Canal de Denúncias seguro com garantia de não retaliação.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Dossiê e QR Code Auditável</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Geração de relatório probatório em PDF com validação pública por QR Code e hash de auditoria em segundos para comprovação perante comissões de contratação.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section id="como-funciona" className="py-16 border-t border-slate-800 bg-slate-950/50 px-4">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold">Como o LicitCompliance funciona</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Simplicidade para sua empresa atender aos requisitos de integridade sem burocracia ou consultorias custosas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-mono font-bold text-sm">Passo 1</div>
              <h4 className="font-bold text-white text-base">Diagnóstico Instantâneo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Informe o CNPJ da empresa e receba a estruturação completa dos pilares exigidos pela Lei 14.133/2021.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-mono font-bold text-sm">Passo 2</div>
              <h4 className="font-bold text-white text-base">Canal & Treinamentos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compartilhe o canal de denúncias independente e envie microtreinamentos rápidos para sua equipe pelo WhatsApp.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-mono font-bold text-sm">Passo 3</div>
              <h4 className="font-bold text-white text-base">Dossiê para Licitações</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emita relatórios de evidência com código de validação pública e QR Code para pregoeiros e fiscais de contrato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        LicitCompliance SaaS • Plataforma de Gestão Tecnológica de Integridade para Contratações Públicas
      </footer>
    </div>
  );
}

