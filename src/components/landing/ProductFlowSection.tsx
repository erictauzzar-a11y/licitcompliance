"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Gauge,
  AlertTriangle,
  FileCheck2,
  Search,
  FileDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function ProductFlowSection() {
  const [activeStep, setActiveStep] = useState(1); // Passo 1 (Diagnóstico) ativo por padrão

  const steps = [
    {
      id: 0,
      code: "01",
      title: "CNPJ",
      subtitle: "Identificação",
      desc: "Você informa o CNPJ e o porte da empresa para calibrar os parâmetros técnicos aplicáveis.",
      icon: Building2,
      tag: "Entrada Rápida",
      badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      highlight: "Sem burocracia ou cadastro prévio",
    },
    {
      id: 1,
      code: "02",
      title: "Diagnóstico",
      subtitle: "Mapeamento",
      desc: "O sistema analisa os 5 eixos normativos da Lei 14.133/2021 e da NR-1 para medir sua estrutura.",
      icon: Gauge,
      tag: "Resultado Imediato",
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      highlight: "Score de 61% e plano de ação inicial",
    },
    {
      id: 2,
      code: "03",
      title: "Pendências",
      subtitle: "Priorização",
      desc: "Lista clara de ações prioritárias: ativação do canal de denúncias, capacitação e código ético.",
      icon: AlertTriangle,
      tag: "Foco Operacional",
      badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      highlight: "Saiba exatamente onde agir primeiro",
    },
    {
      id: 3,
      code: "04",
      title: "Evidências",
      subtitle: "Organização",
      desc: "Repositório seguro de atas, certificados individuais e políticas com validação de integridade.",
      icon: FileCheck2,
      tag: "Acervo Probatório",
      badgeColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
      highlight: "Documentos com hash criptográfico SHA-256",
    },
    {
      id: 4,
      code: "05",
      title: "Análise de Edital",
      subtitle: "Conferência IA",
      desc: "IA cruza as cláusulas do edital licitatório com seu acervo para apontar o índice de conformidade.",
      icon: Search,
      tag: "Compatibilidade",
      badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
      highlight: "Identifique exigências antes do pregão",
    },
    {
      id: 5,
      code: "06",
      title: "Dossiê",
      subtitle: "Apresentação",
      desc: "Geração de relatório executivo em PDF com QR Code público para pregoeiros e fiscais de contrato.",
      icon: FileDown,
      tag: "Validação Pública",
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      highlight: "Autenticidade conferível em tempo real",
    },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[350px] bg-blue-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>FLUXO COMPLETO DO PRODUTO</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Do CNPJ ao Dossiê em um ciclo contínuo
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Uma jornada clara para que sua empresa saia da incerteza, estruture as exigências da Lei 14.133 e comprove conformidade perante os órgãos contratantes.
          </p>
        </div>

        {/* Linha de Conexão Progressiva (Desktop: Horizontal com SVG | Mobile: Vertical) */}
        <div className="hidden lg:block relative py-6">
          {/* Linha de Conexão de Fundo */}
          <div className="absolute top-14 left-12 right-12 h-0.5 bg-slate-800 -z-0" />
          {/* Linha Ativa Iluminada */}
          <div
            className="absolute top-14 left-12 h-0.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 -z-0 transition-all duration-500"
            style={{ width: `${(activeStep / (steps.length - 1)) * 82}%` }}
          />

          <div className="grid grid-cols-6 gap-3 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isPast = activeStep >= step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left p-4 rounded-2xl transition-all duration-300 group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-900/30 scale-[1.02]"
                      : isPast
                      ? "bg-slate-900/60 border border-slate-700/80 hover:border-slate-600"
                      : "bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* Ícone e Numeração */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/40"
                          : isPast
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {step.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {step.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Versão Mobile: Fluxo Empilhado Vertical com Linha Lateral */}
        <div className="lg:hidden relative pl-6 border-l-2 border-slate-800 space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-950/50"
                    : "bg-slate-950 border-slate-800/80"
                }`}
              >
                {/* Marcador na Linha Vertical */}
                <div
                  className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-colors ${
                    isActive ? "bg-blue-500 ring-4 ring-blue-500/20" : "bg-slate-700"
                  }`}
                />

                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl border ${step.badgeColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{step.code}</span>
                      <h3 className="font-bold text-sm text-white">{step.title}</h3>
                    </div>
                    <span className="text-[10px] text-slate-400">{step.subtitle}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">{step.desc}</p>
                <div className="mt-2 text-[10px] font-semibold text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card de Destaque da Etapa Selecionada (Preview Detalhado Desktop) */}
        <div className="hidden lg:block p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold border font-mono">
                <span className="text-slate-400">FASE {steps[activeStep].code}</span>
                <span>•</span>
                <span className="text-blue-400 uppercase">{steps[activeStep].tag}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                {steps[activeStep].title}: {steps[activeStep].subtitle}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{steps[activeStep].highlight}</span>
              </div>
            </div>

            <div className="md:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                Como Funciona na Prática
              </div>
              {activeStep === 0 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. Consulta do CNPJ na base pública oficial</div>
                  <div>2. Identificação do segmento de atuação</div>
                  <div>3. Calibração dos questionários aplicáveis</div>
                </div>
              )}
              {activeStep === 1 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. 5 Eixos avaliados com base no Dec. 12.304/24</div>
                  <div>2. Score demonstrativo estruturado em 61%</div>
                  <div>3. Visualização imediata de 14 pontos atendidos</div>
                </div>
              )}
              {activeStep === 2 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. Canal de denúncias independente (Prioridade Alta)</div>
                  <div>2. Termos de conduta e certificação de colaboradores</div>
                  <div>3. Plano de ação passo a passo para resolução</div>
                </div>
              )}
              {activeStep === 3 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. Repositório digital de documentos formalizados</div>
                  <div>2. Atas de aprovação e relatórios de conformidade</div>
                  <div>3. Garantia de rastreabilidade com hash SHA-256</div>
                </div>
              )}
              {activeStep === 4 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. Upload do arquivo PDF do edital licitatório</div>
                  <div>2. IA extrai cláusulas de integridade e NR-1</div>
                  <div>3. Comparação de conformidade estimada em 88%</div>
                </div>
              )}
              {activeStep === 5 && (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <div>1. Compilação automática de todas as evidências</div>
                  <div>2. Emissão de código validador único</div>
                  <div>3. Página pública de validação para pregoeiros</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner CTA Estratégico ao Final do Fluxo */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-bold text-white text-base">
              Descubra agora onde sua empresa está nesse ciclo
            </h4>
            <p className="text-xs text-slate-300">
              Faça o diagnóstico inicial gratuito em menos de 3 minutos, sem compromisso e sem cartão de crédito.
            </p>
          </div>

          <Link
            href="/diagnostico"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 text-xs flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <span>FAZER DIAGNÓSTICO GRATUITO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
