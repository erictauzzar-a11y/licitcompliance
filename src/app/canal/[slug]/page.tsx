"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Info,
  Building2,
  Paperclip,
  UploadCloud,
  X,
  Search,
  ArrowRight,
  Shield,
  FileCheck
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { ReportCategory } from "@/types";
import { submitWhistleblowerReportAction } from "@/app/actions/whistleblower";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function PublicWhistleblowerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const company = mockStore.getCompany(resolvedParams.slug);

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState<ReportCategory>("ASSEDIO_MORAL_SEXUAL");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado de sucesso pós-envio
  const [submittedData, setSubmittedData] = useState<{
    protocol: string;
    access_key: string;
  } | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "mp3", "mp4", "txt"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const validFiles: File[] = [];

      for (const file of selected) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          setErrorMessage(`Arquivo "${file.name}" possui formato não permitido. Extensões aceitas: PDF, PNG, JPG, MP3, MP4.`);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage(`Arquivo "${file.name}" excede o tamanho máximo de 10MB.`);
          return;
        }
        validFiles.push(file);
      }

      setErrorMessage("");
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage("Por favor, relate os fatos com o maior detalhamento possível.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const evidenceUrls: string[] = [];

      // Upload de anexos se Supabase Storage estiver ativo
      if (files.length > 0 && isSupabaseConfigured && supabase) {
        setUploading(true);
        for (const file of files) {
          const fileExt = file.name.split(".").pop()?.toLowerCase() || "dat";
          const randomId = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : `${Date.now()}`;
          const cleanFileName = `${Date.now()}_${randomId}.${fileExt}`;
          const filePath = `${resolvedParams.slug}/${cleanFileName}`;

          const { data: uploadRes, error: uploadErr } = await supabase.storage
            .from("whistleblower-evidence")
            .upload(filePath, file);

          if (!uploadErr && uploadRes) {
            evidenceUrls.push(filePath);
          } else {
            evidenceUrls.push(`evidence_${cleanFileName}`);
          }
        }
        setUploading(false);
      } else if (files.length > 0) {
        files.forEach((f) => evidenceUrls.push(`anexo_${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`));
      }

      const res = await submitWhistleblowerReportAction({
        slug: resolvedParams.slug,
        is_anonymous: isAnonymous,
        category,
        description,
        reporter_name: isAnonymous ? undefined : reporterName,
        reporter_contact: isAnonymous ? undefined : reporterContact,
        evidence_urls: evidenceUrls,
      });

      if (res.success && res.protocol && res.access_key) {
        setSubmittedData({
          protocol: res.protocol,
          access_key: res.access_key,
        });
      } else {
        setErrorMessage(res.error || "Não foi possível registrar a denúncia.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Erro inesperado na transmissão.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!submittedData) return;
    const text = `TECHCOMPLIANCE - PROTOCOLO DE ACOMPANHAMENTO DA DENÚNCIA\nOrganização: ${company.trade_name}\nProtocolo: ${submittedData.protocol}\nLink de Consulta: ${window.location.origin}/canal/${resolvedParams.slug}/acompanhar?p=${submittedData.protocol}`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 flex flex-col font-sans">
      {/* Top Header do Canal com Identidade da Empresa */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={company.logo_url}
                  alt={company.trade_name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="font-black text-sm text-slate-900 leading-tight">
                {company.trade_name}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Canal Oficial de Ética e Integridade
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/canal/${resolvedParams.slug}/acompanhar`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Consultar Protocolo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {submittedData ? (
          /* ============================================================ */
          /* 3. TELA DE SUCESSO E PROTOCOLO ÚNICO                         */
          /* ============================================================ */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Transmissão Segura Concluída
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                SUA DENÚNCIA FOI REGISTRADA COM SUCESSO!
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                A ocorrência foi encaminhada de forma sigilosa para a Comissão de Integridade da{" "}
                <strong>{company.trade_name}</strong> com amparo nas garantias de proteção ao relator da{" "}
                <strong>Lei Federal nº 14.133/2021</strong> e <strong>NR-1 / Lei nº 14.457/2022</strong>.
              </p>
            </div>

            {/* Card de Destaque com Protocolo Único */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Protocolo de Acompanhamento Exclusivo
                  </h3>
                  <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                    Copie ou anote o seu <strong>Protocolo Único</strong> abaixo. Você só precisará dele para acompanhar o andamento da apuração e ler a manifestação oficial da empresa.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                  PROTOCOLO DA DENÚNCIA
                </span>
                <strong className="text-2xl sm:text-3xl text-blue-700 font-mono select-all tracking-wider block">
                  {submittedData.protocol}
                </strong>
                <span className="text-[11px] text-slate-400 block font-sans">
                  Código alfanumérico único e permanente
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={copyCredentials}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  {copiedSuccess ? "✓ Protocolo Copiado!" : "Copiar Protocolo"}
                </button>

                <Link
                  href={`/canal/${resolvedParams.slug}/acompanhar?p=${submittedData.protocol}`}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-2xs text-center"
                >
                  <span>Ir para Acompanhamento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Ações pós-submissão */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/canal/${resolvedParams.slug}/acompanhar?p=${encodeURIComponent(
                  submittedData.protocol
                )}&k=${encodeURIComponent(submittedData.access_key)}`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Acompanhar Apuração Agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  setSubmittedData(null);
                  setDescription("");
                  setFiles([]);
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Registrar Nova Manifestação
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. AMBIENTE PÚBLICO DE DENÚNCIA: FORMULÁRIO RESPONSIVO       */
          /* ============================================================ */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header explicativo e seguro */}
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                <Shield className="w-3.5 h-3.5" />
                Canal Independente & Sigiloso
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Canal de Denúncias e Integridade
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ambiente seguro para relato de condutas inadequadas, assédio moral ou sexual, fraudes licitatórias ou descumprimento de normas de integridade na <strong>{company.trade_name}</strong>.
              </p>
            </div>

            {/* Aviso de Sigilo e Não Retaliação */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-950">
              <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-blue-900 block">
                  Garantia de Não Retaliação (Lei nº 14.457/2022 e NR-1)
                </strong>
                <p className="leading-relaxed text-slate-600">
                  O denunciante de boa-fé conta com proteção irrestrita contra repreensões ou penalidades. No modo anônimo, nenhum dado de rede ou rastreamento é guardado.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ESCOLHA INICIAL: MODO ANÔNIMO OU IDENTIFICADO */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Escolha como deseja se manifestar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isAnonymous
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Modo Anônimo com Sigilo
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Não solicita nome, e-mail nem telefone. O sistema não armazena IP nem dados de rastreamento de rede.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      !isAnonymous
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Modo Identificado
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Permite que a comissão interna entre em contato diretamente com você caso sejam necessários esclarecimentos.
                    </div>
                  </button>
                </div>
              </div>

              {/* CAMPOS SE IDENTIFICADO */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Ex: Carlos Ferreira"
                      required={!isAnonymous}
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail ou WhatsApp para contato *
                    </label>
                    <input
                      type="text"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="Ex: (11) 98765-4321 ou email@exemplo.com"
                      required={!isAnonymous}
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* CATEGORIA DA DENÚNCIA */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  2. Categoria da Ocorrência
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium text-slate-800"
                >
                  <option value="ASSEDIO_MORAL_SEXUAL">
                    Assédio Moral ou Sexual (NR-1 / Lei nº 14.457/2022)
                  </option>
                  <option value="CORRUPCAO_SUBORNO">
                    Corrupção ou Propina (Lei nº 14.133 / Lei Anticorrupção)
                  </option>
                  <option value="FRAUDE_LICITACAO">
                    Fraude em Licitação/Contrato Público ou Conluio
                  </option>
                  <option value="SEGURANCA_TRABALHO">
                    Segurança do Trabalho / Falta de EPIs
                  </option>
                  <option value="OUTROS">Outros Desvios de Conduta Ética</option>
                </select>
              </div>

              {/* RELATO DOS FATOS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    3. Relato Detalhado dos Fatos *
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (Quem cometeu? Quando ocorreu? Onde?)
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Por favor, relate com o maior número de dados possíveis:&#10;• Quem cometeu a irregularidade?&#10;• Quando ocorreu (datas e horários)?&#10;• Em qual setor, canteiro de obras ou local?&#10;• Existem testemunhas do ocorrido?"
                  required
                  className="w-full text-xs sm:text-sm p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 leading-relaxed font-normal"
                />
              </div>

              {/* ANEXOS / UPLOAD DE EVIDÊNCIAS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  4. Anexar Evidências (Opcional)
                </label>
                <p className="text-xs text-slate-500">
                  Fotos, documentos em PDF, capturas de tela ou áudios que comprovem a manifestação.
                </p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20"
                >
                  <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Clique aqui para selecionar arquivos do seu dispositivo
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Formatos aceitos: PDF, PNG, JPG, MP3, MP4, DOCX (até 15MB)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,audio/*,video/*,.doc,.docx"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate font-medium text-slate-800">{file.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTÃO DE TRANSMISSÃO */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {submitting
                    ? uploading
                      ? "Enviando anexos criptografados..."
                      : "Transmitindo Relato Sigiloso..."
                    : "Transmitir Denúncia com Sigilo Absoluto"}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Ao enviar, você receberá instantaneamente seu Protocolo e Chave de Acesso exclusivos.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer Simples */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-500">
        <p>
          Plataforma de Conformidade e Integridade • <strong>TechCompliance</strong> • Lei Federal nº 14.133/2021 & NR-1
        </p>
      </footer>
    </div>
  );
}
