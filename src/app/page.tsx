import Link from "next/link";
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
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Topo Navegação */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>LicitCompliance</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/translog-brasil"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors hidden sm:block"
            >
              Ver Portal Público Demo
            </Link>
            <Link
              href="/cadastro"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa (CNPJ)
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              Acessar Painel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <section className="py-20 px-4 text-center relative overflow-hidden bg-radial from-blue-900/40 via-slate-900 to-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4" />
            Conformidade Legal Obrigatória para Fornecedores do Setor Público
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Compliance Licitatório & NR-1 em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Microlearning Auditável
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Plataforma SaaS multi-tenant que automatiza a adesão a Códigos de Conduta, treinamentos em texto direto (sem vídeos cansativos) e Canal de Denúncias com emissão imediata de Dossiê em PDF para pregoeiros e fiscais.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
            >
              Abrir Dashboard Gestor <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cadastro"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa (CNPJ)
            </Link>
            <Link
              href="/treinar/translog-brasil"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all text-sm flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Link WhatsApp da Equipe
            </Link>
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

      {/* Atalhos Rápidos para Avaliação */}
      <section className="py-12 border-t border-slate-800 bg-slate-950/50 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h3 className="text-xl font-bold">Rotas Prontas para Demonstração:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <Link
              href="/portal/translog-brasil"
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors space-y-1 group"
            >
              <div className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                1. Portal Público da Empresa
              </div>
              <p className="text-xs text-slate-400">
                /portal/translog-brasil (apresentação, código público e indicadores)
              </p>
            </Link>

            <Link
              href="/treinar/translog-brasil"
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-colors space-y-1 group"
            >
              <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                2. Link Único WhatsApp
              </div>
              <p className="text-xs text-slate-400">
                /treinar/[slug] (fluxo ágil sem pré-cadastro, nome/CPF, quiz e termo)
              </p>
            </Link>

            <Link
              href="/canal/translog-brasil"
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500 transition-colors space-y-1 group"
            >
              <div className="text-xs font-bold text-red-400 group-hover:text-red-300">
                3. Canal de Denúncias
              </div>
              <p className="text-xs text-slate-400">
                /canal/[slug] (modo anônimo/identificado, chave sigilosa e acompanhamento)
              </p>
            </Link>

            <Link
              href="/validar/DOSSIE-2026-12345678"
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 transition-colors space-y-1 group"
            >
              <div className="text-xs font-bold text-purple-400 group-hover:text-purple-300">
                4. Validação QR Code
              </div>
              <p className="text-xs text-slate-400">
                /validar/[codigo] (autenticidade pública para fiscais e pregoeiros)
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        LicitCompliance SaaS • Desenvolvido para Segurança Jurídica e Integridade Pública
      </footer>
    </div>
  );
}

