"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, AlertTriangle, ArrowLeft, CheckCircle2, Copy, FileText, Info } from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { ReportCategory } from "@/types";

export default function WhistleblowerReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const company = mockStore.getCompany(resolvedParams.slug);

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState<ReportCategory>("ASSEDIO_MORAL_SEXUAL");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Estado de sucesso
  const [submittedReport, setSubmittedReport] = useState<{ protocol: string; access_key: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const newReport = mockStore.createReport({
        category,
        description,
        is_anonymous: isAnonymous,
        reporter_name: isAnonymous ? undefined : reporterName,
        reporter_contact: isAnonymous ? undefined : reporterContact,
      });

      setSubmittedReport({
        protocol: newReport.protocol,
        access_key: newReport.access_key,
      });
      setSubmitting(false);
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            Canal 100% Criptografado & Protegido
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {submittedReport ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Relato Registrado com Sucesso!</h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Sua manifestação foi encaminhada para análise da Comissão de Ética da <strong>{company.trade_name}</strong> com garantia de sigilo e proteção contra retaliação nos termos da Lei Federal nº 14.457/2022.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left max-w-lg mx-auto space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Guarde estes dados para acompanhar o andamento:
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <span className="text-xs text-slate-500 font-medium block">Protocolo Oficial</span>
                  <strong className="text-base text-slate-900 font-mono select-all">
                    {submittedReport.protocol}
                  </strong>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <span className="text-xs text-slate-500 font-medium block">Chave de Acesso</span>
                  <strong className="text-base text-blue-700 font-mono select-all">
                    {submittedReport.access_key}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(`Protocolo: ${submittedReport.protocol} | Chave: ${submittedReport.access_key}`)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedKey ? "Copiado com Sucesso!" : "Copiar Protocolo e Chave"}
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/portal/${resolvedParams.slug}/protocolo?p=${encodeURIComponent(submittedReport.protocol)}&k=${encodeURIComponent(submittedReport.access_key)}`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Acompanhar Status Agora
              </Link>
              <Link
                href={`/portal/${resolvedParams.slug}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Retornar ao Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
                <AlertTriangle className="w-4 h-4" />
                Canal Confidencial de Manifestações
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Registrar Denúncia ou Irregularidade
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Este canal foi estruturado conforme os requisitos da <strong>Lei nº 14.133/2021</strong> e <strong>NR-1 / Lei nº 14.457/2022</strong>. O sigilo do relato e a proteção contra qualquer tipo de represália são direitos fundamentais assegurados.
              </p>
            </div>

            {/* Banner de Anonimato */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">Garantia de Não Retaliação e Sigilo</p>
                <p>
                  Você pode optar por não se identificar. Mesmo que decida informar seu nome e contato, eles permanecerão estritamente restritos à comissão apuradora.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Opção de Identificação */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Modo de Identificação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isAnonymous
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Anônimo (Recomendado)
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Nenhum dado pessoal seu será solicitado ou armazenado.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      !isAnonymous
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Identificado
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Permite que a comissão entre em contato para esclarecimentos.
                    </div>
                  </button>
                </div>
              </div>

              {/* Campos do Denunciante se Identificado */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      required={!isAnonymous}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / WhatsApp ou E-mail
                    </label>
                    <input
                      type="text"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="Ex: (11) 99999-9999"
                      required={!isAnonymous}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Categoria da Ocorrência */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  2. Categoria da Infração
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="ASSEDIO_MORAL_SEXUAL">Assédio Moral, Sexual ou Discriminação (NR-1 / Lei 14.457)</option>
                  <option value="CORRUPCAO_SUBORNO">Corrupção, Propina ou Pedido de Vantagem Indevida</option>
                  <option value="FRAUDE_LICITACAO">Fraude em Licitação, Conluio de Preços ou Entrega Incorreta (Lei 14.133)</option>
                  <option value="SEGURANCA_TRABALHO">Insegurança no Trabalho ou Falta de EPIs</option>
                  <option value="OUTROS">Outras Violações ao Código de Conduta</option>
                </select>
              </div>

              {/* Relato dos Fatos */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  3. Relato Detalhado dos Fatos
                </label>
                <p className="text-xs text-slate-500">
                  Descreva o que aconteceu, datas aproximadas, locais, pessoas envolvidas e possíveis testemunhas:
                </p>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Relate com a maior clareza de detalhes possível..."
                  required
                  className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {submitting ? "Transmitindo com Segurança..." : "Enviar Denúncia com Criptografia"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
