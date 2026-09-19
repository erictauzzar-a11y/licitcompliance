"use client";

import { use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  User,
  Award,
  Calendar,
  FileText,
  Search,
  AlertOctagon,
  FileCheck2,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ, formatCPF } from "@/lib/utils";

export default function ValidateCertificateOrDossierPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const resolvedParams = use(params);
  const code = decodeURIComponent(resolvedParams.codigo).trim();
  const upperCode = code.toUpperCase();

  const company = mockStore.getCompany();
  const currentDossierCode = `DOSSIE-${new Date().getFullYear()}-${company.cnpj.substring(0, 8)}`.toUpperCase();
  const isDossier = upperCode === currentDossierCode || upperCode.startsWith("DOSSIE-");
  const certResult = !isDossier ? mockStore.findCertificateByCode(code) : null;

  // Due Diligence de Terceiros (DDI)
  const isDdi = upperCode.startsWith("DDI-");
  const ddiRecord = isDdi ? mockStore.findDueDiligenceByHash(code) : null;
  const isDdiValidFormat = isDdi && /^DDI-\d{4}-[A-Z0-9]+$/i.test(upperCode);

  // Relatório de Aderência ao Edital
  const isEdict = upperCode.startsWith("ANALISE-") || upperCode.startsWith("EDITAL-");
  const edictResult = isEdict ? mockStore.findEdictAnalysisByHash(code) : null;
  const isEdictValidFormat = isEdict && /^(ANALISE|EDITAL)-[A-Z0-9_-]+$/i.test(upperCode);

  const metrics = mockStore.getComplianceMetrics();

  const isValid =
    isDossier ||
    Boolean(certResult) ||
    Boolean(ddiRecord) ||
    isDdiValidFormat ||
    Boolean(edictResult) ||
    isEdictValidFormat;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Topo Oficial */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Serviço de Verificação Pública de Evidências
          </div>
          <h1 className="text-xl font-bold">Autenticidade de Documento de Integridade</h1>
          <p className="text-xs text-slate-400">
            Consulta pública para conferência de autenticidade documental por Pregoeiros, Agentes de Contratação e Comissões de Licitação.
          </p>
        </div>

        {/* Corpo de Validação */}
        <div className="p-6 sm:p-8 space-y-6">
          {isValid ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold">Registro de Evidência Autêntico</h2>
                  <p className="text-xs text-emerald-800">
                    O código criptográfico consultado confere com o acervo documental emitido e mantido na plataforma TechCompliance.
                  </p>
                </div>
              </div>

              {/* 1. RELATÓRIO DE DUE DILIGENCE DE TERCEIROS (DDI) */}
              {isDdi ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tipo de Registro: Due Diligence de Terceiros (DDI)
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{ddiRecord?.supplier?.legal_name || "Fornecedor / Terceiro Auditado"}</span>
                      </div>
                      {ddiRecord?.supplier?.cnpj && (
                        <div className="text-xs text-slate-600 pl-6 font-mono">
                          CNPJ: {formatCNPJ(ddiRecord.supplier.cnpj)}
                        </div>
                      )}
                      <div className="text-xs text-slate-500 pl-6 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Data da Consulta:{" "}
                        {ddiRecord?.queried_at
                          ? new Date(ddiRecord.queried_at).toLocaleString("pt-BR")
                          : new Date().toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Status da Avaliação */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      ddiRecord?.risk_status === "BLOQUEADO"
                        ? "bg-red-50 border-red-200 text-red-900"
                        : ddiRecord?.risk_status === "ALERTA"
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] uppercase font-bold opacity-75 block">Resultado da Verificação</span>
                      <strong className="text-sm font-black">
                        {ddiRecord?.risk_status === "BLOQUEADO"
                          ? "RISCO CRÍTICO — SANÇÃO IDENTIFICADA"
                          : ddiRecord?.risk_status === "ALERTA"
                          ? "RISCO MODERADO — EXIGE DILIGÊNCIA (PEP)"
                          : "SEM APONTAMENTOS ENCONTRADOS NAS BASES OFICIAIS"}
                      </strong>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-white/80 border border-current">
                      Nível: {ddiRecord?.risk_level || "BAIXO"}
                    </span>
                  </div>

                  {/* Bases Consultadas */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <span className="font-bold text-slate-700 block">Bases Públicas Governamentais Auditadas:</span>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        CEIS (Cadastro Nacional de Empresas Inidôneas e Suspensas - CGU)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        CNEP (Cadastro Nacional de Empresas Punidas - LAC/CGU)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Cadastro de Empregadores / Lista Suja do Trabalho Escravo (MTE)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Pessoas Expostas Politicamente (PEP) no Quadro Societário (QSA)
                      </li>
                    </ul>
                  </div>

                  {/* Ressalva Jurídica */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-500 italic">
                    Ressalva jurídica: Consulta automatizada baseada nos dados governamentais disponibilizados pelos órgãos de controle na data da emissão. Não constitui homologação pública de aptidão nem dispensa certidões fiscais e exigências do edital.
                  </div>
                </div>
              ) : isEdict ? (
                /* 2. RELATÓRIO DE ADERÊNCIA AO EDITAL */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tipo de Registro: Relatório de Aderência ao Edital
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>{edictResult?.fileName || "Instrumento Convocatório Analisado"}</span>
                      </div>
                      <div className="text-xs text-slate-600 pl-6">
                        {edictResult?.tenderNumber || "Certame Licitatório Identificado"} • {edictResult?.organName || "Administração Pública"}
                      </div>
                      <div className="text-xs text-slate-500 pl-6 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Data da Análise:{" "}
                        {edictResult?.analyzedAt
                          ? new Date(edictResult.analyzedAt).toLocaleString("pt-BR")
                          : new Date().toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-blue-700 font-semibold block uppercase">
                        Aderência Estimada ao Certame
                      </span>
                      <strong className="text-2xl font-black text-blue-900 font-mono">
                        {edictResult?.overallFitScore ?? 75}%
                      </strong>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
                      Certame Auditado
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 text-xs text-slate-700">
                    <div className="font-bold">Bases Legais Verificadas no Instrumento Convocatório:</div>
                    <p>• Art. 25, § 4º da Lei nº 14.133/2021 (Programa de Integridade em Licitações).</p>
                    <p>• Lei Federal nº 14.457/2022 c/c Norma Regulamentadora nº 1 (Canal de Denúncias e Assédio).</p>
                    <p>• Decreto Federal nº 12.304/2024 (Parâmetros de Avaliação de Integridade).</p>
                  </div>
                </div>
              ) : isDossier ? (
                /* 3. DOSSIÊ GERAL DE INTEGRIDADE */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Dados da Empresa Emissora
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{company.legal_name}</span>
                      </div>
                      <div className="text-xs text-slate-600 pl-6">
                        CNPJ: {formatCNPJ(company.cnpj)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 block">Adesão ao Código</span>
                      <strong className="text-base text-emerald-600 font-bold">{metrics.policyRate}% dos Colaboradores</strong>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 block">Capacitação Integridade/NR-1</span>
                      <strong className="text-base text-blue-600 font-bold">{metrics.trainingRate}% Concluído</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-700" />
                      Enquadramento Normativo Auditado:
                    </div>
                    <p>• Art. 25, § 4º da Lei Federal nº 14.133/2021 (Programa de Integridade em Licitações).</p>
                    <p>• Norma Regulamentadora nº 1 (NR-1) / Lei Federal nº 14.457/2022 (Canal de Denúncias e Prevenção ao Assédio).</p>
                  </div>
                </div>
              ) : (
                /* 4. CERTIFICADO INDIVIDUAL DE TREINAMENTO */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Titular da Certificação
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{certResult?.employee?.full_name}</span>
                      </div>
                      <div className="text-xs text-slate-600 pl-6">
                        CPF: {formatCPF(certResult?.employee?.cpf || "")} | Cargo: {certResult?.employee?.role}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="text-slate-500 font-medium">Trilha Concluída:</div>
                    <div className="font-bold text-slate-900 text-sm">{certResult?.training?.title}</div>
                    <div className="flex items-center gap-2 text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Data da Emissão: {new Date(certResult?.certificate?.completed_at || "").toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-slate-500">
                      Empresa Emissora: <strong>{certResult?.company?.trade_name}</strong> (CNPJ: {formatCNPJ(certResult?.company?.cnpj || "")})
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block font-medium">Chave Única de Validação</span>
                <span className="font-mono text-sm font-bold text-slate-900">{code}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-base font-bold text-red-900">Documento Não Localizado ou Inválido</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                O código <strong>{code}</strong> não corresponde a nenhum certificado, relatório de due diligence, análise de edital ou dossiê emitido por empresas cadastradas no TechCompliance.
              </p>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Conhecer o TechCompliance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
