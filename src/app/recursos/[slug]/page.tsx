import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  AlertTriangle,
  FileCheck2,
  Users,
  Lock,
  Search,
  FileDown,
  Award,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutButton } from "@/components/CheckoutButton";
import { RESOURCES_ITEMS } from "@/config/navigation";

interface ResourceDetail {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  image?: string;
  technicalCapabilities: string[];
  howItOperates: string[];
  associatedDashboardRoute: string;
}

const RESOURCES_DATA: Record<string, ResourceDetail> = {
  dashboard: {
    slug: "dashboard",
    title: "Dashboard de Conformidade",
    subtitle: "Visão 360º de maturidade, pendências e acervo comprobatório",
    badge: "Módulo Central",
    description:
      "A central de controle do TechCompliance consolida todos os indicadores da sua empresa em um único painel executivo: percentual de preparação perante a Lei 14.133, pendências prioritárias e ações imediatas.",
    image: "/screen-visao-geral.png",
    technicalCapabilities: [
      "Status de Preparação consolidado com percentual de requisitos atendidos",
      "Consulta automática de dados cadastrais e regularidade do CNPJ",
      "Mapeamento de responsáveis internos pelo programa de integridade",
      "Acesso com um clique para análise de editais e geração de dossiês",
    ],
    howItOperates: [
      "1. Acesso protegido com autenticação e isolamento multi-tenant",
      "2. Atualização automática dos cards de alerta e pendências",
      "3. Disparo de lembretes antes do vencimento de certidões e políticas",
    ],
    associatedDashboardRoute: "/dashboard",
  },
  diagnostico: {
    slug: "diagnostico",
    title: "Diagnóstico de Requisitos",
    subtitle: "Detalhamento pilar por pilar da conformidade com a Lei 14.133 e NR-1",
    badge: "Auditoria Contínua",
    description:
      "Mapeamento técnico contínuo dos 32 requisitos normativos federais. Cada obrigação legal é vinculada às evidências auditáveis cadastradas pela empresa, gerando um índice de maturidade transparente.",
    image: "/screen-diagnostico.png",
    technicalCapabilities: [
      "Controle percentual individualizado por pilar (Código, Treinamentos, Canal)",
      "Detecção automática de ausência de evidências vinculadas",
      "Classificação entre requisitos plenamente atendidos e parciais",
      "Histórico de evolução da maturidade da empresa ao longo do tempo",
    ],
    howItOperates: [
      "1. O gestor visualiza os 32 itens previstos na legislação licitatória",
      "2. Vincula os documentos comprobatórios ou preenche questionários",
      "3. O sistema calcula a pontuação oficial sem necessidade de planilhas",
    ],
    associatedDashboardRoute: "/dashboard/diagnostico",
  },
  pendencias: {
    slug: "pendencias",
    title: "Gestão de Pendências",
    subtitle: "Planos de ação objetivos para regularização prévia a certames",
    badge: "Governança Ágil",
    description:
      "Evite inabilitações surpresa no pregão. O sistema identifica lacunas regulatórias e gera planos de ação diretos para o gestor sanar cada item com facilidade.",
    technicalCapabilities: [
      "Separação entre pendências críticas e orientações de melhoria",
      "Modelos padrão para download e personalização instantânea",
      "Definição de prazos internos e responsáveis por regularização",
    ],
    howItOperates: [
      "1. O motor aponta o que está pendente para atingir 100% de conformidade",
      "2. O usuário baixa o modelo sugerido (ex: termo de compromisso)",
      "3. Faz upload da versão assinada e o sistema valida a baixa da pendência",
    ],
    associatedDashboardRoute: "/dashboard/diagnostico",
  },
  evidencias: {
    slug: "evidencias",
    title: "Acervo de Evidências",
    subtitle: "Centralização de comprovantes com carimbo de tempo imutável",
    badge: "Criptografia SHA-256",
    description:
      "Armazene atas, certificados, termos de adesão e registros com segurança e integridade criptográfica auditável perante comissões de licitação.",
    technicalCapabilities: [
      "Geração de hash SHA-256 no momento do upload",
      "Controle de datas de emissão e prazos de validade",
      "Organização categorizada por pilar e requisito correspondente",
    ],
    howItOperates: [
      "1. Documentos são enviados para storage seguro com isolamento de tenant",
      "2. O hash criptográfico é registrado no banco de dados imutável",
      "3. O link é embutido no Dossiê Probatório para consulta externa",
    ],
    associatedDashboardRoute: "/dashboard/politicas",
  },
  treinamentos: {
    slug: "treinamentos",
    title: "Módulo de Treinamentos",
    subtitle: "Capacitação contínua da equipe em compliance e combate ao assédio",
    badge: "Conformidade NR-1",
    description:
      "Cursos rápidos autoguiados para colaboradores sobre assédio moral/sexual e lealdade concorrencial, com geração automática de atas e listas de presença.",
    technicalCapabilities: [
      "Página exclusiva de treinamento com link compartilhável para a equipe",
      "Questionário de fixação com nota de aprovação",
      "Certificados individuais com código de validação pública",
      "Relatório gerencial com percentual da equipe capacitada",
    ],
    howItOperates: [
      "1. O gestor cadastra os colaboradores ou compartilha o link de treinamento",
      "2. O colaborador assiste ao conteúdo e responde à avaliação",
      "3. A ata de treinamento é gerada automaticamente como evidência válida",
    ],
    associatedDashboardRoute: "/dashboard/colaboradores",
  },
  "canal-de-denuncias": {
    slug: "canal-de-denuncias",
    title: "Canal de Denúncias Seguro",
    subtitle: "Canal externo e independente com protocolo de acompanhamento",
    badge: "Anonimato Garantido",
    description:
      "Canal de escuta independente, acessível ao público externo e interno, cumprindo integralmente as exigências da Lei nº 14.457/2022 e NR-1.",
    technicalCapabilities: [
      "Página externa personalizada da empresa sem captura de IP",
      "Protocolo alfanumérico seguro para o denunciante acompanhar o andamento",
      "Painel de governança para apuração interna com sigilo estrito",
    ],
    howItOperates: [
      "1. O relato é registrado de forma anônima ou identificada",
      "2. O compliance recebe a notificação e inicia a apuração fundamentada",
      "3. Relatórios estatísticos são gerados sem expor a identidade das partes",
    ],
    associatedDashboardRoute: "/dashboard/denuncias",
  },
  "analise-edital": {
    slug: "analise-edital",
    title: "Confronto de Editais por IA",
    subtitle: "Motor inteligente para leitura de termos de referência e editais",
    badge: "Inteligência Artificial",
    description:
      "Descubra em segundos o que o edital exige de Programa de Integridade e o que sua empresa já possui organizado para apresentar no certame.",
    image: "/screen-analisar-edital.png",
    technicalCapabilities: [
      "Extração inteligente de exigências de habilitação jurídica em PDFs",
      "Cruzamento automatizado contra as evidências salvas na plataforma",
      "Diagnóstico preventivo de riscos antes da data do pregão",
    ],
    howItOperates: [
      "1. O usuário faz upload do arquivo do edital",
      "2. A IA identifica as cláusulas relacionadas à integridade e compliance",
      "3. Apresenta o relatório de compatibilidade com os documentos da empresa",
    ],
    associatedDashboardRoute: "/dashboard/analise-edital",
  },
  dossie: {
    slug: "dossie",
    title: "Dossiê Probatório em PDF",
    subtitle: "Documento oficial estruturado para anexar à proposta licitatória",
    badge: "Padrão de Apresentação",
    description:
      "Gere o relatório probatório com índice de conformidade, sumário executivo, atesto de autenticidade e QR Code de verificação pública imediata.",
    technicalCapabilities: [
      "Diagramação profissional aceita por órgãos federais, estaduais e municipais",
      "QR Code exclusivo apontando para a página pública de validação",
      "Carimbo de data, versão e responsabilidade técnica",
    ],
    howItOperates: [
      "1. Clique em 'Gerar Dossiê de Evidências' no painel",
      "2. O sistema compila os dados, gráficos e hashes em um arquivo PDF",
      "3. Anexe o arquivo na sua proposta no portal de compras públicas",
    ],
    associatedDashboardRoute: "/dashboard",
  },
  "validacao-publica": {
    slug: "validacao-publica",
    title: "Validação Pública por QR Code",
    subtitle: "Conferência online instantânea para pregoeiros e comissões",
    badge: "Transparência Total",
    description:
      "Ao ler o QR Code do dossiê, a comissão de contratação acessa uma página oficial do TechCompliance confirmando a autenticidade e a vigência das informações.",
    technicalCapabilities: [
      "Página pública leve e responsiva com verificação criptográfica",
      "Exibição do status dos pilares sem expor dados sigilosos da empresa",
      "Atesto digital da data de emissão e hash SHA-256 do dossiê",
    ],
    howItOperates: [
      "1. O pregoeiro escaneia o QR Code ou digita o código de validação",
      "2. O sistema confirma que o dossiê foi emitido pela plataforma",
      "3. A idoneidade documental da empresa é atestada com rapidez",
    ],
    associatedDashboardRoute: "/dashboard",
  },
};

export function generateStaticParams() {
  return Object.keys(RESOURCES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = RESOURCES_DATA[slug];
  if (!res) return { title: "Recurso | TechCompliance" };
  return {
    title: `${res.title} | Recursos TechCompliance`,
    description: res.description,
  };
}

export default async function RecursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = RESOURCES_DATA[slug];

  if (!res) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      {/* HEADER DO RECURSO */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{res.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {res.title}
          </h1>

          <p className="text-blue-300 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            {res.subtitle}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {res.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/acessar-demo"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <span>Acessar versão demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/como-funciona"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 transition-all text-sm"
            >
              Como funciona o fluxo
            </Link>
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO VISUAL / SCREENSHOT REAL */}
      {res.image && (
        <section className="py-12 px-4 max-w-5xl mx-auto w-full">
          <div className="rounded-3xl p-3 sm:p-4 bg-slate-900/90 border border-slate-800 shadow-2xl shadow-blue-950/40">
            <div className="rounded-2xl overflow-hidden border border-slate-800 relative aspect-[1024/517] w-full">
              <Image
                src={res.image}
                alt={res.title}
                fill
                quality={95}
                className="object-cover object-top"
              />
            </div>
            <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Interface real do sistema no módulo de {res.title}</span>
            </div>
          </div>
        </section>
      )}

      {/* CAPACIDADES TÉCNICAS E OPERAÇÃO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Capacidades */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Capacidades Técnicas</span>
            </h3>
            <ul className="space-y-3">
              {res.technicalCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Como opera */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Como Opera na Prática</span>
            </h3>
            <ul className="space-y-3">
              {res.howItOperates.map((op) => (
                <li key={op} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE OUTROS RECURSOS */}
        <div className="pt-10 border-t border-slate-800">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-6">
            Outros recursos do TechCompliance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RESOURCES_ITEMS.filter((item) => item.href !== `/recursos/${res.slug}`)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-2 group"
                >
                  <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="py-16 px-4 bg-slate-900/70 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tenha acesso completo a todos os recursos do sistema
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Sem custos ocultos. Plano completo com suporte e atualizações inclusas.
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
