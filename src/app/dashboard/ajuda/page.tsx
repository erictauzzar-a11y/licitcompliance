"use client";

import { useState } from "react";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileQuestion,
  LifeBuoy,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AjudaDashboardPage() {
  const supportEmail = "suportegrupodigitalajuda@gmail.com";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqItems = [
    {
      q: "Como emitir o Dossiê Probatório para apresentar em licitações?",
      a: "Acesse a Visão Geral do Dashboard e clique no botão 'Emitir Dossiê Probatório (PDF)'. O documento é gerado instantaneamente com QR Code de autenticação pública e hash criptográfico SHA-256.",
    },
    {
      q: "Como meus colaboradores realizam o treinamento obrigatório de combate ao assédio (NR-1)?",
      a: "No menu 'Compartilhar Programa', copie o link do Treinamento Rápido da sua empresa. Os colaboradores podem acessar pelo WhatsApp ou celular, sem precisar criar conta ou senha.",
    },
    {
      q: "Como funciona a Due Diligence Automática de parceiros e sócios?",
      a: "No módulo 'Due Diligence (DDI)', insira o CNPJ do parceiro ou subcontratado. O sistema consulta automaticamente bases da Receita Federal, CEIS e CNEP, gerando relatório de conformidade com parecer de risco.",
    },
    {
      q: "Como gerenciar os relatos recebidos pelo Canal de Denúncias?",
      a: "No menu 'Canal de Denúncias', você tem acesso a todos os protocolos sigilosos recebidos. Cada denúncia conta com chave de acesso criptografada para interação segura com o relator.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Header da Página de Ajuda */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <LifeBuoy className="w-4 h-4 text-blue-400" />
            Central de Ajuda & Suporte Técnico Especializado
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Como podemos te ajudar hoje?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Estamos à disposição para esclarecer dúvidas sobre funcionalidades da plataforma, emissão de dossiês probatórios e suporte técnico para sua equipe.
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-blue-500/30 shrink-0 text-center space-y-1">
          <div className="text-[11px] uppercase font-bold text-slate-400">Tempo Médio de Resposta</div>
          <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Até 24h úteis</span>
          </div>
          <div className="text-[10px] text-slate-500">Atendimento de Segunda a Sexta</div>
        </div>
      </div>

      {/* Card Principal de Contato com Email Oficial */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Canal Oficial de Atendimento</span>
            <h2 className="text-xl font-bold text-slate-900">Suporte Direto por E-mail</h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Para solicitações de auxílio na plataforma, dúvidas sobre requisitos da Lei nº 14.133/2021, ajustes de cadastro ou envio de dúvidas técnicas, entre em contato diretamente com a nossa equipe de suporte pelo e-mail:
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex-1 flex items-center gap-3 font-mono text-sm font-bold text-slate-800 select-all px-2 break-all">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{supportEmail}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar E-mail</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${supportEmail}?subject=Suporte%20TechCompliance%20-%20D%C3%BAvida%20ou%20Solicita%C3%A7%C3%A3o`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              <Mail className="w-4 h-4" />
              <span>Escrever E-mail Agora</span>
            </a>
          </div>
        </div>
      </div>

      {/* Dúvidas Frequentes da Operação do SaaS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Perguntas Rápidas sobre a Plataforma</h3>
            <p className="text-xs text-slate-500">Orientações imediatas para o seu dia a dia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-start gap-2">
                <span className="text-blue-600 shrink-0">#{idx + 1}</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
