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
import { LaptopInteractiveShowcase } from "@/components/LaptopInteractiveShowcase";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* CAMADA 1 & 2: HERO EM CAMADAS COM A IMAGEM DE REFERÊNCIA DE FUNDO */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        {/* IMAGEM DE FUNDO (CAMADA 1) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-reference-bg.jpg"
            alt="Ambiente de trabalho executivo com TechCompliance"
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
          {/* Topo Navegação Global com Dropdowns Ricos */}
          <SiteHeader />

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

      {/* SEÇÃO 6 PASSOS — REFINADA COM DESIGN SYSTEM ESCURO E ELEGANTE */}
      <section id="como-funciona" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/70 border-t border-b border-white/5 text-white relative overflow-hidden">
        {/* Glow de fundo sutil */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>COMO FUNCIONA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Em 6 passos, sua empresa mais preparada
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Simplicidade e rigor técnico para atender a todas as exigências de integridade do poder público.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Passo 1 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">1</span>
                  <h3 className="font-bold text-xs text-white">Cadastre a empresa</h3>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] space-y-1 font-mono">
                  <div className="text-slate-400">CNPJ: 33.000.167/0001-01</div>
                  <div className="font-bold text-slate-200 truncate">TransLog Brasil S/A</div>
                  <span className="inline-block bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-sans font-bold text-[9px]">Ativa</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Informe apenas o CNPJ e o sistema consulta os dados públicos automaticamente.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">2</span>
                  <h3 className="font-bold text-xs text-white">Realize o diagnóstico</h3>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
                  <div className="text-lg font-black text-emerald-400">82%</div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Conformidade</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                O motor avalia instantaneamente a aderência aos pilares da Lei 14.133.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">3</span>
                  <h3 className="font-bold text-xs text-white">Resolva pendências</h3>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>0 Críticas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>3 Orientações</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Receba planos de ação objetivos para regularizar tudo com poucos cliques.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">4</span>
                  <h3 className="font-bold text-xs text-white">Organize evidências</h3>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Código Vigente</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Canal Ativo</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Centralize certificados, termos e atas com hash de autenticidade SHA-256.
              </p>
            </div>

            {/* Passo 5 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">5</span>
                  <h3 className="font-bold text-xs text-white">Analise os editais</h3>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Search className="w-3 h-3" />
                    <span>IA de Extração</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block">Cruza exigências</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Descubra em segundos o que o edital exige e o que sua empresa já possui.
              </p>
            </div>

            {/* Passo 6 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-950/80 border border-blue-500/30 hover:border-blue-400/60 transition-all flex flex-col justify-between space-y-3 group shadow-xl shadow-blue-950/50">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-400/50">6</span>
                  <h3 className="font-bold text-xs text-blue-200">Gere o dossiê</h3>
                </div>
                <div className="p-2.5 bg-blue-900/30 rounded-xl border border-blue-500/30 text-center">
                  <FileDown className="w-5 h-5 text-blue-400 mx-auto" />
                  <span className="text-[10px] font-bold text-blue-200 block mt-1">Dossiê Pronto</span>
                </div>
              </div>
              <p className="text-[11px] text-blue-200/90 leading-relaxed">
                Exporte o relatório probatório com QR Code para anexar à sua proposta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO NOTEBOOK REALISTA: AS 3 TELAS DO SOFTWARE PASSANDO DENTRO DA TELA */}
      <LaptopInteractiveShowcase />

      {/* SEÇÃO INFERIOR — GESTÃO NA PALMA DA MÃO (SHOWCASE MULTIDISPOSITIVO) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Lado Esquerdo: Imagem com moldura refinada e glow */}
            <div className="lg:col-span-7 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
                <Image
                  src="/mobile-showcase.jpg"
                  alt="Gestão de conformidade e integridade no smartphone e computador com o TechCompliance"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-[1.01]"
                  priority={false}
                  quality={90}
                />
              </div>
            </div>

            {/* Lado Direito: Chamada Comercial e Benefícios */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>EXPERIÊNCIA MOBILE COMPLETA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Acompanhe e gerencie também pelo celular, com o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-200">nosso App</span>.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Tenha o controle total do seu programa de integridade na palma da sua mão. Resolva pendências prioritárias, aprove evidências, acompanhe denúncias e consulte análises de editais a qualquer hora e em qualquer lugar.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 text-left">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5 border border-blue-500/20">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">App Ágil e Intuitivo</h4>
                    <p className="text-xs text-slate-400">Design responsivo pensado para tomadas de decisão rápidas direto pelo smartphone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Notificações e Prazos em Tempo Real</h4>
                    <p className="text-xs text-slate-400">Alertas automáticos de pendências que podem impactar sua participação em editais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 border border-indigo-500/20">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dossiê Probatório Rápido</h4>
                    <p className="text-xs text-slate-400">Compartilhe o QR Code de validação pública com comissões de licitação em segundos.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/cadastro"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>Acessar meu diagnóstico</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all text-xs sm:text-sm flex items-center justify-center"
                >
                  <span>Já sou cliente</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER DE PREÇO — R$ 189,90/MÊS (PLANO COMPLETO) */}
      <section id="planos" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-950">
        {/* Luzes de fundo atmosféricas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto">
          {/* Card Principal do Banner */}
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-blue-500/30 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
            {/* Badge de Oferta Especial */}
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
              {/* Lado Esquerdo: Chamada e Benefícios */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Tudo o que sua empresa precisa para disputar e vencer licitações
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                    Conformidade integral com a Lei 14.133/2021 e NR-1, canal de denúncias independente, análise de editais com IA e dossiês probatórios com validação pública.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Diagnóstico de Integridade Contínuo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Análise de Editais com IA</span>
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
                    <span>Treinamento e Capacitação da Equipe</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Due Diligence de Terceiros e Sócios</span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Preço e CTA em Destaque */}
              <div className="lg:col-span-5 bg-gradient-to-b from-blue-950/40 via-slate-900/80 to-slate-950 p-7 sm:p-8 rounded-2xl border border-blue-500/30 text-center space-y-6 shadow-xl relative overflow-hidden">
                <div className="space-y-1">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Assinatura Mensal
                  </div>
                  <div className="flex items-baseline justify-center gap-1.5 text-white">
                    <span className="text-2xl font-bold text-slate-300">R$</span>
                    <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">189,90</span>
                    <span className="text-sm font-semibold text-slate-400">/mês</span>
                  </div>
                  <p className="text-[11px] text-blue-300 font-medium">
                    Ativação imediata da plataforma
                  </p>
                </div>

                <div className="space-y-3">
                  <CheckoutButton
                    label="Começar agora por R$ 189,90"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/40 text-sm"
                  />

                  <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Pagamento Seguro</span>
                    </div>
                    <span>•</span>
                    <span>Acesso Instantâneo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé Global */}
      <SiteFooter />
    </div>
  );
}

