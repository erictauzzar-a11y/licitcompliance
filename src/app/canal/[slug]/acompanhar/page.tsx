"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Building2,
  ShieldCheck,
  FileText,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Info
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { WhistleblowerReport, ReportStatus } from "@/types";
import { trackWhistleblowerReportAction } from "@/app/actions/whistleblower";

export default function PublicWhistleblowerTrackingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const company = mockStore.getCompany(resolvedParams.slug);

  const initialP = searchParams.get("p") || "";
  const initialK = searchParams.get("k") || "";

  const [protocol, setProtocol] = useState(initialP);
  const [accessKey, setAccessKey] = useState(initialK);
  const [report, setReport] = useState<WhistleblowerReport | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialP && initialK) {
      handleSearch(null, initialP, initialK);
    }
  }, [initialP, initialK]);

  const handleSearch = async (e: React.FormEvent | null, p = protocol, k = accessKey) => {
    if (e) e.preventDefault();
    if (!p.trim() || !k.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setSearched(false);

    try {
      const res = await trackWhistleblowerReportAction(resolvedParams.slug, p, k);
      if (res.success && res.report) {
        setReport(res.report);
      } else {
        setReport(null);
        setErrorMessage(res.error || "Protocolo ou Chave de Acesso inválidos.");
      }
      setSearched(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Erro ao consultar protocolo.");
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECEBIDA":
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Recebida / Em Triagem Inicial
          </span>
        );
      case "EM_ANALISE":
        return (
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-300 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Em Análise / Apuração pela Comissão
          </span>
        );
      case "PROCEDENTE":
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Concluída / Procedente (Medidas Adotadas)
          </span>
        );
      case "IMPROCEDENTE":
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-xs font-bold flex items-center gap-1.5">
            Concluída / Não Procedente
          </span>
        );
      case "ARQUIVADA":
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-300 rounded-full text-xs font-bold">
            Arquivada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ASSEDIO_MORAL_SEXUAL":
        return "Assédio Moral ou Sexual (NR-1)";
      case "CORRUPCAO_SUBORNO":
        return "Corrupção ou Propina (Lei nº 14.133)";
      case "FRAUDE_LICITACAO":
        return "Fraude em Licitação ou Contrato Público";
      case "SEGURANCA_TRABALHO":
        return "Segurança do Trabalho / Falta de EPIs";
      default:
        return "Outros Desvios Éticos";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/canal/${resolvedParams.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Canal</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[200px]">{company.trade_name}</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xl">
              <Search className="w-5 h-5 text-blue-600" />
              <h1>Acompanhamento de Denúncia</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Consulte a situação da sua manifestação em sigilo absoluto, sem necessidade de login.
            </p>
          </div>

          <form onSubmit={(e) => handleSearch(e)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Número do Protocolo *
              </label>
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Ex: DEN-2026-X89B42"
                required
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono uppercase bg-slate-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Chave de Acesso Sigilosa *
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Ex: Ab9#xK2"
                required
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono bg-slate-50/40"
              />
            </div>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Search className="w-4 h-4" />
                {loading ? "Consultando bases seguras..." : "Consultar Andamento do Protocolo"}
              </button>
            </div>
          </form>

          {/* RESULTADO DA CONSULTA */}
          {searched && (
            <div className="pt-4 border-t border-slate-100 animate-in fade-in">
              {report ? (
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Manifestação Encontrada
                      </span>
                      <strong className="text-lg text-slate-900 font-mono">{report.protocol}</strong>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Enviada em: {new Date(report.created_at).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(report.created_at).toLocaleTimeString("pt-BR")}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                        Status Atual da Apuração
                      </span>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>

                  {/* Informações da Categoria e Sigilo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 font-medium block">Categoria Classificada:</span>
                      <strong className="text-slate-800 text-sm mt-0.5 block">
                        {getCategoryLabel(report.category)}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 font-medium block">Identificação do Relator:</span>
                      <strong className="text-slate-800 text-sm mt-0.5 block flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        {report.is_anonymous ? "Relato 100% Anônimo" : "Relato Identificado sob Sigilo"}
                      </strong>
                    </div>
                  </div>

                  {/* Resposta Oficial da Comissão de Ética */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Resposta Oficial da Comissão de Apuração
                      </h3>
                    </div>

                    <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50/60 space-y-3">
                      {report.resolution_notes ? (
                        <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                          {report.resolution_notes}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 italic leading-relaxed">
                          Sua denúncia está em fase de triagem preliminar pela comissão de integridade. Assim que os fatos forem analisados e medidas adotadas, o parecer oficial será publicado aqui com proteção aos envolvidos.
                        </div>
                      )}

                      <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800 font-semibold">
                        <span>Órgão Responsável: Comissão de Ética & Integridade</span>
                        <span>
                          Atualizado em: {new Date(report.updated_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resumo do Relato Submetido */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cópia do Relato Registrado
                    </h3>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {report.description}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-red-50 border border-red-200 space-y-3">
                  <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-red-950">Denúncia Não Encontrada</h3>
                    <p className="text-xs text-red-700 max-w-md mx-auto mt-1 leading-relaxed">
                      {errorMessage ||
                        "Não foi encontrada nenhuma ocorrência com o Protocolo e Chave de Acesso informados para esta organização. Verifique os dados digitados e tente novamente."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-500">
        <p>
          Canal de Denúncias Seguro • <strong>TechCompliance</strong> • Garantia de Proteção ao Relator
        </p>
      </footer>
    </div>
  );
}
