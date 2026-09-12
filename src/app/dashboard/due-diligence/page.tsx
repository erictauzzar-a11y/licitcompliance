"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Building2,
  Users,
  Lock,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  AlertOctagon,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { DueDiligenceRecord } from "@/types";
import { formatCNPJ, formatCPF } from "@/lib/utils";
import { generateDueDiligenceReportPDF } from "@/lib/due-diligence-service";

export default function DueDiligencePage() {
  const company = mockStore.getCompany();

  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<DueDiligenceRecord | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<DueDiligenceRecord[]>([]);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
      setErrorMsg("CNPJ deve conter exatamente 14 dígitos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/due-diligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: cleanCnpj }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Falha ao consultar fornecedor.");
      } else {
        setCurrentAnalysis(data);
        setRecentAnalyses((prev) => [data, ...prev.filter((r) => r.supplier?.cnpj !== cleanCnpj)]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão ao executar Due Diligence.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (record: DueDiligenceRecord) => {
    setDownloadingPdf(true);
    try {
      await generateDueDiligenceReportPDF(record, company.legal_name);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in font-sans">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Due Diligence de Fornecedores e Parceiros (DDI)
            </h1>
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Lei 14.133/2021
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditoria automatizada de terceiros, subempreiteiros e prestadores em bases oficiais do Governo Federal (CEIS, CNEP, PEP e MTE).
          </p>
        </div>
      </div>

      {/* Caixa de Busca com CNPJ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Digite o CNPJ do Terceiro para Análise Imediata
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="Ex: 00.000.000/0000-00 ou 11.222.333/0001-44"
                required
                className="w-full text-sm font-mono px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <div className="absolute right-3.5 top-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Auditando Bases do Governo..." : "Executar Due Diligence"}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {errorMsg}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span>Bases consultadas em tempo real:</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">CEIS (CGU)</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">CNEP (CGU)</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">PEP (Sócios)</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Lista Suja MTE</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">BrasilAPI QSA</span>
          </div>
        </form>
      </div>

      {/* RESULTADO DA ANÁLISE ATUAL */}
      {currentAnalysis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          {/* Topo do Fornecedor e Parecer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Diagnóstico de Integridade de Terceiro
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {currentAnalysis.supplier?.legal_name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>CNPJ: {formatCNPJ(currentAnalysis.supplier?.cnpj || "")}</span>
                <span>•</span>
                <span>Situação: {currentAnalysis.supplier?.status_cadastral}</span>
              </div>
            </div>

            {/* Badge de Risco */}
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl border text-center ${
                  currentAnalysis.risk_status === "APROVADO"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : currentAnalysis.risk_status === "ALERTA"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  Nível de Risco: {currentAnalysis.risk_level}
                </div>
                <div className="text-base font-extrabold mt-0.5 flex items-center justify-center gap-1">
                  {currentAnalysis.risk_status === "APROVADO" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {currentAnalysis.risk_status === "ALERTA" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {currentAnalysis.risk_status === "BLOQUEADO" && <AlertOctagon className="w-4 h-4 text-red-600" />}
                  <span>{currentAnalysis.risk_status}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadPDF(currentAnalysis)}
                disabled={downloadingPdf}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                {downloadingPdf ? "Gerando PDF..." : "Relatório DDI (PDF)"}
              </button>
            </div>
          </div>

          {/* Grid das 4 Bases Governamentais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card CEIS */}
            <div className={`p-4 rounded-xl border ${currentAnalysis.has_ceis ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-xs font-bold text-slate-700">1. CEIS (CGU)</div>
              <div className="text-[11px] text-slate-500">Inidôneos e Suspensos</div>
              <div className="mt-2 text-xs font-bold flex items-center gap-1.5">
                {currentAnalysis.has_ceis ? (
                  <span className="text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Registro Ativo
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nada Consta
                  </span>
                )}
              </div>
            </div>

            {/* Card CNEP */}
            <div className={`p-4 rounded-xl border ${currentAnalysis.has_cnep ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-xs font-bold text-slate-700">2. CNEP (CGU)</div>
              <div className="text-[11px] text-slate-500">Lei Anticorrupção</div>
              <div className="mt-2 text-xs font-bold flex items-center gap-1.5">
                {currentAnalysis.has_cnep ? (
                  <span className="text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Registro Ativo
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nada Consta
                  </span>
                )}
              </div>
            </div>

            {/* Card Trabalho Escravo MTE */}
            <div className={`p-4 rounded-xl border ${currentAnalysis.has_slave_labor ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-xs font-bold text-slate-700">3. Trabalho Escravo</div>
              <div className="text-[11px] text-slate-500">Lista Suja MTE</div>
              <div className="mt-2 text-xs font-bold flex items-center gap-1.5">
                {currentAnalysis.has_slave_labor ? (
                  <span className="text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Consta na Lista
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Regular (Livre)
                  </span>
                )}
              </div>
            </div>

            {/* Card PEP Sócios */}
            <div className={`p-4 rounded-xl border ${currentAnalysis.has_pep ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-xs font-bold text-slate-700">4. PEP (Sócios)</div>
              <div className="text-[11px] text-slate-500">Expostos Politicamente</div>
              <div className="mt-2 text-xs font-bold flex items-center gap-1.5">
                {currentAnalysis.has_pep ? (
                  <span className="text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sócio Identificado
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Não Consta
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quadro de Sócios (QSA) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Quadro de Sócios e Administradores (BrasilAPI / CGU PEP)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentAnalysis.details.qsa.map((socio, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{socio.nome}</div>
                    <div className="text-[11px] text-slate-500">{socio.qual}</div>
                  </div>
                  {socio.is_pep ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      PEP Detectado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      Regular
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Histórico Recente de Fornecedores Auditados */}
      {recentAnalyses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Fornecedores Auditados Recentemente
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {recentAnalyses.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900">{rec.supplier?.legal_name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    CNPJ: {formatCNPJ(rec.supplier?.cnpj || "")}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.risk_status === "APROVADO"
                        ? "bg-emerald-100 text-emerald-800"
                        : rec.risk_status === "ALERTA"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rec.risk_status}
                  </span>

                  <button
                    onClick={() => handleDownloadPDF(rec)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                    title="Baixar Relatório PDF"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
