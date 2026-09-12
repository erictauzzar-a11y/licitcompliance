"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Search, ArrowLeft, Clock, CheckCircle2, AlertCircle, Lock, Building2 } from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { WhistleblowerReport } from "@/types";

export default function ReportTrackingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const company = mockStore.getCompany(resolvedParams.slug);

  const initialP = searchParams.get("p") || "";
  const initialK = searchParams.get("k") || "";

  const [protocol, setProtocol] = useState(initialP);
  const [accessKey, setAccessKey] = useState(initialK);
  const [report, setReport] = useState<WhistleblowerReport | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialP && initialK) {
      handleSearch(null, initialP, initialK);
    }
  }, [initialP, initialK]);

  const handleSearch = (e: React.FormEvent | null, p = protocol, k = accessKey) => {
    if (e) e.preventDefault();
    if (!p.trim() || !k.trim()) return;

    const found = mockStore.getReportByProtocol(p, k);
    setReport(found || null);
    setSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECEBIDA":
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">Recebida / Em Triagem</span>;
      case "EM_ANALISE":
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Em Apuração pela Comissão</span>;
      case "PROCEDENTE":
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">Procedente - Medidas Adotadas</span>;
      case "IMPROCEDENTE":
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">Improcedente</span>;
      case "ARQUIVADA":
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">Arquivada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/portal/${resolvedParams.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Portal
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{company.trade_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
              <Search className="w-5 h-5 text-blue-600" />
              <h1>Consulta de Andamento da Denúncia</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verifique o status da apuração realizada pela comissão de integridade através das suas credenciais anônimas.
            </p>
          </div>

          <form onSubmit={(e) => handleSearch(e)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número do Protocolo
              </label>
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Ex: DEN-2026-4891"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chave de Acesso
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Ex: SEC894"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Localizar Protocolo
              </button>
            </div>
          </form>

          {searched && (
            <div className="pt-4 border-t border-slate-100 animate-in fade-in">
              {report ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Protocolo Localizado</span>
                      <strong className="text-base text-slate-900 font-mono">{report.protocol}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block mb-1">Status Atual</span>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Detalhes do Relato
                    </h3>
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Registrado em: {new Date(report.created_at).toLocaleDateString("pt-BR")} às {new Date(report.created_at).toLocaleTimeString("pt-BR")}
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Parecer e Encaminhamentos da Comissão de Ética
                    </h3>
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                      {report.resolution_notes ? (
                        <div className="text-sm text-blue-950 leading-relaxed whitespace-pre-line">
                          {report.resolution_notes}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 italic">
                          O relato está em fase inicial de apuração preliminar com estrito sigilo. Novas atualizações e deliberações serão registradas aqui.
                        </div>
                      )}
                      <div className="text-xs text-blue-700 pt-1 font-medium">
                        Última atualização registrada em: {new Date(report.updated_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-xl bg-red-50 border border-red-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                  <h3 className="text-base font-bold text-red-900">Protocolo Não Encontrado</h3>
                  <p className="text-xs text-red-700 max-w-sm mx-auto">
                    Não encontramos nenhuma manifestação com o protocolo e a chave de acesso fornecidos. Por favor, verifique os caracteres e tente novamente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
