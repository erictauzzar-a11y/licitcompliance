"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck2,
  Search,
  UploadCloud,
  FileDown,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  Lock,
  Layers,
  Check,
  Clock,
  Building2,
} from "lucide-react";

export function HeroInteractiveSimulator() {
  // 5 Cenas: 0: DIAGNOSTICO, 1: PENDENCIAS, 2: EVIDENCIAS, 3: EDITAL, 4: DOSSIE
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Estados animados dentro das cenas
  const [diagPercent, setDiagPercent] = useState(25);
  const [resolvedIssues, setResolvedIssues] = useState(false);
  const [evidenceValidated, setEvidenceValidated] = useState(false);
  const [edictAnalyzed, setEdictAnalyzed] = useState(false);
  const [dossierCompiling, setDossierCompiling] = useState(false);

  const SCENE_DURATION = 5500; // 5.5 segundos por cena

  const scenes = [
    { id: 0, title: "1. Diagnóstico", short: "Diagnóstico" },
    { id: 1, title: "2. Pendências", short: "Pendências" },
    { id: 2, title: "3. Evidências", short: "Evidências" },
    { id: 3, title: "4. Análise de Edital", short: "Edital" },
    { id: 4, title: "5. Dossiê Pronto", short: "Dossiê" },
  ];

  // Timer principal de loop contínuo
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50;
    const step = (intervalTime / SCENE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentScene((sc) => (sc + 1) % 5);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Efeitos animados específicos para cada cena
  useEffect(() => {
    setProgress(0);

    if (currentScene === 0) {
      setDiagPercent(35);
      const t = setTimeout(() => setDiagPercent(82), 1200);
      return () => clearTimeout(t);
    }

    if (currentScene === 1) {
      setResolvedIssues(false);
      const t = setTimeout(() => setResolvedIssues(true), 2000);
      return () => clearTimeout(t);
    }

    if (currentScene === 2) {
      setEvidenceValidated(false);
      const t = setTimeout(() => setEvidenceValidated(true), 1800);
      return () => clearTimeout(t);
    }

    if (currentScene === 3) {
      setEdictAnalyzed(false);
      const t = setTimeout(() => setEdictAnalyzed(true), 1900);
      return () => clearTimeout(t);
    }

    if (currentScene === 4) {
      setDossierCompiling(true);
      const t = setTimeout(() => setDossierCompiling(false), 2100);
      return () => clearTimeout(t);
    }
  }, [currentScene]);

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none font-sans">
      {/* Moldura de Laptop / Notebook Premium */}
      <div className="relative rounded-3xl border border-slate-700/80 bg-slate-950 p-2 sm:p-3 shadow-2xl shadow-blue-500/10 backdrop-blur-xl ring-1 ring-white/10">
        {/* Barra superior do Browser / Janela do Sistema */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/90 rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[10px] font-mono text-slate-400 hidden sm:inline">
              app.techcompliance.com.br/dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/20">
              Ambiente ao Vivo
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isPlaying ? "Pausar demonstração" : "Reproduzir demonstração"}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Barra de Navegação das Cenas / Etapas da Demonstração */}
        <div className="grid grid-cols-5 gap-1 p-2 bg-slate-900/60 border-b border-slate-800/80 text-[10px] sm:text-xs">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setCurrentScene(scene.id);
                setProgress(0);
              }}
              className={`py-1.5 px-1 rounded-lg text-center font-bold transition-all relative overflow-hidden truncate ${
                currentScene === scene.id
                  ? "text-blue-300 bg-blue-600/20 border border-blue-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span className="relative z-10">{scene.short}</span>
              {currentScene === scene.id && isPlaying && (
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Display / Tela do Sistema (Área Ativa da Simulação) */}
        <div className="relative min-h-[320px] sm:min-h-[360px] p-4 sm:p-6 bg-slate-900/90 text-slate-100 flex flex-col justify-between overflow-hidden">
          {/* CENA 0: DIAGNÓSTICO */}
          {currentScene === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {diagPercent >= 82 ? "Diagnóstico de Integridade Concluído" : "Analisando seu Programa de Integridade..."}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Base: Lei Federal nº 14.133/2021 & NR-1
                      </p>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-mono font-black text-emerald-400">
                    {diagPercent}%
                  </span>
                </div>

                {/* Barra de Progresso Animada */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${diagPercent}%` }}
                  />
                </div>
              </div>

              {/* 3 Pilares com Indicadores */}
              <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block truncate">Código & Políticas</span>
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Concluído (100%)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block truncate">Canal de Denúncias</span>
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Ativo 24/7</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block truncate">Treinamento Equipe</span>
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>87% Concluído</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300 text-[11px]">
                    24 de 32 requisitos atendidos para contratações públicas.
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-300 uppercase shrink-0">
                  Pronto para Evidências
                </span>
              </div>
            </div>
          )}

          {/* CENA 1: PENDÊNCIAS */}
          {currentScene === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {resolvedIssues ? "Pendências Prioritárias Resolvidas" : "5 Pendências e 3 Pontos de Atenção"}
                  </h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    resolvedIssues ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                  }`}>
                    {resolvedIssues ? "0 Críticas" : "Ação Necessária"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  O sistema aponta exatamente o que regularizar antes de apresentar o dossiê.
                </p>
              </div>

              {/* Lista de Cards de Pendências */}
              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  resolvedIssues
                    ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
                    : "bg-slate-800/80 border-slate-700 text-slate-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {resolvedIssues ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-[11px] sm:text-xs">
                        {resolvedIssues ? "Adesão ao Código de Conduta Formalizada" : "Assinatura digital do termo por colaboradores"}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {resolvedIssues ? "35/35 assinaturas com hash auditável" : "Faltam 4 colaboradores no fluxo WhatsApp"}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    resolvedIssues ? "bg-emerald-600/30 text-emerald-300" : "bg-blue-600 text-white animate-pulse"
                  }`}>
                    {resolvedIssues ? "Resolvido ✓" : "Resolver"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] sm:text-xs">Consulta CEIS / CNEP de fornecedores</div>
                      <span className="text-[10px] text-slate-400">Auditoria automatizada em bases federais</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    Conforme
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Clique com 1 toque para emitir termos ou convites de capacitação.</span>
                <span className="text-blue-400 font-bold">Fluxo Ágil →</span>
              </div>
            </div>
          )}

          {/* CENA 2: EVIDÊNCIAS */}
          {currentScene === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-blue-400" />
                    Acervo de Evidências Auditáveis
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Hash SHA-256
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Registros documentais prontos para comprovação perante a comissão.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Código de Conduta</span>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">v1.2 Aprovada em ata</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    VALIDADA
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Treinamento Equipe</span>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Microlearning e Quiz</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    VALIDADA
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Canal de Denúncias</span>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Relatórios e Sigilo</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    VALIDADA
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all space-y-1 ${
                  evidenceValidated
                    ? "bg-emerald-950/40 border-emerald-500/60 shadow-sm"
                    : "bg-slate-800/90 border-slate-700"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Due Diligence Terceiros</span>
                    <Check className={`w-3.5 h-3.5 ${evidenceValidated ? "text-emerald-400" : "text-slate-500"}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Certidões CEIS/CNEP</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                    evidenceValidated ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {evidenceValidated ? "VALIDADA ✓" : "PROCESSANDO..."}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-center text-xs text-slate-300 font-medium">
                Documentos centralizados e organizados por ordem cronológica.
              </div>
            </div>
          )}

          {/* CENA 3: ANÁLISE DE EDITAL */}
          {currentScene === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-indigo-400" />
                    Analisador de Exigências de Edital
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Pregao_TRF_2026.pdf
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cruzamento automático entre os itens da licitação e seu acervo documental.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-white">
                      Item 9.1 — Comprovação de Programa de Integridade (Lei 14.133)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Atendido
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Evidência vinculada: Dossiê completo + Código v1.2 aprovado.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-white">
                      Item 9.2 — Canal de Denúncias com Proteção ao Relator (NR-1)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Atendido
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Evidência vinculada: URL pública segura com protocolo e chave sigilosa.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-white">
                      Item 9.3 — Auditoria Prévia de Subcontratados (DDI)
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Requer Atualização
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    2 fornecedores com certidões a vencer em 15 dias.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-center justify-between">
                <span>Relatório de aderência pronto para a comissão de licitação.</span>
                <span className="font-bold">100% Auditável</span>
              </div>
            </div>
          )}

          {/* CENA 4: DOSSIÊ PRONTO */}
          {currentScene === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    Dossiê de Evidências para Apresentação
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    DOSSIE-2026-TRANSLOG
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Documento unificado com hash criptográfico e validação pública por QR Code.
                </p>
              </div>

              {/* Cartão de Dossiê Compilado */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/40 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Programa Estruturado & Evidenciado</div>
                      <span className="text-[10px] text-slate-400">Relatório probatório pronto para anexar na proposta</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg">
                    Pronto ✓
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 pt-2 border-t border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">Páginas</span>
                    <strong>18 Páginas</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Validação</span>
                    <strong className="text-blue-400">QR Code Oficial</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Enquadramento</span>
                    <strong className="text-emerald-400">Lei 14.133</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-2">
                <span className="text-[11px] text-slate-400">Com poucos cliques, seu dossiê está pronto para envio.</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <FileDown className="w-3.5 h-3.5" /> Baixar PDF
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Simulador com Status de Execução */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/90 rounded-b-2xl flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Demonstração interativa das funcionalidades do sistema</span>
          </div>

          <button
            onClick={() => {
              setCurrentScene((prev) => (prev + 1) % 5);
              setProgress(0);
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Próxima etapa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
