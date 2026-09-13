"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqSection() {
  const faqs: FaqItem[] = [
    {
      q: "Toda empresa que participa de licitação precisa ter Programa de Integridade?",
      a: "Não. A necessidade depende da contratação, da legislação aplicável e de eventuais exigências específicas do edital ou do ente contratante.",
    },
    {
      q: "O diagnóstico é gratuito?",
      a: "Sim. O diagnóstico inicial foi pensado para mostrar de forma simples onde sua empresa está e quais pontos merecem atenção.",
    },
    {
      q: "O TechCompliance certifica minha empresa?",
      a: "Não. O TechCompliance ajuda sua empresa a estruturar, organizar, acompanhar e evidenciar seu Programa de Integridade. A plataforma não substitui certificações, avaliações oficiais ou orientação jurídica.",
    },
    {
      q: "Posso analisar um edital?",
      a: "Sim. O módulo de análise de editais ajuda a identificar requisitos e pontos relacionados à integridade e a compará-los com as informações e evidências disponíveis na plataforma.",
    },
    {
      q: "O TechCompliance garante que minha empresa será habilitada ou vencerá uma licitação?",
      a: "Não. O TechCompliance não garante habilitação, classificação ou vitória em licitações. Ele ajuda sua empresa a organizar e evidenciar sua estrutura de integridade.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>TIRA-DÚVIDAS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Perguntas frequentes
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Transparência técnica sobre o que o TechCompliance faz e como apoia sua empresa.
          </p>
        </div>

        {/* Lista de Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-slate-900/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
