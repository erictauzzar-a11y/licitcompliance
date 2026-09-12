"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Smartphone,
  Eye,
  Lock,
  Download,
  Building2,
  Info,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ } from "@/lib/utils";
import QRCode from "qrcode";
import { generateWhistleblowerPosterPDF } from "@/lib/whistleblower-poster-service";

export default function CompartilharProgramaPage() {
  const company = mockStore.getCompany();
  const policy = mockStore.getPolicy();
  const metrics = mockStore.getComplianceMetrics();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<{ title: string; url: string; qrDataUrl: string } | null>(null);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://licitcompliance.vercel.app";

  const publicResources = [
    {
      id: "canal",
      title: "Canal de Denúncias Oficial",
      description: "Link seguro para manifestações de colaboradores e terceiros sobre desvios éticos, fraudes e assédio.",
      url: `${origin}/canal/${company.slug}`,
      icon: AlertTriangle,
      color: "red",
      badge: "NR-1 & Lei 14.133",
      actionText: "Acessar Canal",
    },
    {
      id: "acompanhar",
      title: "Consulta de Protocolo de Denúncia",
      description: "Página para o denunciante verificar o andamento da apuração via protocolo e chave sigilosa.",
      url: `${origin}/canal/${company.slug}/acompanhar`,
      icon: Lock,
      color: "amber",
      badge: "Sigilo & Não Retaliação",
      actionText: "Acompanhar",
    },
    {
      id: "treinar",
      title: "Link de Treinamento Rápido (WhatsApp)",
      description: "Link direto para capacitação mobile da equipe em microlearning, sem exigência de pré-cadastro.",
      url: `${origin}/treinar/${company.slug}`,
      icon: Smartphone,
      color: "emerald",
      badge: "Capacitação Contínua",
      actionText: "Ver Fluxo Mobile",
    },
    {
      id: "validar",
      title: "Autenticação Pública de Dossiê & Certificados",
      description: "Serviço público de verificação de autenticidade documental por Pregoeiros e Comissões de Licitação.",
      url: `${origin}/validar/DOSSIE-${new Date().getFullYear()}-${company.cnpj.substring(0, 8)}`,
      icon: ShieldCheck,
      color: "blue",
      badge: "Fiscais & Pregoeiros",
      actionText: "Validar Dossiê",
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenQrModal = async (title: string, url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      setActiveQrModal({ title, url, qrDataUrl });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPoster = async () => {
    try {
      setGeneratingPoster(true);
      await generateWhistleblowerPosterPDF(company, `${origin}/canal/${company.slug}`);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPoster(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* 1. Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Compartilhar Programa & Recursos Públicos
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Share2 className="w-3.5 h-3.5" />
              Recursos Oficiais
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralize, copie e compartilhe os links oficiais do Programa de Integridade da <strong>{company.trade_name}</strong> com colaboradores, pregoeiros e fornecedores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPoster}
            disabled={generatingPoster}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {generatingPoster ? "Gerando Cartaz..." : "Baixar Cartaz Mural (PDF)"}
          </button>
        </div>
      </div>

      {/* 2. Banner de Status dos Canais Públicos */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Canais Integrados e Monitorados em Tempo Real</h2>
            <p className="text-xs text-slate-300">
              Todas as manifestações, aceites e certificações realizadas através destes links alimentam diretamente a Central de Controle e o Dossiê de Integridade da empresa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Canal de Denúncias</span>
            <strong className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ativo e Monitorado
            </strong>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Código de Conduta</span>
            <strong className="text-xs text-white block mt-0.5 font-mono">v{policy.version} Vigente</strong>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Adesão Registrada</span>
            <strong className="text-xs text-blue-300 block mt-0.5">{metrics.policyRate}% da Equipe</strong>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Dossiê Probatório</span>
            <strong className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Auditável por QR Code
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Cards dos Recursos Públicos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {publicResources.map((res) => {
          const Icon = res.icon;
          const isCopied = copiedKey === res.id;

          return (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{res.title}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {res.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 break-all select-all flex items-center justify-between gap-2">
                  <span className="truncate">{res.url}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCopy(res.id, res.url)}
                  className="flex-1 min-w-[120px] py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenQrModal(res.title, res.url)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Gerar QR Code para impressão"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>

                <Link
                  href={res.url}
                  target="_blank"
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>{res.actionText}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Caixa Especial: Código de Conduta Público para Pregoeiros */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Visualização do Código de Conduta Vigente</h3>
              <p className="text-xs text-slate-500">
                O Código formal da organização aprovado e vigente (v{policy.version}) pronto para conferência e anexação probatória.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPolicyModal(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Visualizar Código na Íntegra
            </button>
            <Link
              href="/dashboard/politicas"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              Gerenciar Políticas →
            </Link>
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {activeQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">{activeQrModal.title}</h3>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-center">
              <img src={activeQrModal.qrDataUrl} alt="QR Code" className="w-56 h-56 rounded-lg shadow-2xs" />
            </div>

            <div className="text-[11px] text-slate-500 font-mono break-all bg-slate-50 p-2 rounded-lg">
              {activeQrModal.url}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopy("modal_qr", activeQrModal.url)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {copiedKey === "modal_qr" ? "Copiado!" : "Copiar Link"}
              </button>
              <button
                onClick={() => setActiveQrModal(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Código de Conduta Completo */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{policy.title}</h3>
                  <span className="text-[11px] text-slate-500">Versão {policy.version} • {company.legal_name}</span>
                </div>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs leading-relaxed text-slate-800 whitespace-pre-line space-y-4">
              {policy.content}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
