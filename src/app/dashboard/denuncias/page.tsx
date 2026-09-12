"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Filter,
  Eye,
  Copy,
  Download,
  QrCode,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Paperclip,
  Building2,
  FileCheck,
  X
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { WhistleblowerReport, ReportStatus, Company } from "@/types";
import { updateReportResolutionAction } from "@/app/actions/whistleblower";
import { generateWhistleblowerPosterPDF } from "@/lib/whistleblower-poster-service";

export default function WhistleblowerManagementPage() {
  const [company, setCompany] = useState<Company>(mockStore.getCompany());
  const [reports, setReports] = useState<WhistleblowerReport[]>(
    mockStore.getReports(company.id)
  );
  const [selectedReport, setSelectedReport] = useState<WhistleblowerReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("RECEBIDA");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const channelUrl = typeof window !== "undefined"
    ? `${window.location.origin}/canal/${company.slug}`
    : `http://localhost:3001/canal/${company.slug}`;

  const copyChannelLink = () => {
    navigator.clipboard.writeText(channelUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPoster = async () => {
    try {
      setGeneratingPdf(true);
      await generateWhistleblowerPosterPDF(company, channelUrl);
    } catch (err) {
      console.error("Erro ao gerar PDF do cartaz:", err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const openReportModal = (report: WhistleblowerReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setResolutionNotes(report.resolution_notes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setUpdatingStatus(true);
    await updateReportResolutionAction(selectedReport.id, newStatus, resolutionNotes);
    setReports([...mockStore.getReports(company.id)]);
    setSelectedReport(null);
    setUpdatingStatus(false);
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === "TODOS") return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "RECEBIDA":
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px]">
            Recebida
          </span>
        );
      case "EM_ANALISE":
        return (
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[10px]">
            Em Análise / Apuração
          </span>
        );
      case "PROCEDENTE":
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
            Concluída / Procedente
          </span>
        );
      case "IMPROCEDENTE":
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold text-[10px]">
            Concluída / Não Procedente
          </span>
        );
      case "ARQUIVADA":
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full font-bold text-[10px]">
            Arquivada
          </span>
        );
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ASSEDIO_MORAL_SEXUAL":
        return "Assédio Moral ou Sexual (NR-1)";
      case "CORRUPCAO_SUBORNO":
        return "Corrupção ou Propina (Lei 14.133)";
      case "FRAUDE_LICITACAO":
        return "Fraude em Licitação/Contrato";
      case "SEGURANCA_TRABALHO":
        return "Segurança do Trabalho / EPI";
      default:
        return "Outros";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* 1. CARD EM DESTAQUE: SEU LINK OFICIAL DO CANAL DE DENÚNCIAS */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[11px] uppercase tracking-wider border border-blue-400/30">
              <Lock className="w-3 h-3" />
              Canal de Denúncias Exclusivo da Empresa (NR-1 / Lei 14.133)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Seu Link Oficial do Canal de Denúncias
            </h2>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Disponibilize este endereço eletrônico aos colaboradores, terceirizados e parceiros comerciais. A apuração é garantida sob estrito sigilo e isolamento de dados do tenant.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="font-mono text-xs text-blue-200 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 select-all truncate max-w-xs sm:max-w-md">
                {channelUrl}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={copyChannelLink}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
            </button>

            <button
              onClick={handleDownloadPoster}
              disabled={generatingPdf}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{generatingPdf ? "Gerando Cartaz..." : "Baixar QR Code em PDF"}</span>
            </button>

            <Link
              href={`/canal/${company.slug}`}
              target="_blank"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Abrir Canal em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Header da Gestão Interna */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Ocorrências e Deliberações da Comissão</h1>
            <span className="p-1 rounded bg-red-100 text-red-700 font-bold text-[10px] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Acesso Restrito ao Tenant ({company.slug})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Triagem, análise fática e registro de parecer oficial acessível ao manifestante por protocolo.
          </p>
        </div>

        {/* Filtro de Status */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-medium focus:outline-none text-slate-700"
          >
            <option value="TODOS">Todos os Status ({reports.length})</option>
            <option value="RECEBIDA">Recebidas</option>
            <option value="EM_ANALISE">Em Análise / Apuração</option>
            <option value="PROCEDENTE">Procedentes</option>
            <option value="IMPROCEDENTE">Improcedentes</option>
            <option value="ARQUIVADA">Arquivadas</option>
          </select>
        </div>
      </div>

      {/* Lista de Denúncias da Empresa */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Tipo (Origem)</th>
                <th className="py-3 px-4">Data Recebimento</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhuma ocorrência registrada com o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {report.protocol}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {getCategoryLabel(report.category)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {report.is_anonymous ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-400" />
                          Modo Anônimo
                        </span>
                      ) : (
                        <div>
                          <div className="font-semibold text-slate-900">{report.reporter_name}</div>
                          <div className="text-[10px] text-slate-400">{report.reporter_contact}</div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(report.created_at).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(report.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(report.status)}</td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openReportModal(report)}
                        className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Analisar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer de Análise e Parecer */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">
                  Tratativa Confidencial da Comissão de Integridade
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  Protocolo Oficial {selectedReport.protocol}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 text-xs border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Categoria</span>
                  <strong className="text-slate-800">
                    {getCategoryLabel(selectedReport.category)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Identificação do Relator</span>
                  <strong className="text-slate-800">
                    {selectedReport.is_anonymous
                      ? "100% Anônimo (Sem IP / Sem rastros)"
                      : `${selectedReport.reporter_name} (${selectedReport.reporter_contact})`}
                  </strong>
                </div>
              </div>

              {/* Relato dos Fatos */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Relato dos Fatos Registrado
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {selectedReport.description}
                </div>
              </div>

              {/* Anexos / Evidências se houver */}
              {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    Anexos / Evidências Encaminhadas ({selectedReport.evidence_urls.length})
                  </label>
                  <div className="space-y-1">
                    {selectedReport.evidence_urls.map((url, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-xs text-slate-800 font-mono"
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                          {url.replace(`${company.slug}/`, "")}
                        </span>
                        <span className="text-[10px] text-blue-600 font-bold">Armazenamento Seguro</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulário de Parecer e Resposta Oficial */}
              <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700 tracking-wider block">
                    Atualizar Status da Apuração
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="RECEBIDA">RECEBIDA (Em Triagem Inicial)</option>
                    <option value="EM_ANALISE">
                      EM ANÁLISE / APURAÇÃO (Comissão Instaurada / Escuta de Partes)
                    </option>
                    <option value="PROCEDENTE">
                      CONCLUÍDA / PROCEDENTE (Infração Confirmada - Medidas Disciplinares Adotadas)
                    </option>
                    <option value="IMPROCEDENTE">
                      CONCLUÍDA / NÃO PROCEDENTE (Relato Infundado ou Sem Indícios Mínimos)
                    </option>
                    <option value="ARQUIVADA">ARQUIVADA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700 tracking-wider block">
                    Resposta Oficial da Comissão ao Denunciante (Visível na consulta pelo protocolo)
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Descreva com cuidado as deliberações e medidas tomadas sem expor a identidade das testemunhas..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    O manifestante poderá ler este parecer ao digitar o Protocolo e a Chave de Acesso no link público.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white text-xs font-bold shadow-sm"
                  >
                    {updatingStatus ? "Salvando..." : "Salvar Deliberação & Notificar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
