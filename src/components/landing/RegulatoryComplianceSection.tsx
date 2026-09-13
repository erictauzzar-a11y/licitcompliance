"use client";

import { Scale, BookOpen, ShieldCheck, HardHat, FileText } from "lucide-react";

export function RegulatoryComplianceSection() {
  const norms = [
    {
      title: "Lei 14.133/2021",
      subtitle: "Nova Lei de Licitações e Contratos",
      desc: "Contratações públicas e critérios relacionados ao Programa de Integridade.",
      icon: Scale,
      badge: "Legislação Federal",
      accent: "border-blue-500/20 bg-blue-950/20",
      iconColor: "text-blue-400 bg-blue-500/10",
    },
    {
      title: "Decreto 12.304/2024",
      subtitle: "Regulamentação da Integridade Pública",
      desc: "Parâmetros para avaliação e implementação de Programas de Integridade no âmbito federal.",
      icon: BookOpen,
      badge: "Diretrizes CGU",
      accent: "border-emerald-500/20 bg-emerald-950/20",
      iconColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Lei 14.457/2022",
      subtitle: "Programa Emprega + Mulheres",
      desc: "Medidas relacionadas à prevenção e enfrentamento do assédio e da violência no trabalho.",
      icon: ShieldCheck,
      badge: "Canal de Denúncias",
      accent: "border-purple-500/20 bg-purple-950/20",
      iconColor: "text-purple-400 bg-purple-500/10",
    },
    {
      title: "NR-1",
      subtitle: "Norma Regulamentadora do MTE",
      desc: "Gestão de riscos ocupacionais e mecanismos de comunicação interna.",
      icon: HardHat,
      badge: "Segurança Ocupacional",
      accent: "border-amber-500/20 bg-amber-950/20",
      iconColor: "text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho Institucional */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>BASE NORMATIVA E RESPONSABILIDADE TÉCNICA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Construído para ajudar sua empresa a organizar e evidenciar seu Programa de Integridade
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Estruturado de forma independente para alinhar sua documentação aos parâmetros das principais normas vigentes no Brasil.
          </p>
        </div>

        {/* Grid dos 4 Diplomas Legais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {norms.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.title}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group shadow-lg ${n.accent}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border border-white/5 ${n.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {n.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white tracking-tight group-hover:text-blue-300 transition-colors">
                      {n.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {n.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota de Responsabilidade Legal (Sem promessas falsas de certificação) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs leading-relaxed max-w-4xl mx-auto text-center space-y-1">
          <div className="font-bold text-slate-300">Aviso Institucional de Governança</div>
          <p>
            O TechCompliance é uma ferramenta de gestão e organização de evidências probatórias. A plataforma não substitui a orientação de assessoria jurídica especializada, tampouco emite certificações de competência exclusiva de órgãos de controle ou entidades acreditadoras oficiais.
          </p>
        </div>
      </div>
    </section>
  );
}
