"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  FileDown,
  ArrowRight,
  Play,
  Pause,
  Check,
  Building2,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  MousePointer,
  Award,
} from "lucide-react";

export function HeroLiveSoftwareDemo() {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gaugeValue, setGaugeValue] = useState(30);
  const [isResolving, setIsResolving] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 80, y: 75, clicking: false });

  // 0: Diagnóstico (82%)
  // 1: Pendências (Cards organizados + Resolver)
  // 2: Evidências (Validadas)
  // 3: Edital (Identificação de requisitos)
  // 4: Dossiê (Pronto para apresentação)

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => ((prev + 1) % 5) as any);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Animação de cada etapa
  useEffect(() => {
    if (currentStep === 0) {
      setGaugeValue(35);
      const t = setTimeout(() => setGaugeValue(82), 600);
      return () => clearTimeout(t);
    }

    if (currentStep === 1) {
      setIsResolving(false);
      setCursorPos({ x: 75, y: 70, clicking: false });
      const t1 = setTimeout(() => setCursorPos({ x: 82, y: 75, clicking: true }), 1500);
      const t2 = setTimeout(() => {
        setIsResolving(true);
        setCursorPos({ x: 82, y: 75, clicking: false });
      }, 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentStep]);

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none font-sans">
      {/* Container Estilo Notebook Mac / Display Profissional com Sombra Realista */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-950 p-2 sm:p-3.5 shadow-2xl shadow-blue-900/40 ring-1 ring-white/15 backdrop-blur-xl">
        {/* Barra de Título / Janela */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/90 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>app.techcompliance.com.br/dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ao Vivo</span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isPlaying ? "Pausar demonstração" : "Iniciar demonstração"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Interface Interna do Software (Fiel ao design do TechCompliance) */}
        <div className="relative bg-white text-slate-900 rounded-b-xl sm:rounded-b-2xl overflow-hidden flex flex-col md:flex-row min-h-[360px] sm:min-h-[420px]">
          {/* Sidebar Interna */}
          <div className="w-full md:w-44 bg-slate-900 text-white p-3 sm:p-4 flex md:flex-col justify-between border-r border-slate-800 shrink-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs">
                <div className="p-1 bg-blue-600 rounded-lg text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>TechCompliance</span>
              </div>

              <nav className="hidden md:block space-y-1 pt-2 text-[11px]">
                <button
                  onClick={() => setCurrentStep(0)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    currentStep === 0 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Diagnóstico</span>
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                    currentStep === 1 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pendências</span>
                  </div>
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">3</span>
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    currentStep === 2 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evidências</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    currentStep === 3 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Editais (IA)</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    currentStep === 4 ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dossiê</span>
                </button>
              </nav>
            </div>

            <div className="hidden md:block pt-3 border-t border-slate-800 text-[10px] text-slate-400">
              <div className="font-bold text-slate-300 truncate">TransLog Brasil S/A</div>
              <div>CNPJ: 33.000.167/0001-01</div>
            </div>
          </div>

          {/* Área Principal Dinâmica */}
          <div className="flex-1 p-4 sm:p-6 bg-slate-50 flex flex-col justify-between overflow-hidden">
            {/* Header da Área Interna */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Programa de Integridade • Lei 14.133/2021
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {currentStep === 0 && "Diagnóstico da sua Empresa"}
                  {currentStep === 1 && "Pendências e Planos de Ação"}
                  {currentStep === 2 && "Acervo de Evidências Auditáveis"}
                  {currentStep === 3 && "Análise Inteligente de Edital"}
                  {currentStep === 4 && "Dossiê Probatório Preparado"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">Mariana Silva</div>
                  <div className="text-[10px] text-slate-500">Gestora de Compliance</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  MS
                </div>
              </div>
            </div>

            {/* CONTEÚDO DINÂMICO DE CADA ETAPA */}
            <div className="py-4 flex-1 flex flex-col justify-center">
              {/* ETAPA 0: DIAGNÓSTICO */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center animate-in fade-in duration-300">
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500 transition-all duration-1000 ease-out"
                          strokeDasharray={`${gaugeValue}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">{gaugeValue}%</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Estruturado</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Conformidade em Evolução
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Estrutura Organizacional</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Conforme</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Código de Conduta Ética</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Conforme</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Canal de Denúncias (NR-1)</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Ativo 24/7</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800">Treinamento de Colaboradores</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">Em Andamento</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 1: PENDÊNCIAS */}
              {currentStep === 1 && (
                <div className="space-y-2.5 text-xs animate-in fade-in duration-300">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <div className="font-bold text-slate-900">Termo de Conduta: 4 colaboradores pendentes</div>
                        <div className="text-[11px] text-slate-500">Enviar link rápido de aceite pelo WhatsApp</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      isResolving ? "bg-emerald-600 text-white" : "bg-blue-600 text-white shadow-xs"
                    }`}>
                      {isResolving ? "Resolvido ✓" : "Resolver"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <div>
                        <div className="font-bold text-slate-900">Revisar Política de Gestão de Terceiros</div>
                        <div className="text-[11px] text-slate-500">Consulta das certidões CEIS/CNEP em dia</div>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs font-semibold">Ver detalhes</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-bold text-slate-900">Registro semestral da comissão de apuração</div>
                        <div className="text-[11px] text-slate-500">Atas arquivadas com chave de protocolo</div>
                      </div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                      Conforme
                    </span>
                  </div>
                </div>
              )}

              {/* ETAPA 2: EVIDÊNCIAS */}
              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-3 text-xs animate-in fade-in duration-300">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Código de Conduta v1.2</strong>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">15 Seções normativas com aprovação em ata</div>
                    <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADA (SHA-256)
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Canal de Denúncias</strong>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">URL pública externa ativa com sigilo garantido</div>
                    <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADA (SHA-256)
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Treinamentos Emitidos</strong>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">35 Certificados com código único de validação</div>
                    <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADA (SHA-256)
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Due Diligence Terceiros</strong>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">Consultas CEIS/CNEP de fornecedores</div>
                    <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADA (SHA-256)
                    </span>
                  </div>
                </div>
              )}

              {/* ETAPA 3: ANÁLISE DE EDITAL */}
              {currentStep === 3 && (
                <div className="space-y-2.5 text-xs animate-in fade-in duration-300">
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-900">Edital Pregão Eletrônico nº 42/2026 - TRF</span>
                    </div>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                      Analisado com IA
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.1 — Comprovação de Programa de Integridade (Lei 14.133)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência: Código formalizado + Dossiê de Integridade</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Atendido ✓
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.2 — Canal de Denúncias contra o assédio (NR-1 / Lei 14.457)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência: Canal externo com garantia de não retaliação</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Atendido ✓
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.3 — Auditoria prévia em bases de sanções (CEIS / CNEP)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência: Relatório de Due Diligence dos subcontratados</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Atenção ⚠
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 4: DOSSIÊ */}
              {currentStep === 4 && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-blue-500/40 shadow-xl space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-600 text-white">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Dossiê de Integridade Pronto</h4>
                        <span className="text-[11px] text-slate-400">Código de Validação: DOSSIE-2026-TRANSLOG</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Pronto para envio ✓
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evidências consolidadas em relatório probatório completo com QR Code público para conferência por Pregoeiros e Fiscais de Contrato.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">18 Páginas de documentação estruturada</span>
                    <span className="font-bold text-blue-400 flex items-center gap-1">
                      <FileDown className="w-4 h-4" /> Exportar PDF
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé da Demonstração com Navegador de Etapas */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx as any)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentStep === idx ? "bg-blue-600 scale-125" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Ir para etapa ${idx + 1}`}
                  />
                ))}
                <span className="text-[11px] ml-1 font-medium">
                  Passo {currentStep + 1} de 5
                </span>
              </div>

              <button
                onClick={() => setCurrentStep((prev) => ((prev + 1) % 5) as any)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>Avançar fluxo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Flutuantes de Apoio Visual (Estilo do mockup da referência) */}
      <div className="hidden lg:block absolute -right-6 top-16 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-right duration-500">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Diagnóstico Automático</span>
        </div>
        <div className="text-[11px] text-slate-500">Maturidade do programa calculada</div>
      </div>

      <div className="hidden lg:block absolute -right-6 top-36 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-right duration-500">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Pendências Identificadas</span>
        </div>
        <div className="text-[11px] text-slate-500">Orientações claras para regularizar</div>
      </div>

      <div className="hidden lg:block absolute -right-6 top-56 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-right duration-500">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Evidências Organizadas</span>
        </div>
        <div className="text-[11px] text-slate-500">Arquivos válidos e centralizados</div>
      </div>

      <div className="hidden lg:block absolute -right-6 bottom-16 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-right duration-500">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <FileDown className="w-4 h-4 text-indigo-600" />
          <span>Dossiê para Apresentação</span>
        </div>
        <div className="text-[11px] text-slate-500">PDF completo com validação QR Code</div>
      </div>
    </div>
  );
}
