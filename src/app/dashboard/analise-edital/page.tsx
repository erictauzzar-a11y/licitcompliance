"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileSearch,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Scale,
  FileText,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Info,
  Sparkles,
  Download,
  BookOpen
} from "lucide-react";
import { analyzeEdictRequirements } from "@/lib/compliance-engine";
import { TenderAnalysisResult, TenderRequirementMatch } from "@/types/compliance";
import { generateDossierPDF } from "@/lib/pdf-generator";

const SAMPLE_EDICT_TEXT = `EDITAL DE PREGÃO ELETRÔNICO Nº 42/2026
ÓRGÃO: TRIBUNAL REGIONAL FEDERAL - 1ª REGIÃO
OBJETO: Contratação de serviços continuados de logística e transporte rodoviário de cargas.

CLÁUSULA 9 - DA HABILITAÇÃO E DO PROGRAMA DE INTEGRIDADE
9.1. Em observância ao Artigo 25, § 4º da Lei Federal nº 14.133/2021 e ao Decreto Federal nº 11.129/2022, a licitante vencedora deverá comprovar a existência e efetiva aplicação de Programa de Integridade (Compliance).
9.2. A comprovação documental deverá conter:
    a) Código de Conduta e Ética formalmente instituído e divulgado aos empregados;
    b) Ações comprovadas de treinamento periódico em integridade licitatória e prevenção a ilícitos contra a Administração Pública;
    c) Canal de denúncias ativo com garantia de sigilo e não retaliação ao denunciante, em observância à NR-1 e Lei nº 14.457/2022;
    d) Procedimentos de integridade e diligência prévia (due diligence) relativos a fornecedores e subcontratados, visando impedir a atuação de empresas sancionadas no CEIS/CNEP.
9.3. Os documentos comprobatórios deverão ser anexados no sistema no momento da habilitação técnica.`;

export default function TenderAnalysisPage() {
  const [edictText, setEdictText] = useState(SAMPLE_EDICT_TEXT);
  const [fileName, setFileName] = useState("Edital_Pregao_TRF_42_2026.pdf");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TenderAnalysisResult | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleAnalyze = () => {
    if (!edictText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeEdictRequirements(edictText, fileName);
      setAnalysisResult(res);
      setAnalyzing(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // Simulação de extração de texto de PDF de edital
      setEdictText(
        `EDITAL IDENTIFICADO: ${file.name}\nCLÁUSULA DE INTEGRIDADE:\nA contratada deverá apresentar comprovação formal de atendimento às exigências do Art. 25, § 4º da Lei nº 14.133/2021 (Programa de Integridade) e NR-1 (Canal de denúncias e combate ao assédio - Lei 14.457/2022). O envio do dossiê comprobatório é indispensável na fase de habilitação técnica.`
      );
    }
  };

  const getMatchBadge = (match: TenderRequirementMatch) => {
    switch (match) {
      case "ATENDIDO":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Atendido
          </span>
        );
      case "PRECISA_COMPLEMENTAR":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Precisa Complementar
          </span>
        );
      case "AUSENTE":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Ausente
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Não Identificado
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* Top Banner Explicativo */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Inteligência de Confronto Documental
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Analisar Edital de Licitação
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Faça upload do edital em PDF ou cole o texto do termo de referência para identificar automaticamente exigências de Programa de Integridade (Lei nº 14.133/2021 e NR-1) e cruzá-las em segundos com o acervo probatório da sua empresa.
          </p>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Aviso Legal de Responsabilidade:</strong> A análise apresentada tem caráter puramente técnico-operacional de auxílio na organização de evidências. O sistema não garante habilitação jurídica no certame nem substitui o julgamento soberano da Comissão de Licitação e pareceres jurídicos da empresa.
            </span>
          </div>
        </div>
      </div>

      {/* ÁREA DE ENTRADA: UPLOAD OU TEXTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload de Arquivo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Opção 1 • Documento Digital
            </span>
            <h2 className="text-sm font-bold text-slate-900 mt-1">
              Upload do Edital (PDF)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Envie o arquivo do edital completo ou a seção de habilitação jurídica.
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 flex flex-col items-center justify-center">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-bold text-slate-700">
              {fileName ? fileName : "Clique para selecionar o PDF"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              PDF, DOCX até 25MB
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <div className="text-[11px] text-slate-500 text-center">
            Arquivo atual selecionado: <strong className="text-slate-800">{fileName}</strong>
          </div>
        </div>

        {/* Textarea para Colar Texto */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Opção 2 • Trecho do Edital
                </span>
                <h2 className="text-sm font-bold text-slate-900 mt-1">
                  Texto ou Cláusulas de Habilitação
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEdictText(SAMPLE_EDICT_TEXT)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Carregar Exemplo Real
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cole as cláusulas do edital que tratam de integridade, código de conduta, penalidades ou capacitação:
            </p>
          </div>

          <textarea
            rows={7}
            value={edictText}
            onChange={(e) => setEdictText(e.target.value)}
            placeholder="Cole aqui o texto do edital..."
            className="w-full text-xs font-mono p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
          />

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Extraindo Cláusulas e Confrontando Evidências...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                Analisar Edital & Cruzar Evidências da Empresa
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULTADOS DO CONFRONTO DOCUMENTAL */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Card Resumo do Diagnóstico do Edital */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Resultado do Confronto Documental
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {analysisResult.organName} • {analysisResult.tenderNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Análise baseada nas evidências auditadas cadastradas no LicitCompliance.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Aderência Documental
                  </span>
                  <strong className="text-2xl font-black text-emerald-600 font-mono">
                    {analysisResult.overallFitScore}%
                  </strong>
                </div>

                <button
                  onClick={async () => {
                    setGeneratingPdf(true);
                    await generateDossierPDF();
                    setGeneratingPdf(false);
                  }}
                  disabled={generatingPdf}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  {generatingPdf ? "Compilando..." : "Baixar Dossiê Completo (PDF)"}
                </button>
              </div>
            </div>

            {/* Metadados Extraídos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-medium block">Exigência de Integridade:</span>
                <strong className="text-slate-800 text-sm mt-0.5 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Identificada no Edital
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-medium block">Momento da Apresentação:</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">
                  {analysisResult.submissionMoment}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-medium block">Bases Normativas Citadas:</span>
                <strong className="text-slate-800 text-xs mt-0.5 block truncate">
                  {analysisResult.legalBasisMentioned.join(", ")}
                </strong>
              </div>
            </div>
          </div>

          {/* Tabela de Requisitos do Edital vs Evidências da Empresa */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                Confronto: Requisitos do Edital vs. Evidências da Empresa
              </h4>
              <p className="text-xs text-slate-500">
                Detalhamento item por item com os documentos que respaldam cada exigência do pregão.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {analysisResult.requirements.map((req) => (
                <div key={req.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-xs font-semibold text-blue-700">
                          {req.legal_basis}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{req.title}</h5>
                    </div>

                    <div className="shrink-0">{getMatchBadge(req.match)}</div>
                  </div>

                  {/* Citação do Edital */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Texto / Cláusula no Edital:
                    </span>
                    <p className="italic text-slate-800 font-serif">"{req.edict_quote}"</p>
                  </div>

                  {/* Justificativa e Evidências Vinculadas */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="text-slate-700 leading-relaxed">
                      <strong>Análise do Sistema:</strong> {req.justification}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">
                        Evidências Vinculadas no Dossiê:
                      </span>
                      {req.matching_evidences.map((ev, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md"
                        >
                          <FileText className="w-3 h-3 text-blue-500" />
                          {ev}
                        </span>
                      ))}
                    </div>

                    {req.action_plan && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Ação antes do envio: {req.action_plan}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
