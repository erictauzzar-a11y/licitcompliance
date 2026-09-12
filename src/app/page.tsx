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
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa
            </Link>
            <Link
              href="/dashboard"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all hidden sm:flex items-center gap-1.5"
            >
              Painel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <section className="py-20 px-4 text-center relative overflow-hidden bg-radial from-blue-900/40 via-slate-900 to-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4" />
            Programa de Integridade para Empresas Fornecedoras do Setor Público
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Programa de Integridade & Compliance Licitatório{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              (Lei 14.133/2021)
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Estruture, comprove e monitore o Programa de Integridade da sua empresa em uma única plataforma. Políticas, Due Diligence, treinamentos rápidos e Canal de Denúncias com emissão imediata de Dossiê Auditável para pregoeiros e comissões de licitação.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa com CNPJ
            </Link>
            <Link
              href="/dashboard"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl border border-slate-700 transition-all text-sm flex items-center gap-2"
            >
              Acessar Painel <ArrowRight className="w-4 h-4" />
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

      {/* Seção Como Funciona */}
      <section className="py-16 border-t border-slate-800 bg-slate-950/50 px-4">
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

