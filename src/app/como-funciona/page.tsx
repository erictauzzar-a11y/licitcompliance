import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Lock,
  Users,
  Search,
  FileDown,
  Building2,
  Award,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Como Funciona | TechCompliance",
  description:
    "Do diagnóstico ao dossiê probatório em 6 passos objetivos. Veja como preparar a integridade da sua empresa para licitações públicas com a Lei nº 14.133/2021.",
};

const STEPS = [
  {
    step: "01",
    title: "Cadastre sua empresa",
    subtitle: "Consulta pública instantânea via CNPJ",
    description:
      "Informe apenas o número do CNPJ. O sistema consulta automaticamente a Receita Federal e as bases públicas oficiais para puxar razão social, atividade econômica principal e dados cadastrais.",
    badge: "Etapa Inicial",
    color: "blue",
    features: [
      "Integração instantânea com bases públicas",
      "Identificação automática de porte e CNAE",
      "Configuração do perfil institucional em segundos",
    ],
    mockup: {
      type: "cnpj",
      cnpj: "33.000.167/0001-01",
      razao: "TransLog Brasil Transportes e Logística S/A",
      status: "Ativa",
    },
  },
  {
    step: "02",
    title: "Faça o diagnóstico",
    subtitle: "Avaliação do grau de maturidade documental",
    description:
      "Nosso motor analisa os 32 requisitos normativos da Lei nº 14.133/2021 e da NR-1, gerando o indicador percentual de maturidade do seu programa de integridade.",
    badge: "Motor Analítico",
    color: "emerald",
    features: [
      "Mapeamento granular dos 32 pilares legais",
      "Score percentual de conformidade imediato",
      "Identificação dos pontos de risco para inabilitação",
    ],
    mockup: {
      type: "diagnostico",
      score: "81%",
      nivel: "Estruturação Avançada",
      atendidos: "24 de 32 requisitos",
    },
  },
  {
    step: "03",
    title: "Identifique as pendências",
    subtitle: "Planos de ação objetivos sem juridiquês",
    description:
      "O sistema separa as pendências em 'Críticas' (que geram inabilitação sumária) e 'Orientações', fornecendo modelos prontos de políticas, atas e termos para regularização.",
    badge: "Plano de Ação",
    color: "amber",
    features: [
      "Classificação por criticidade e impacto licitatório",
      "Checklists práticos para o gestor da empresa",
      "Modelos de Código de Conduta e Políticas inclusos",
    ],
    mockup: {
      type: "pendencias",
      criticas: "0 Críticas",
      orientacoes: "3 Orientações",
      status: "Planos de regularização disponíveis",
    },
  },
  {
    step: "04",
    title: "Organize suas evidências",
    subtitle: "Repositório imutável com carimbo de tempo",
    description:
      "Centralize atas de treinamento, termos de compromisso assinados, registros do canal de denúncias e documentos comprobatórios com hash criptográfico SHA-256.",
    badge: "Auditabilidade",
    color: "indigo",
    features: [
      "Carimbo de data e hora (timestamp) auditável",
      "Geração de hash de integridade SHA-256 para cada arquivo",
      "Registro de lista de presença e certificação de colaboradores",
    ],
    mockup: {
      type: "evidencias",
      itens: ["Código de Conduta Vigente", "Canal de Denúncias Ativo", "Ata de Treinamento NR-1"],
      seguranca: "Hash SHA-256 Atribuído",
    },
  },
  {
    step: "05",
    title: "Analise os editais com IA",
    subtitle: "Extração de cláusulas de integridade e cruzamento",
    description:
      "Faça upload do edital em PDF ou cole o texto do termo de referência. O motor de IA extrai as exigências de compliance e cruza contra o acervo documental da empresa em segundos.",
    badge: "Inteligência Artificial",
    color: "cyan",
    features: [
      "Leitura automatizada de PDFs complexos de licitação",
      "Detecção de exigências de Lei 14.133 e NR-1 no edital",
      "Relatório de aderência prévia para participar com segurança",
    ],
    mockup: {
      type: "edital",
      nome: "Edital_Pregao_TRF_42_2026.pdf",
      aderencia: "94% de Compatibilidade",
      resultado: "Requisitos documentais atendidos",
    },
  },
  {
    step: "06",
    title: "Gere seu dossiê probatório",
    subtitle: "Documento oficial em PDF com QR Code auditável",
    description:
      "Exporte o Dossiê de Integridade consolidado em PDF pronto para juntada nos autos do pregão eletrônico, com QR Code de validação pública para a comissão de licitação.",
    badge: "Pronto para Apresentação",
    color: "blue",
    features: [
      "Relatório técnico padronizado para órgãos públicos",
      "QR Code para conferência instantânea por pregoeiros",
      "Demonstração cabal de conformidade com a Lei nº 14.133",
    ],
    mockup: {
      type: "dossie",
      titulo: "Dossiê Probatório de Integridade",
      formato: "PDF A4 com Assinatura Digital",
      qrcode: "Validação Pública Ativa",
    },
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HERO DA PÁGINA */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>METODOLOGIA OBJETIVA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Do diagnóstico ao dossiê,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200">
              em poucos passos.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Elimine o improviso e o receio de inabilitação. Veja como o TechCompliance transforma o rigor das exigências legais em um processo simples, seguro e auditável para sua empresa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <CheckoutButton
              label="Acessar versão demo"
              showIcon={false}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 text-sm"
            />
            <Link
              href="/diagnostico"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 transition-all text-sm"
            >
              Fazer diagnóstico gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* FLUXO PASSO A PASSO DETALHADO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16">
        {STEPS.map((s, idx) => (
          <div
            key={s.step}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Informações da Etapa */}
            <div className={`lg:col-span-7 space-y-5 ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-lg shadow-blue-600/30">
                  {s.step}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {s.badge}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{s.title}</h2>
                <h3 className="text-sm font-semibold text-blue-300 mt-1">{s.subtitle}</h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{s.description}</p>

              <div className="space-y-2 pt-1">
                {s.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup / Card Visual da Etapa */}
            <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/60 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl pointer-events-none" />

                {/* Conteúdo específico por tipo de mockup */}
                {s.mockup.type === "cnpj" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-slate-500 uppercase text-[10px]">Consulta CNPJ</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-sans font-bold text-[10px]">
                        {s.mockup.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px]">{s.mockup.cnpj}</div>
                      <div className="text-white font-bold text-sm font-sans">{s.mockup.razao}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
                      ✓ Situação Cadastral Regular na Receita Federal
                    </div>
                  </div>
                )}

                {s.mockup.type === "diagnostico" && (
                  <div className="text-center space-y-3 py-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Maturidade Documental</div>
                    <div className="text-5xl font-black text-emerald-400 font-mono">{s.mockup.score}</div>
                    <div className="text-xs font-bold text-white bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">
                      {s.mockup.nivel}
                    </div>
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                      {s.mockup.atendidos}
                    </div>
                  </div>
                )}

                {s.mockup.type === "pendencias" && (
                  <div className="space-y-3">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Status de Regularização</div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-400">{s.mockup.criticas}</span>
                        <span className="text-amber-400">{s.mockup.orientacoes}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-4/5" />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">{s.mockup.status}</p>
                  </div>
                )}

                {s.mockup.type === "evidencias" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Evidências Auditáveis</div>
                    <div className="space-y-1.5">
                      {s.mockup.itens?.map((it) => (
                        <div key={it} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">{it}</span>
                          <span className="text-emerald-400 font-bold">✓ Válido</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-blue-300 font-sans font-semibold text-center pt-1">
                      {s.mockup.seguranca}
                    </div>
                  </div>
                )}

                {s.mockup.type === "edital" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Confronto por IA</div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="text-slate-300 font-bold truncate">{s.mockup.nome}</div>
                      <div className="text-emerald-400 font-bold text-sm">{s.mockup.aderencia}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-300 text-[11px] text-center border border-blue-500/20">
                      {s.mockup.resultado}
                    </div>
                  </div>
                )}

                {s.mockup.type === "dossie" && (
                  <div className="text-center space-y-3 py-2">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl w-fit mx-auto">
                      <FileDown className="w-8 h-8" />
                    </div>
                    <div className="font-bold text-white text-sm">{s.mockup.titulo}</div>
                    <div className="text-[11px] text-slate-400">{s.mockup.formato}</div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">
                      {s.mockup.qrcode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* BANNER CTA INFERIOR */}
      <section className="py-16 px-4 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-black text-white">
            Pronto para colocar a integridade da sua empresa em prática?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Comece hoje mesmo a organizar suas evidências e evite riscos em pregões e contratações públicas.
          </p>
          <div className="pt-2">
            <CheckoutButton
              label="Acessar versão demo"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 text-sm inline-flex items-center gap-2"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
