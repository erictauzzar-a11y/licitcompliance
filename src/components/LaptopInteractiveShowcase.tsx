"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FileCheck2,
  Lock,
  Award,
  Sparkles,
  ShieldCheck,
  Play,
  Pause,
} from "lucide-react";

interface ScreenSlide {
  id: string;
  title: string;
  badge: string;
  pilar: string;
  image: string;
  description: string;
  icon: typeof FileCheck2;
  color: string;
  stats: { label: string; value: string };
}

const SLIDES: ScreenSlide[] = [
  {
    id: "visao-geral",
    title: "Painel de Controle e Status da Empresa",
    badge: "Lei 14.133/2021",
    pilar: "Visão Geral",
    image: "/screen-visao-geral.png",
    description:
      "Central de comando completa: acompanhamento do status de preparação (81% estruturado), requisitos atendidos, evidências ativas e ações prioritárias em tempo real.",
    icon: FileCheck2,
    color: "from-blue-500 to-sky-400",
    stats: { label: "Requisitos Atendidos", value: "24 de 32" },
  },
  {
    id: "diagnostico",
    title: "Diagnóstico e Evidenciação Contínua",
    badge: "Maturidade Documental",
    pilar: "Diagnóstico do Programa",
    image: "/screen-diagnostico.png",
    description:
      "Mapeamento granular dos pilares de integridade: Código de Conduta (88%), Políticas (100%), Treinamentos contínuos (88%) e Canal de Denúncias (100%).",
    icon: Lock,
    color: "from-indigo-500 to-blue-500",
    stats: { label: "Maturidade", value: "81% Avançada" },
  },
  {
    id: "analisar-edital",
    title: "Análise de Editais com Confronto de IA",
    badge: "Inteligência Documental",
    pilar: "Análise de Edital",
    image: "/screen-analisar-edital.png",
    description:
      "Envie o edital em PDF ou cláusulas de habilitação. O motor de IA extrai exigências de compliance e cruza instantaneamente contra o acervo probatório da sua empresa.",
    icon: Award,
    color: "from-emerald-500 to-teal-400",
    stats: { label: "Cruzamento", value: "Instantâneo" },
  },
];

export function LaptopInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const current = SLIDES[activeTab];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden border-t border-b border-slate-800/80">
      {/* Glow e iluminação de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 right-10 w-[500px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>SISTEMA EM AÇÃO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Veja como o software funciona por dentro
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Uma plataforma completa desenvolvida especificamente para a realidade de empresas que disputam contratos e licitações públicas.
          </p>
        </div>

        {/* 3 Cards Seletores de Telas (Tabs Interativas com Barra de Progresso) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SLIDES.map((slide, idx) => {
            const Icon = slide.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveTab(idx);
                  setIsPlaying(false);
                }}
                className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isActive
                    ? "bg-slate-900 border-blue-500/60 shadow-xl shadow-blue-950/60 ring-1 ring-blue-400/30"
                    : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                }`}
              >
                {/* Linha de progresso no topo quando ativo */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700"
                      } transition-colors`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {slide.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${isActive ? "text-white" : "text-slate-300"}`}>
                      {slide.pilar}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {slide.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{slide.stats.label}</span>
                  <span className={`font-bold font-mono ${isActive ? "text-emerald-400" : "text-slate-300"}`}>
                    {slide.stats.value}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* GRANDE TELA DE NOTEBOOK REALISTA COM AS TELAS DO SOFTWARE PASSANDO DENTRO */}
        <div className="relative max-w-5xl mx-auto pt-4">
          {/* Controles Flutuantes: Pausar/Play e Indicador de Tela */}
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-300">
                Mostrando: {current.pilar} ({activeTab + 1} de {SLIDES.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
                title={isPlaying ? "Pausar animação automática" : "Continuar reprodução"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reproduzir</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MOLDURA REALISTA DE NOTEBOOK PREMIUM (MACBOOK PRO STYLE) */}
          <div className="relative mx-auto rounded-t-[28px] sm:rounded-t-[36px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2.5 sm:p-4 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-slate-700/80 ring-1 ring-white/10">
            {/* Câmera / Notch do Laptop */}
            <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 relative">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400 absolute inset-0 m-auto" />
              </div>
            </div>

            {/* Display / Vidro da Tela */}
            <div className="relative rounded-t-[20px] sm:rounded-t-[26px] overflow-hidden bg-slate-950 border border-slate-900 shadow-inner">
              {/* Barra do Navegador */}
              <div className="h-9 bg-slate-900/95 border-b border-slate-800/90 px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>app.licitcompliance.com.br/dashboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span className="hidden sm:inline">Conexão Segura SSL 256-bit</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* ÁREA DA TELA DO SISTEMA EM TRANSIÇÃO */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden group">
                {SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      activeTab === idx
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-95 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      quality={95}
                      className="object-cover object-top"
                    />

                    {/* Overlay sutil inferior para garantir leitura do card flutuante */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Card Flutuante de Destaque no Canto da Tela */}
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 max-w-sm sm:max-w-md p-3.5 sm:p-4 rounded-xl bg-slate-950/85 border border-slate-700/80 backdrop-blur-md shadow-2xl text-left space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                          {slide.pilar}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {slide.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-snug hidden sm:block">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BASE DO NOTEBOOK COM NOTCH DE ABERTURA E TRACKPAD */}
          <div className="relative mx-auto -mt-0.5">
            {/* Dobradiça */}
            <div className="mx-auto w-[98%] sm:w-[96%] h-3 sm:h-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-lg border-x border-b border-slate-700/90 shadow-md flex items-center justify-center">
              {/* Cavidade para abrir o laptop */}
              <div className="w-20 sm:w-28 h-1.5 bg-slate-950 rounded-full border-t border-slate-700/80" />
            </div>

            {/* Mesa com Reflexo / Sombra */}
            <div className="mx-auto w-[92%] sm:w-[90%] h-4 bg-gradient-to-b from-black/60 to-transparent blur-md -mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
