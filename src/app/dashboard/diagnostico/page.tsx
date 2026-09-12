"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck,
  ChevronRight,
  Filter,
  ExternalLink,
  Layers,
  BookOpen,
  Users,
  AlertCircle,
  HelpCircle,
  Info,
  X,
  Search,
  Scale
} from "lucide-react";
import { evaluateCompanyCompliance } from "@/lib/compliance-engine";
import {
  ComplianceDiagnostic,
  ComplianceRequirement,
  PillarCategory,
  RequirementStatus,
} from "@/types/compliance";
import { generateDossierPDF } from "@/lib/pdf-generator";

export default function ProgramDiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState<ComplianceDiagnostic>(() =>
    evaluateCompanyCompliance()
  );
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory | "TODOS">("TODOS");
  const [selectedStatus, setSelectedStatus] = useState<RequirementStatus | "TODOS">("TODOS");
  const [activeReqModal, setActiveReqModal] = useState<ComplianceRequirement | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDownloadDossier = async () => {
    try {
      setGeneratingPdf(true);
      await generateDossierPDF();
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const filteredRequirements = diagnostic.requirements.filter((req) => {
    if (selectedPillar !== "TODOS" && req.pillar !== selectedPillar) return false;
    if (selectedStatus !== "TODOS" && req.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: RequirementStatus) => {
    switch (status) {
      case "ATENDIDO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Atendido
          </span>
        );
      case "PARCIALMENTE_ATENDIDO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Parcialmente Atendido
          </span>
        );
      case "PENDENTE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Pendente
          </span>
        );
      case "EM_REVISAO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">
            Em Revisão
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 w-fit">
            Não Aplicável
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* 1. TOPO: SCORE DE PREPARAÇÃO / MATURIDADE DO PROGRAMA */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              Diagnóstico do Programa de Integridade
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Maturidade e Evidenciação do Programa
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mapeamento contínuo dos requisitos da Lei Federal nº 14.133/2021 e da NR-1 / Lei nº 14.457/2022, vinculando cada obrigação às evidências auditáveis registradas na plataforma.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Nota Explicativa:</strong> Este indicador reflete o nível de estruturação e completude documental interna do programa na plataforma, não constituindo certificação oficial nem parecer de órgão público.
              </span>
            </div>
          </div>

          {/* Medidor Circular / Score */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Status de Preparação
              </span>
              <div className="text-5xl font-black text-emerald-400 my-1 font-mono">
                {diagnostic.overall_score}%
              </div>
              <span className="text-xs font-semibold text-emerald-300">
                Estruturação Avançada
              </span>
            </div>

            <button
              onClick={handleDownloadDossier}
              disabled={generatingPdf}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              {generatingPdf ? "Compilando..." : "Gerar Dossiê de Evidências (PDF)"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO DE CONFORMIDADE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Requisitos Atendidos
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {diagnostic.met_count}
            <span className="text-xs text-slate-400 font-normal ml-1">/ {diagnostic.total_requirements}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Conformidade comprovada</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Pontos de Atenção
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2 font-mono">
            {diagnostic.partial_count}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requer complemento de adesão</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Pendências
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {diagnostic.pending_count}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sem evidências associadas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            Evidências Disponíveis
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-2 font-mono">
            {diagnostic.total_evidences}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Documentos, logs e relatórios</p>
        </div>
      </div>

      {/* 3. BARRAS DE MATURIDADE POR PILAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Estruturação por Pilar do Programa
          </h2>
          <p className="text-xs text-slate-500">
            Clique em qualquer pilar abaixo para filtrar os requisitos e documentos comprobatórios:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(diagnostic.pillars).map(([pKey, pData]) => {
            const isSelected = selectedPillar === pKey;
            return (
              <button
                key={pKey}
                onClick={() => setSelectedPillar(isSelected ? "TODOS" : (pKey as PillarCategory))}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{pData.label}</span>
                  <span className={`font-mono text-sm ${pData.score >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                    {pData.score}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pData.score >= 80 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${pData.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>{pData.met_requirements}/{pData.total_requirements} atendidos</span>
                  <span>{pData.evidence_count} evidências</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TABELA DO MOTOR DE CONFORMIDADE: REQUISITO -> SITUAÇÃO -> EVIDÊNCIA -> STATUS */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Quadro Geral de Requisitos e Evidências
            </h2>
            <p className="text-xs text-slate-500">
              Conexão entre exigência normativa, status de atendimento e comprovação documental.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todos os Pilares</option>
              <option value="CODIGO_CONDUTA">Código e Conduta</option>
              <option value="TREINAMENTOS">Treinamentos</option>
              <option value="CANAL_DENUNCIAS">Canal de Denúncias</option>
              <option value="GESTAO_TERCEIROS">Gestão de Terceiros</option>
              <option value="CONTROLES_INTERNOS">Controles Internos</option>
              <option value="MONITORAMENTO">Monitoramento</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATENDIDO">Atendido</option>
              <option value="PARCIALMENTE_ATENDIDO">Parcialmente Atendido</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              onClick={() => setActiveReqModal(req)}
              className="py-4 hover:bg-slate-50/70 cursor-pointer transition-colors rounded-xl px-3 group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700">
                      {req.legal_basis.norm} ({req.legal_basis.article})
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      • Responsável: {req.responsible}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {req.situation_summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {req.evidences.map((ev) => (
                      <span
                        key={ev.id}
                        className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium"
                      >
                        <FileText className="w-3 h-3 text-slate-400" />
                        {ev.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                  {getStatusBadge(req.status)}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MODAL DE DETALHAMENTO DO REQUISITO & EVIDÊNCIAS VINCULADAS */}
      {activeReqModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Fundamento Normativo Auditável
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  {activeReqModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReqModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Base Normativa */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">
                    {activeReqModal.legal_basis.norm} — {activeReqModal.legal_basis.article}
                  </strong>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeReqModal.legal_basis.type}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {activeReqModal.legal_basis.description}
                </p>
                {activeReqModal.legal_basis.paragraph && (
                  <p className="text-slate-500 italic text-[11px]">
                    {activeReqModal.legal_basis.paragraph}
                  </p>
                )}
              </div>

              {/* Por que está atendido / O que falta (Seção Explicativa Central) */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                  Por que este requisito possui este status?
                </span>
                
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    ✓ Evidências Identificadas no Sistema:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11px]">
                    {activeReqModal.why_status?.evidences_found?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    )) || <li>Evidências registradas nos módulos correspondentes.</li>}
                  </ul>
                </div>

                {activeReqModal.why_status?.what_is_missing && (
                  <div className="pt-2 border-t border-blue-200/60 text-amber-900">
                    <span className="text-[11px] font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      O que está faltando para atender plenamente:
                    </span>
                    <p className="text-[11px] mt-0.5 font-medium">
                      {activeReqModal.why_status.what_is_missing}
                    </p>
                  </div>
                )}
              </div>

              {/* Situação Atual */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Situação Atual Consolidada
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 leading-relaxed">
                  {activeReqModal.situation_summary}
                </div>
              </div>

              {/* Evidências Documentais */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Evidências Registradas na Plataforma ({activeReqModal.evidences.length})
                </span>
                <div className="space-y-2">
                  {activeReqModal.evidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          {ev.title}
                        </span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {ev.description}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                        <span>Origem: {ev.module_source || "Módulo da Plataforma"}</span>
                        <span>Registrado em: {new Date(ev.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plano de Ação se houver */}
              {activeReqModal.action_needed && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="block font-bold flex items-center gap-1 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Ação Recomendada para Complementação:
                    </strong>
                    {activeReqModal.action_href && (
                      <Link
                        href={activeReqModal.action_href}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] shadow-2xs"
                      >
                        Resolver Agora →
                      </Link>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {activeReqModal.action_needed}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                Última avaliação: {new Date(activeReqModal.updated_at).toLocaleDateString("pt-BR")}
              </span>
              <button
                onClick={() => setActiveReqModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
