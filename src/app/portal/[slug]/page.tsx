"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, AlertTriangle, Search, CheckCircle2, Lock, Building2, ArrowRight } from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CompanyPublicPortal({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const company = mockStore.getCompany(resolvedParams.slug);
  const policy = mockStore.getPolicy();
  const metrics = mockStore.getComplianceMetrics();

  const [searchProtocol, setSearchProtocol] = useState("");
  const [searchAccessKey, setSearchAccessKey] = useState("");
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const handleProtocolSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchProtocol.trim() || !searchAccessKey.trim()) return;
    router.push(`/canal/${resolvedParams.slug}/acompanhar?p=${encodeURIComponent(searchProtocol.trim())}&k=${encodeURIComponent(searchAccessKey.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header Institucional */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2 rounded-lg font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>TechCompliance</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{company.trade_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100"
            >
              Acesso Gestor
            </Link>
            <Link
              href={`/canal/${resolvedParams.slug}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              Canal de Denúncias
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4" />
            Programa Ativo de Integridade & Prevenção ao Assédio
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Portal de Integridade e Conformidade
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bem-vindo ao canal oficial de conformidade da <strong className="text-white font-semibold">{company.legal_name}</strong> (CNPJ: {formatCNPJ(company.cnpj)}), em estrito cumprimento à <span className="text-blue-300 font-semibold">Lei Federal nº 14.133/2021</span> e à <span className="text-blue-300 font-semibold">NR-1 / Lei nº 14.457/2022</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPolicyModal(true)}
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              Ler Código de Conduta Ativo
            </button>
            <Link
              href={`/canal/${resolvedParams.slug}`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-colors"
            >
              <Lock className="w-4 h-4" />
              Fazer Denúncia Segura & Anônima
            </Link>
          </div>
        </div>
      </section>

      {/* Indicadores de Conformidade */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{metrics.policyRate}%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                Adesão ao Código de Ética
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Colaboradores ativos com termo formal assinado eletronicamente.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{metrics.trainingRate}%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                Capacitação Lei 14.133 / NR-1
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Conclusão de microlearning e aprovação em quiz de fixação.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">Canal 24/7</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                Ouvidoria Independente
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Garantia estrita de sigilo, anonimato e política de não retaliação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consulta de Protocolo & Pilares */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consulta de Protocolo */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h3>Acompanhar Denúncia</h3>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Insira o número do protocolo e a chave de acesso gerada no envio para consultar o status de apuração:
          </p>

          <form onSubmit={handleProtocolSearch} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número do Protocolo
              </label>
              <input
                type="text"
                value={searchProtocol}
                onChange={(e) => setSearchProtocol(e.target.value)}
                placeholder="Ex: DEN-2026-4891"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chave de Acesso Confidencial
              </label>
              <input
                type="text"
                value={searchAccessKey}
                onChange={(e) => setSearchAccessKey(e.target.value)}
                placeholder="Ex: SEC894"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Consultar Andamento
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link
              href={`/canal/${resolvedParams.slug}`}
              className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            >
              Precisa registrar uma nova denúncia? <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pilares do Programa */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Nossos Compromissos com a Administração Pública e Sociedade
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Lei nº 14.133/2021 (Integridade)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Proibição estrita de pagamento de vantagens, brindes ou cortesias a agentes públicos. Rastreabilidade de propostas e lealdade contratual.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>NR-1 / Lei nº 14.457/2022</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tolerância zero ao assédio moral e sexual. Adoção obrigatória de rotinas de conscientização, inclusão e segurança no trabalho.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Capacitação em Microlearning</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Metodologia moderna de leitura rápida e quizzes de fixação sem perda de foco operacional para 100% da força de trabalho.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Auditoria & Verificação Pública</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todos os certificados e o Dossiê Executivo contam com QR Code e hashes digitais verificáveis por fiscais e pregoeiros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Código de Conduta */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">{policy.title}</h3>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-900 font-medium">
                Versão Vigente: {policy.version} | Atualizado em: {new Date(policy.updated_at).toLocaleDateString("pt-BR")}
              </div>
              <div className="whitespace-pre-line text-slate-800">
                {policy.content}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} {company.legal_name}. Todos os direitos reservados.</p>
          <p>Ambiente operacional em conformidade com a Lei nº 14.133/2021 e NR-1 / Lei nº 14.457/2022.</p>
        </div>
      </footer>
    </div>
  );
}
