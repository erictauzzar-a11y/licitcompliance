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
  Search,
  FileDown,
  Check,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { HeroLiveSoftwareDemo } from "@/components/HeroLiveSoftwareDemo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* CAMADA 1 & 2: HERO EM CAMADAS COM A IMAGEM DE REFERÊNCIA DE FUNDO */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        {/* IMAGEM DE FUNDO (CAMADA 1) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-reference-bg.jpg"
            alt="Ambiente de trabalho executivo com LicitCompliance"
            fill
            priority
            quality={90}
            className="object-cover object-center filter brightness-[0.92] contrast-[1.03]"
            sizes="100vw"
          />
          {/* Overlay suave para assegurar legibilidade em qualquer resolução */}
          <div className="absolute inset-0 bg-slate-950/45 sm:bg-slate-950/35 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/50" />
        </div>

        {/* CONTEÚDO REAL DO SITE POR CIMA DA IMAGEM (CAMADA 2) */}
        <div className="relative z-10 flex flex-col min-h-[92vh] justify-between">
          {/* Topo Navegação Transparente com Glassmorphism */}
          <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
                  <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="leading-tight tracking-tight font-black">LicitCompliance</span>
                    <span className="text-[10px] text-blue-300 font-normal hidden sm:inline">Conformidade que gera oportunidades</span>
                  </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-200">
                  <Link href="#solucoes" className="hover:text-white transition-colors">Soluções</Link>
                  <Link href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</Link>
                  <Link href="#recursos" className="hover:text-white transition-colors">Recursos</Link>
                  <Link href="#licitacoes" className="hover:text-white transition-colors">Lei 14.133</Link>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-white px-3.5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl hover:bg-white/10"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.98]"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </header>

          {/* Área Principal do Hero */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Lado Esquerdo: Headline Oficial e CTAs */}
              <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                  <span>DA CONFORMIDADE ÀS OPORTUNIDADES</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
                  Prepare sua empresa para as licitações públicas{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                    em poucos cliques
                  </span>
                </h1>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-sm font-normal">
                  Diagnostique sua conformidade, organize suas evidências, analise editais e gere o dossiê pronto para apresentação. Tudo em um só lugar, de forma simples e segura.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    href="/cadastro"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/40 transition-all text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.98]"
                  >
                    <span>Começar agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="#como-funciona"
                    className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
                    </div>
                    <span>Ver como funciona</span>
                  </Link>
                </div>

                {/* 3 Checkmarks de Confiança */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Implantação rápida</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Suporte especializado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Segurança de dados</span>
                  </div>
                </div>

                {/* Micro Instituições / Confiança */}
                <div className="pt-6 border-t border-white/10 text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-2 text-center lg:text-left">
                    Em conformidade com as diretrizes de:
                  </div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-300">
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Lei 14.133/2021</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">NR-1 (Assédio)</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">TCU & CGU</span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: CAMADA 3 — DEMONSTRAÇÃO DO SOFTWARE VIVO */}
              <div className="lg:col-span-7 relative">
                {/* Nota manuscrita decorativa inspirada no design */}
                <div className="hidden xl:block absolute -top-8 left-12 z-20 text-blue-200 text-xs font-medium italic opacity-90">
                  Do diagnóstico ao dossiê, sem complicação. ↗
                </div>

                {/* Software Live Demo */}
                <HeroLiveSoftwareDemo />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* SEÇÃO 6 PASSOS — EXATAMENTE COMO NA REFERÊNCIA */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              COMO FUNCIONA
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Em 6 passos, sua empresa mais preparada
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Simplicidade e rigor técnico para atender a todas as exigências de integridade do poder público.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Passo 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h3 className="font-bold text-xs text-slate-900">Cadastre a empresa</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1 font-mono">
                  <div className="text-slate-400">CNPJ: 33.000.167/0001-01</div>
                  <div className="font-bold text-slate-800 truncate">TransLog Brasil S/A</div>
                  <span className="inline-block bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans font-bold text-[9px]">Ativa</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Informe apenas o CNPJ e o sistema consulta os dados públicos automaticamente.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="font-bold text-xs text-slate-900">Realize o diagnóstico</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-lg font-black text-emerald-600">82%</div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Conformidade</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                O motor avalia instantaneamente a aderência aos pilares da Lei 14.133.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h3 className="font-bold text-xs text-slate-900">Resolva pendências</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center gap-1 text-red-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>0 Críticas</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>3 Orientações</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Receba planos de ação objetivos para regularizar tudo com poucos cliques.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="font-bold text-xs text-slate-900">Organize evidências</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Código Vigente</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Canal Ativo</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Centralize certificados, termos e atas com hash de autenticidade.
              </p>
            </div>

            {/* Passo 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                  <h3 className="font-bold text-xs text-slate-900">Analise os editais</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center gap-1 text-blue-700 font-bold">
                    <Search className="w-3 h-3" />
                    <span>IA de Extração</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block">Cruza exigências</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Descubra em segundos o que o edital exige e o que sua empresa já possui.
              </p>
            </div>

            {/* Passo 6 */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">6</span>
                  <h3 className="font-bold text-xs text-blue-950">Gere o dossiê</h3>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-blue-200 text-center">
                  <FileDown className="w-5 h-5 text-blue-600 mx-auto" />
                  <span className="text-[10px] font-bold text-blue-800 block mt-1">Dossiê Pronto</span>
                </div>
              </div>
              <p className="text-[11px] text-blue-900">
                Exporte o relatório probatório com QR Code para anexar à sua proposta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILARES NORMATIVOS */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Lei nº 14.133/2021 (Integridade)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cumprimento prático do Programa de Integridade exigido em contratações de grande vulto e desempate licitatório. Proibição de vantagens e lealdade concorrencial.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">NR-1 / Lei nº 14.457/2022</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prevenção obrigatória ao assédio moral e sexual, capacitação continuada da equipe e disponibilização de Canal de Denúncias seguro com garantia de não retaliação.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
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

      {/* Rodapé */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>LicitCompliance</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Plataforma de Gestão Tecnológica de Integridade para Contratações Públicas • Lei 14.133/2021
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="hover:text-white transition-colors">Acesso Gestor</Link>
            <Link href="/cadastro" className="hover:text-white transition-colors">Cadastrar Empresa</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

