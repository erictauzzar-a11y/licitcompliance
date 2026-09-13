"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  FileQuestion,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { maskCNPJInput, cleanCNPJ, isValidCNPJFormat } from "@/lib/utils";

export function FreeDiagnosticSection() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cleanCNPJ(cnpj);
    if (!raw) {
      router.push("/cadastro");
      return;
    }
    if (!isValidCNPJFormat(raw)) {
      setError("Por favor, digite um CNPJ válido com 14 dígitos.");
      return;
    }
    setError("");
    router.push(`/cadastro?cnpj=${raw}`);
  };

  const flowSteps = [
    {
      step: "01",
      title: "CNPJ",
      desc: "Consulta automática de dados oficiais",
      icon: Search,
    },
    {
      step: "02",
      title: "Perfil da empresa",
      desc: "Porte, setor e contratações públicas",
      icon: Building2,
    },
    {
      step: "03",
      title: "Perguntas inteligentes",
      desc: "Mapeamento rápido dos pilares essenciais",
      icon: FileQuestion,
    },
    {
      step: "04",
      title: "Diagnóstico",
      desc: "Confronto com parâmetros da Lei 14.133",
      icon: Gauge,
    },
    {
      step: "05",
      title: "Resultado",
      desc: "Score, pontos de atenção e plano de ação",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="diagnostico" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Luz ambiente de destaque */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>DIAGNÓSTICO INICIAL GRATUITO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Descubra onde sua empresa está hoje
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Faça uma avaliação inicial e veja o que já está estruturado, o que precisa de atenção e quais evidências ainda precisam ser organizadas.
          </p>
        </div>

        {/* Card Interativo com Formulário Rápido de CNPJ */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 shadow-2xl shadow-blue-950/50 backdrop-blur-xl max-w-3xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 text-center sm:text-left">
              Digite o CNPJ da sua empresa para iniciar a avaliação gratuita:
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => {
                    setCnpj(maskCNPJInput(e.target.value));
                    if (error) setError("");
                  }}
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                  className="w-full bg-slate-950 text-white pl-12 pr-4 py-4 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none font-mono text-base transition-all placeholder:text-slate-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <span>COMEÇAR DIAGNÓSTICO GRATUITO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center sm:text-left font-medium">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sem necessidade de cartão
              </span>
              <span>•</span>
              <span>Consulta instantânea na Receita</span>
              <span>•</span>
              <span>Avaliação sigilosa</span>
            </div>
          </form>
        </div>

        {/* Representação Visual do Fluxo em 5 Etapas */}
        <div className="space-y-4">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            Como funciona o fluxo de avaliação
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {flowSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {s.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  {idx < flowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
