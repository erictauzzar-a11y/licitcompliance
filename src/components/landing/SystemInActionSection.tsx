"use client";

import { useState, useEffect } from "react";
import {
  Gauge,
  FileCheck2,
  Search,
  FileDown,
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  QrCode,
  Building2,
  Check,
} from "lucide-react";

export function SystemInActionSection() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Tabs solicitadas: "Diagnóstico", "Evidências", "Análise de Edital", "Dossiê"
  const tabs = [
    { id: 0, label: "Diagnóstico", icon: Gauge, desc: "Análise contínua de requisitos" },
    { id: 1, label: "Evidências", icon: FileCheck2, desc: "Associação e validação documental" },
    { id: 2, label: "Análise de Edital", icon: Search, desc: "IA identificando exigências" },
    { id: 3, label: "Dossiê", icon: FileDown, desc: "Compilação pronta para apresentação" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => ((prev + 1) % 4) as any);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/80 border-t border-b border-slate-800 relative overflow-hidden">
      {/* Luz ambiente */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>SISTEMA EM AÇÃO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Veja o TechCompliance trabalhando
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Do diagnóstico à organização das evidências, tudo em um único ambiente.
          </p>
        </div>

        {/* Barra de Controles / Tabs Interativas */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-4xl mx-auto backdrop-blur-md shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.01]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              title={isPlaying ? "Pausar troca automática" : "Continuar reprodução"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Auto</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Play</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display do Sistema em Ação (Mockup Realista de Software) */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10">
          {/* Header da Janela */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>app.techcompliance.com.br/{tabs[activeTab].label.toLowerCase().replace(/ /g, "-")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                Simulação Visual
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Ambiente Operacional Ativo</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Conteúdo Dinâmico por Aba */}
          <div className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-center bg-gradient-to-b from-slate-950 to-slate-900/90 text-white">
            {/* 1. DIAGNÓSTICO & PENDÊNCIA */}
            {activeTab === 0 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Mapeamento de Requisitos e Conformidade</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Lei 14.133
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Identificação automática de requisitos normativos aplicáveis e verificação de pendências.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-300">Maturidade:</span>
                    <span className="text-sm font-black text-blue-400">61%</span>
                    <span className="text-[10px] text-slate-400 font-medium">(14 atendidos)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Código de Ética e Conduta Formalizado</div>
                        <div className="text-[11px] text-slate-400">Documento vigente com aprovação da diretoria executiva</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Estruturado
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-center justify-between gap-4 animate-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-200">Pendência Identificada: Canal de Denúncias</div>
                        <div className="text-[11px] text-slate-400">Falta evidência de canal externo e garantia de anonimato para terceiros</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                      Ação Necessária
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Treinamento Periódico de Colaboradores</div>
                        <div className="text-[11px] text-slate-400">Próximo ciclo programado • Lista de presença vinculada</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
                      Em Andamento
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EVIDÊNCIAS & DOCUMENTO ASSOCIADO */}
            {activeTab === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Repositório Seguro de Evidências</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Criptografia Ativa
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Associação de arquivos comprobatórios com hash SHA-256 e validação de autenticidade.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                    33 Evidências Ativas
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          Ata_Treinamento_Integridade_2026.pdf
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Hash SHA-256: 4f8b9e...d81a92c3 • Assinado digitalmente
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      Associado ao Requisito
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="font-semibold text-blue-300">Vínculo Normativo:</div>
                    <div>Atende ao pilar de Treinamento Contínuo e Comunicação da Lei 14.133/2021 e Decreto 12.304/2024.</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ANÁLISE DE EDITAL & IA */}
            {activeTab === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Análise Inteligente de Editais</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        Motor de Extração
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      O sistema lê o edital e localiza cláusulas relacionadas a Programa de Integridade e critérios de desempate.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      Cláusula Extraída do Edital
                    </div>
                    <blockquote className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 italic">
                      &quot;Item 14.2 — O licitante vencedor em contratação de grande vulto deverá comprovar a implantação de Programa de Integridade no prazo legal.&quot;
                    </blockquote>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confronto com sua Estrutura
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-emerald-300 font-semibold">✓ 4 de 5 exigências já atendidas</div>
                      <div className="text-slate-400 text-[11px]">Evidências prontas para compilação no dossiê de proposta.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DOSSIÊ ORGANIZADO */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Dossiê Probatório de Integridade</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        Exportação Oficial
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Documento organizado com sumário executivo, metadados e validação pública.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      <FileDown className="w-4 h-4 text-blue-400" />
                      <span>Dossiê de Integridade — Edição 2026</span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      Contém: Código de Ética, Relatório do Canal, Treinamentos, Due Diligence e Declaração de Conformidade com QR Code.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
                    <div className="p-2 bg-white rounded-lg">
                      <QrCode className="w-8 h-8 text-slate-950" />
                    </div>
                    <div className="text-left text-[10px]">
                      <div className="font-bold text-white">Validação Pública</div>
                      <div className="text-slate-400">techcompliance.com.br/v/...</div>
                      <div className="text-emerald-400 font-semibold mt-0.5">Autenticidade Garantida</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
