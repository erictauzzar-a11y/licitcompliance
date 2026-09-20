"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  QrCode,
  ExternalLink,
  Lock,
} from "lucide-react";

export function HeroLiveSoftwareDemo() {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isPlaying, setIsPlaying] = useState(false); // Pausado por padrão para controle manual confortável do usuário
  const [gaugeValue, setGaugeValue] = useState(61);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedTasks, setResolvedTasks] = useState<Record<string, boolean>>({});

  // Abas do sistema:
  // 0: Diagnóstico (61% estruturado, 14 atendidos, 6 atenção, 7 a desenvolver)
  // 1: Pendências (Cards priorizados + Ação interativa)
  // 2: Evidências (Arquivos auditáveis com status e hash)
  // 3: Editais com IA (Leitura de requisitos e aderência de 88%)
  // 4: Dossiê (Prévia do documento com QR Code e validação pública)

  const tabs = [
    { id: 0, label: "Diagnóstico", icon: ShieldCheck },
    { id: 1, label: "Pendências", icon: AlertTriangle, badge: "3" },
    { id: 2, label: "Evidências", icon: FileText },
    { id: 3, label: "Editais (IA)", icon: Search },
    { id: 4, label: "Dossiê", icon: FileDown },
  ];

  // Alternância automática suave apenas se o usuário der Play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => ((prev + 1) % 5) as any);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const toggleTaskResolution = (taskId: string) => {
    setResolvedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none font-sans">
      {/* Janela de Software com Acabamento Premium */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-950 p-2 sm:p-3.5 shadow-2xl shadow-blue-950/60 ring-1 ring-white/10 backdrop-blur-xl">
        {/* Barra Superior / Header do Sistema */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 bg-slate-900/90 rounded-t-xl sm:rounded-t-2xl">
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
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xs:inline">Sistema conectado • </span>Ambiente ativo
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-400"
              title={isPlaying ? "Pausar troca automática" : "Iniciar troca automática"}
              aria-label={isPlaying ? "Pausar demonstração" : "Iniciar demonstração"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Interface Interna do Software */}
        <div className="relative bg-white text-slate-900 rounded-b-xl sm:rounded-b-2xl overflow-hidden flex flex-col md:flex-row min-h-[380px] sm:min-h-[430px]">
          {/* Sidebar Interna com Navegação de Abas */}
          <div className="w-full md:w-48 bg-slate-900 text-white p-3 sm:p-4 flex md:flex-col justify-between border-r border-slate-800 shrink-0">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2 font-bold text-xs">
                <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="leading-tight block font-black text-xs text-white">TechCompliance</span>
                  <span className="text-[9px] text-slate-400 block font-normal">Painel Corporativo</span>
                </div>
              </div>

              {/* Seletor de Abas (Horizontal no Mobile, Vertical no Desktop) */}
              <nav className="flex md:flex-col gap-1 pt-1 text-[11px] overflow-x-auto pb-1 md:pb-0" role="tablist">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentStep === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setCurrentStep(tab.id as any);
                        setIsPlaying(false);
                      }}
                      className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? "bg-white text-blue-700" : "bg-red-500/80 text-white"
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Identificação da Empresa Modelo Fictícia */}
            <div className="hidden md:block pt-3 border-t border-slate-800 text-[10px] text-slate-400">
              <div className="font-bold text-slate-200 truncate">TransLog Brasil S/A</div>
              <div className="font-mono text-[9px] text-slate-400">CNPJ: 33.000.167/0001-01</div>
              <div className="text-[8px] text-amber-400/90 mt-1 uppercase tracking-wider font-semibold">
                Simulação Visual
              </div>
            </div>
          </div>

          {/* Área Principal Dinâmica */}
          <div className="flex-1 p-4 sm:p-5 bg-slate-50 flex flex-col justify-between overflow-hidden">
            {/* Header da Área Interna */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Programa de Integridade</span>
                  <span>•</span>
                  <span className="text-blue-600">Lei 14.133 / NR-1</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {currentStep === 0 && "Diagnóstico da Empresa"}
                  {currentStep === 1 && "Pendências e Planos de Ação"}
                  {currentStep === 2 && "Acervo de Evidências Auditáveis"}
                  {currentStep === 3 && "Análise Inteligente de Edital"}
                  {currentStep === 4 && "Dossiê Probatório Preparado"}
                </h3>
              </div>

              <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                Exemplo Ilustrativo
              </span>
            </div>

            {/* CONTEÚDO DINÂMICO DE CADA ABA */}
            <div className="py-3 flex-1 flex flex-col justify-center">
              {/* ABA 0: DIAGNÓSTICO (61% estruturado, 14 atendidos, 6 atenção, 7 a desenvolver) */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center animate-fade-in">
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600 transition-all duration-700 ease-out"
                          strokeDasharray="61, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">61%</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Estruturado</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Conformidade em Evolução
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-1.5 text-xs">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800 text-xs">14 Requisitos Atendidos</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Conforme</span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800 text-xs">6 Pontos de Atenção</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">Ajustar</span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 text-xs">7 Pontos a Desenvolver</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Pendente</span>
                    </div>

                    <div className="p-1.5 text-[10px] text-slate-500 bg-slate-100/70 rounded-lg flex items-center justify-between">
                      <span>Base: Lei 14.133/21 • NR-1</span>
                      <span className="font-mono text-slate-700 font-bold">27 itens analisados</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 1: PENDÊNCIAS */}
              {currentStep === 1 && (
                <div className="space-y-2 text-xs animate-fade-in">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">Canal de Denúncias: Link externo ativo</div>
                        <div className="text-[10px] text-slate-500 truncate">Exigência de sigilo e não retaliação NR-1 / Lei 14.457</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleTaskResolution("canal")}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer ${
                        resolvedTasks["canal"] ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {resolvedTasks["canal"] ? "Ativo ✓" : "Ativar canal"}
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">Treinamento Ético: 4 colaboradores pendentes</div>
                        <div className="text-[10px] text-slate-500 truncate">Disparo de link de leitura rápida sem senha</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleTaskResolution("treino")}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer ${
                        resolvedTasks["treino"] ? "bg-emerald-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                      }`}
                    >
                      {resolvedTasks["treino"] ? "Enviado ✓" : "Disparar link"}
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">Política de Relacionamento com o Setor Público</div>
                        <div className="text-[10px] text-slate-500 truncate">Gerar minuta padrão com parâmetros da Lei 14.133</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold px-2">Em elaboração</span>
                  </div>
                </div>
              )}

              {/* ABA 2: EVIDÊNCIAS */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-fade-in">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-xs truncate">Código de Conduta v1.2</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-500">Ata de aprovação e vigência ativa</div>
                    <span className="inline-block text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADO • SHA-256
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-xs truncate">Canal de Denúncias NR-1</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-500">Protocolo seguro e acesso externo 24/7</div>
                    <span className="inline-block text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                      VALIDADO • SHA-256
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-xs truncate">Ata de Treinamento 2026</span>
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-500">35 Certificados individuais emitidos</div>
                    <span className="inline-block text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                      EM REVISÃO
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-xs truncate">Política Antifraude</span>
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-500">Mecanismos de controle e due diligence</div>
                    <span className="inline-block text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300 font-mono">
                      PENDENTE
                    </span>
                  </div>
                </div>
              )}

              {/* ABA 3: EDITAIS COM IA */}
              {currentStep === 3 && (
                <div className="space-y-2 text-xs animate-fade-in">
                  <div className="p-2 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-bold text-blue-900 text-xs truncate">Pregão TRF nº 42/2026 (Exemplo)</span>
                    </div>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded shrink-0">
                      88% Compatível
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.1 — Programa de Integridade (Art. 25, §4º, Lei 14.133)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência associada: Código de Conduta + Dossiê</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Atendido ✓
                      </span>
                    </div>

                    <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.2 — Canal de Prevenção ao Assédio (NR-1 / Lei 14.457)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência associada: Canal externo com garantia de anonimato</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Atendido ✓
                      </span>
                    </div>

                    <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          Item 9.3 — Auditoria prévia de sanções (CEIS / CNEP)
                        </div>
                        <div className="text-[10px] text-slate-500">Evidência: Relatório de Due Diligence de fornecedores</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                        Atenção ⚠
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: DOSSIÊ */}
              {currentStep === 4 && (
                <div className="p-3.5 sm:p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-blue-500/40 shadow-xl space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                        <FileDown className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">Dossiê Probatório de Integridade</h4>
                        <span className="text-[10px] text-slate-400 font-mono">CÓDIGO: DOSSIE-2026-TRANSLOG</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Validação Pública Ativa ✓
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Relatório consolidado com sumário de evidências, atestados de conformidade técnica e QR Code público para pregoeiros e fiscais de contrato.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <QrCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>Hash SHA-256: 8f4a...29c1</span>
                    </div>
                    <Link
                      href="/acessar-demo"
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Acessar versão demo</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé da Demonstração com Navegador de Abas Rápido */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Navegue pelas abas acima para testar cada módulo</span>
              </div>
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setCurrentStep(tab.id as any);
                      setIsPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentStep === tab.id ? "bg-blue-600 w-5" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    title={tab.label}
                    aria-label={`Ver aba ${tab.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
