"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileDown,
  ShieldCheck,
  Users,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  ExternalLink,
  Search,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Calendar,
  Sparkles,
  Lock,
  History,
  FileText,
  MapPin,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { evaluateCompanyCompliance } from "@/lib/compliance-engine";
import { generateDossierPDF } from "@/lib/pdf-generator";
import { formatCNPJ } from "@/lib/utils";
import { CompliancePendingItem } from "@/types/compliance";

export default function DashboardOverviewPage() {
  const company = mockStore.getCompany();
  const metrics = mockStore.getComplianceMetrics();
  const employees = mockStore.getEmployees();
  const reports = mockStore.getReports(company.id);
  const policy = mockStore.getPolicy();

  // Motor dinâmico de conformidade
  const diagnostic = evaluateCompanyCompliance(company.id);

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleGenerateDossier = async () => {
    setGeneratingPdf(true);
    try {
      await generateDossierPDF();
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // 6 Áreas estruturadas do Programa com evidências e pendências mapeadas
  const programAreas = [
    {
      title: "Código & Conduta",
      href: "/dashboard/politicas",
      score: 100,
      statusBadge: "Vigente v1.2",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      mainEvidence: `Código com 15 seções aprovado e vigente (${new Date(policy.updated_at).toLocaleDateString("pt-BR")})`,
      mainPending: null,
    },
    {
      title: "Treinamentos",
      href: "/dashboard/colaboradores",
      score: metrics.trainingRate || 87,
      statusBadge: metrics.trainingRate >= 80 ? "Alto Nível" : "Em Andamento",
      badgeColor: metrics.trainingRate >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200",
      mainEvidence: `${mockStore.employeeTrainings.length} certificados emitidos com hash de autenticidade`,
      mainPending: employees.filter(e => mockStore.getEmployeeCertificates(e.id).length === 0).length > 0 
        ? `${employees.filter(e => mockStore.getEmployeeCertificates(e.id).length === 0).length} colaboradores pendentes de conclusão`
        : null,
    },
    {
      title: "Canal de Denúncias",
      href: "/dashboard/denuncias",
      score: 100,
      statusBadge: "Ativo 24/7",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      mainEvidence: `Canal externo /canal/${company.slug} com garantia de sigilo e não retaliação`,
      mainPending: null,
    },
    {
      title: "Gestão de Terceiros",
      href: "/dashboard/due-diligence",
      score: 85,
      statusBadge: "CEIS / CNEP",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      mainEvidence: "Consultas de parceiros e subcontratados em bases oficiais (CEIS, CNEP, PEP e MTE)",
      mainPending: "4 fornecedores cadastrados aguardando renovação de certidões",
    },
    {
      title: "Controles Internos",
      href: "/dashboard/diagnostico",
      score: 75,
      statusBadge: "Em Maturação",
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      mainEvidence: "Matriz de riscos e segregação de funções definida na Diretoria",
      mainPending: "Formalizar manuais de conferência fiscal específica para licitações",
    },
    {
      title: "Monitoramento",
      href: "/dashboard/diagnostico",
      score: 80,
      statusBadge: "Dossiê Ativo",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      mainEvidence: `${diagnostic.total_evidences} evidências auditáveis consolidadas no repositório`,
      mainPending: "Revisão periódica programada para o próximo semestre",
    },
  ];

  // Helper de badge para severidade de pendência
  const getSeverityBadge = (severity: CompliancePendingItem["severity"]) => {
    switch (severity) {
      case "CRITICA":
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200 uppercase">🔴 Crítico</span>;
      case "ALERTA":
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 uppercase">🟠 Alta Prioridade</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 uppercase">🟡 Atenção</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12">
      
      {/* 1. HERO PRINCIPAL: Central de Controle do Programa */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Central de Controle do Programa de Integridade • Lei 14.133/2021
          </div>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-2">
              Status de Preparação: <span className="text-emerald-400 font-mono">{diagnostic.overall_score}%</span> estruturado
            </h1>
            <p className="text-sm font-semibold text-slate-300 mt-1">
              <span className="text-emerald-300 font-bold">{diagnostic.met_count} de {diagnostic.total_requirements} requisitos atendidos</span> no padrão exigido em contratações públicas.
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            * Indicador de maturidade documental e evidencial do Programa de Integridade da empresa, avaliado perante a Lei nº 14.133/2021 e Decreto nº 11.129/2022. Não constitui certificação oficial nem garantia jurídica automática.
          </p>

          <div className="pt-1">
            <Link
              href="/dashboard/diagnostico"
              className="text-xs font-bold text-blue-300 hover:text-blue-200 underline flex items-center gap-1.5 transition-colors"
            >
              <span>Entender este resultado no Diagnóstico de Requisitos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
          <Link
            href="/dashboard/analise-edital"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Analisar Edital</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleGenerateDossier}
            disabled={generatingPdf}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{generatingPdf ? "Compilando Dossiê..." : "Gerar Dossiê de Evidências (PDF)"}</span>
          </button>
        </div>
      </div>

      {/* PERFIL CADASTRAL OFICIAL DA EMPRESA (ENRIQUECIDO PELO CNPJ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{company.trade_name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {company.status || "ATIVA"}
                </span>
                {company.company_size && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Porte: {company.company_size}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xl">
                {company.legal_name} • CNPJ: <span className="font-mono font-bold text-slate-700">{formatCNPJ(company.cnpj)}</span>
              </p>
            </div>
          </div>

          <Link
            href="/cadastro"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Atualizar via CNPJ</span>
          </Link>
        </div>

        {/* Informações detalhadas sincronizadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Endereço */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Endereço Oficial
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {company.full_address || `${company.city || "São Paulo"}/${company.state || "SP"}`}
            </p>
          </div>

          {/* Atividade Econômica / CNAE */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Atividade Econômica
            </div>
            <p className="text-slate-700 leading-relaxed font-medium line-clamp-2">
              {company.main_cnae_code ? `${company.main_cnae_code} - ` : ""}
              {company.main_cnae_description || "Transporte rodoviário e logística especializada"}
            </p>
          </div>

          {/* Governança e Responsáveis */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Responsável Integridade
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900">{company.integrity_officer_name || "Diretoria de Compliance"}</strong>
              {company.integrity_officer_phone ? ` • ${company.integrity_officer_phone}` : ""}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {company.integrity_officer_email || "compliance@empresa.com.br"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 4 CARDS ACIONÁVEIS COM LINKS DIRETOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Requisitos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Requisitos Avaliados
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {diagnostic.total_requirements}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {diagnostic.met_count} atendidos integralmente
            </p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            <span>Ver requisitos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Evidências */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evidências Registradas
            </div>
            <div className="text-3xl font-black text-blue-900 mt-2 font-mono">
              {diagnostic.total_evidences}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Políticas, certificados, atas e logs
            </p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            <span>Ver evidências</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Pontos de Atenção */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pontos de Atenção
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2 font-mono">
              {diagnostic.partial_count}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Itens parciais em monitoramento
            </p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            <span>Ver atenção</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Pendências */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-700">
              Pendências
            </div>
            <div className="text-3xl font-black text-red-600 mt-2 font-mono">
              {diagnostic.pending_count}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ações necessárias para conformidade
            </p>
          </div>
          <a
            href="#proximas-acoes"
            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            <span>Resolver pendências</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. BARRA DE DISTRIBUIÇÃO DO PROGRAMA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Como está o seu Programa de Integridade?</h3>
            <p className="text-xs text-slate-500">Distribuição analítica dos {diagnostic.total_requirements} requisitos mapeados.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Atualizado em: {new Date(diagnostic.evaluated_at).toLocaleDateString("pt-BR")}
          </span>
        </div>

        {/* Barra de progresso segmentada */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(diagnostic.met_count / diagnostic.total_requirements) * 100}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`${diagnostic.met_count} Atendidos`}
          />
          <div
            style={{ width: `${(diagnostic.partial_count / diagnostic.total_requirements) * 100}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`${diagnostic.partial_count} Parciais`}
          />
          <div
            style={{ width: `${(diagnostic.pending_count / diagnostic.total_requirements) * 100}%` }}
            className="bg-red-500 h-full transition-all"
            title={`${diagnostic.pending_count} Pendentes`}
          />
        </div>

        {/* Legendas clicáveis */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
          <Link
            href="/dashboard/diagnostico"
            className="flex items-center gap-1.5 hover:underline font-semibold text-slate-700"
          >
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>🟢 Atendidos: <strong>{diagnostic.met_count}</strong></span>
          </Link>

          <Link
            href="/dashboard/diagnostico"
            className="flex items-center gap-1.5 hover:underline font-semibold text-slate-700"
          >
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span>🟡 Parciais: <strong>{diagnostic.partial_count}</strong></span>
          </Link>

          <a
            href="#proximas-acoes"
            className="flex items-center gap-1.5 hover:underline font-semibold text-slate-700"
          >
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span>🔴 Pendentes: <strong>{diagnostic.pending_count}</strong></span>
          </a>

          <span className="flex items-center gap-1.5 font-semibold text-slate-400 ml-auto">
            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
            <span>⚪ Não aplicáveis: <strong>0</strong></span>
          </span>
        </div>
      </div>

      {/* 4. ÁREAS DO PROGRAMA COM EVIDÊNCIA E PENDÊNCIA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Áreas Estruturantes do Programa de Integridade</h2>
            <p className="text-xs text-slate-500">Acompanhamento detalhado com percentual, principal evidência e pendências abertas.</p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Matriz Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{area.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${area.badgeColor}`}>
                    {area.statusBadge}
                  </span>
                </div>
                
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">{area.score}%</span>
                  <span className="text-[11px] text-slate-500">conformidade estimada</span>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="text-slate-600 flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span className="line-clamp-2"><strong>Evidência:</strong> {area.mainEvidence}</span>
                  </div>
                  {area.mainPending ? (
                    <div className="text-amber-800 flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">!</span>
                      <span className="line-clamp-2"><strong>Atenção:</strong> {area.mainPending}</span>
                    </div>
                  ) : (
                    <div className="text-emerald-700 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>Sem pendências críticas abertas</span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={area.href}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between pt-2 border-t border-slate-200/70"
              >
                <span>Ver detalhes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SEÇÃO: PREPARAÇÃO PARA UMA LICITAÇÃO ESPECÍFICA */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-blue-300" />
            Módulo Estratégico de Licitações
          </div>
          <h3 className="text-lg sm:text-xl font-bold">Prepare sua Empresa para uma Licitação Específica</h3>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Envie o edital para identificar automaticamente as exigências relacionadas ao Programa de Integridade (Art. 25 da Lei 14.133 e NR-1) e comparar com as evidências disponíveis na sua empresa antes da sessão pública.
          </p>
          
          {/* Card de Preview do Último Edital Analisado */}
          <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/10 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-emerald-300">📄 Edital_Pregao_TRF_42_2026.pdf:</span>
            <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">8 identificados</span>
            <span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">7 atendidos</span>
            <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-mono font-bold">1 complementar</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            href="/dashboard/analise-edital"
            className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>[ ANALISAR EDITAL ]</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/analise-edital"
            className="border border-blue-300/40 hover:bg-blue-800/40 text-blue-100 font-bold px-4 py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ver análise completa</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 6. CENTRAL DE PENDÊNCIAS: PRÓXIMAS AÇÕES (PRIORIZADAS) */}
      <div id="proximas-acoes" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">🎯 Próximas Ações do Programa</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                {diagnostic.pending_items.length} itens priorizados
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ações recomendadas por severidade e impacto direto na comprovação perante a Administração Pública.
            </p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver todas no Diagnóstico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostic.pending_items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(item.severity)}
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{item.requirement_id}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{item.action_label}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] space-y-1">
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Impacto:</strong> Reduz o nível de evidência e a pontuação técnica exigida no edital.
                  </div>
                  <div className="text-blue-700">
                    <strong className="text-blue-900">O que fazer:</strong> Concluir a ação recomendada para elevar o status a &quot;Atendido&quot;.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <Link
                  href={item.action_href}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{item.action_label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. BANNER LINK ÚNICO DE CAPACITAÇÃO WHATSAPP */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span className="p-1 rounded bg-emerald-500/20">📱</span>
            Link Único para Treinar a Equipe no Celular (Sem Cadastro Prévio)
          </div>
          <p className="text-xs text-slate-300">
            O gestor não precisa cadastrar nome por nome. Basta copiar este link e colar no grupo de WhatsApp da sua equipe:
          </p>
          <div className="text-xs font-mono text-emerald-300 font-bold bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
            /treinar/{company.slug}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              const url = `${typeof window !== "undefined" ? window.location.origin : ""}/treinar/${company.slug}`;
              navigator.clipboard.writeText(url);
              alert("Link Único copiado com sucesso! Pode colar no WhatsApp da equipe.");
            }}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            Copiar Link da Equipe
          </button>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Atenção equipe: acessem o link da nossa empresa para a capacitação rápida de 3 minutos em Integridade e NR-1 (com emissão de certificado na hora): ${typeof window !== "undefined" ? window.location.origin : ""}/treinar/${company.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all text-center"
          >
            Enviar no WhatsApp
          </a>
        </div>
      </div>

      {/* 8. CARDS OPERACIONAIS DE INDICADORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Colaboradores */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Colaboradores</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900">{metrics.totalEmployees}</div>
            <div className="text-xs text-slate-500 mt-0.5">Cadastrados no programa</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link href="/dashboard/colaboradores" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              Gerenciar equipe <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Métrica 2: Aceite do Código */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Aceite da Política</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">{metrics.policyRate}%</div>
            <div className="text-xs text-slate-500 mt-0.5">{metrics.acceptedPolicies} de {metrics.totalEmployees} assinaram termo</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${metrics.policyRate}%` }} />
          </div>
        </div>

        {/* Métrica 3: Treinamentos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Treinamento Concluído</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">{metrics.trainingRate}%</div>
            <div className="text-xs text-slate-500 mt-0.5">{metrics.completedTrainings} certificados emitidos</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${metrics.trainingRate}%` }} />
          </div>
        </div>

        {/* Métrica 4: Canal de Denúncias */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Canal de Denúncias</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900">{metrics.totalReports}</div>
            <div className="text-xs text-slate-500 mt-0.5">{metrics.resolvedReports} chamados apurados</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link href="/dashboard/denuncias" className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1">
              Ver relatos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 9. SEÇÃO: MONITORAMENTO DO PROGRAMA & ATIVIDADE RECENTE DE EVIDÊNCIAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed de Evidências Recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Evidências Geradas Recentemente</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Auditável
                </span>
              </div>
              <p className="text-xs text-slate-500">Registro cronológico de certificações, consultas e aprovações do programa.</p>
            </div>
            <Link
              href="/dashboard/diagnostico"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Ver repositório</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Evidência 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Treinamento Concluído: Microlearning de Integridade</div>
                  <div className="text-[11px] text-slate-500">Colaborador: {employees[0]?.full_name || "João Silva"} • Certificado emitido</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Hash SHA-256: 7f8a3c...e42b • Base Legal: Lei 14.133/2021</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">Hoje</span>
            </div>

            {/* Evidência 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Due Diligence de Terceiro Realizada</div>
                  <div className="text-[11px] text-slate-500">Fornecedor: Beta Engenharia e Manutenção Ltda • Nada Consta</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Consultas: CEIS, CNEP, PEP e Lista Suja MTE</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">Ontem</span>
            </div>

            {/* Evidência 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Código de Conduta Licitatória Aprovado</div>
                  <div className="text-[11px] text-slate-500">Versão v1.2 homologada com 15 seções temáticas completas</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Ato da Diretoria • Vigência 2026/2027</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">10/09/2026</span>
            </div>
          </div>
        </div>

        {/* Coluna 3: Monitoramento do Programa (Ouvidoria & NR-1) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Monitoramento do Programa</h2>
                <p className="text-xs text-slate-500">Ocorrências e relatos confidenciais.</p>
              </div>
              <Link
                href="/dashboard/denuncias"
                className="text-xs font-semibold text-red-600 hover:text-red-800"
              >
                Gerenciar
              </Link>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-slate-900">{r.protocol}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Sigilo e RLS Ativo
            </div>
            <p>Os registros do canal são isolados por tenant com criptografia e sem rastreamento de IP para denunciantes anônimos.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

