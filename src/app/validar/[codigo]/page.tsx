"use client";

import { use } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, AlertTriangle, Building2, User, Award, Calendar, FileText } from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ, formatCPF } from "@/lib/utils";

export default function ValidateCertificateOrDossierPage({ params }: { params: Promise<{ codigo: string }> }) {
  const resolvedParams = use(params);
  const code = decodeURIComponent(resolvedParams.codigo).trim();

  const company = mockStore.getCompany();
  const currentDossierCode = `DOSSIE-${new Date().getFullYear()}-${company.cnpj.substring(0, 8)}`.toUpperCase();
  const isDossier = code.toUpperCase() === currentDossierCode;
  const certResult = !isDossier ? mockStore.findCertificateByCode(code) : null;
  const metrics = mockStore.getComplianceMetrics();

  const isValid = isDossier || !!certResult;

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
            Consulta pública para conferência de autenticidade documental por Pregoeiros, Agentes de Contratação e Comissões.
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
                    O código criptográfico consultado confere com o acervo documental registrado e mantido na plataforma pela empresa emissora.
                  </p>
                </div>
              </div>

              {isDossier ? (
                /* VALIDAÇÃO DO DOSSIÊ GERAL */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Dados da Empresa Fornecedora
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
                /* VALIDAÇÃO DO CERTIFICADO INDIVIDUAL */
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
                O código <strong>{code}</strong> não corresponde a nenhum certificado ou dossiê emitido por empresas cadastradas no TechCompliance.
              </p>
            </div>
          )}

          <div className="pt-2">
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
