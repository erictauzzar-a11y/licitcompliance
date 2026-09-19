"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Save,
  CheckCircle2,
  ShieldCheck,
  History,
  Eye,
  Edit3,
  Scale,
  Calendar,
  UserCheck,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Info,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import { Policy, PolicyVersion, Employee } from "@/types";
import { evaluateCompanyCompliance } from "@/lib/compliance-engine";
import { updatePolicyAction } from "@/app/actions/management";
import { useCompany } from "@/contexts/CompanyContext";
import { getPolicyAction } from "@/app/actions/policies";
import { getEmployeesAction } from "@/app/actions/employees";

export default function PoliciesManagementPage() {
  const { company, isLoading: companyLoading, snapshot } = useCompany();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [publishToEmployees, setPublishToEmployees] = useState(true);
  const [activeTab, setActiveTab] = useState<"EDITAR" | "VISUALIZAR">("EDITAR");
  const [viewingVersion, setViewingVersion] = useState<PolicyVersion | null>(null);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega dados reais do Supabase quando empresa estiver disponível
  useEffect(() => {
    if (!company) return;
    setIsLoadingPolicy(true);
    setLoadError(null);

    getPolicyAction()
      .then((res) => {
        if (res.success && res.policy) {
          setPolicy(res.policy);
          setContent(res.policy.content);
          setTitle(res.policy.title);
        } else if (!res.success && res.error) {
          setLoadError(res.error);
        }
      })
      .catch((err) => {
        setLoadError("Falha de comunicação ao buscar política.");
      })
      .finally(() => {
        setIsLoadingPolicy(false);
      });

    getEmployeesAction().then((res) => {
      if (res.success) setEmployees(res.employees);
    });
  }, [company]);

  // Métricas calculadas com dados reais a partir do snapshot
  const diagnostic = company ? evaluateCompanyCompliance(company.id) : null;
  const codePillarScore = snapshot?.policyStats.pillarScore ?? (diagnostic?.pillars?.CODIGO_CONDUTA?.score ?? 100);
  const totalEmployees = snapshot ? snapshot.employeeStats.total : employees.length;
  const acceptedPolicies = snapshot ? snapshot.employeeStats.acceptedPolicies : employees.filter((e) => !!e.policy_accepted_at).length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updatePolicyAction(content, title, publishToEmployees);
    if (res.success && res.policy) {
      setPolicy({ ...res.policy });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (companyLoading || isLoadingPolicy || !policy) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse pb-12">
        <div className="h-14 w-80 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (loadError && !policy) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Não foi possível carregar as políticas</h2>
        <p className="text-xs text-slate-500">{loadError}</p>
        <button
          onClick={() => {
            if (company) {
              setIsLoadingPolicy(true);
              getPolicyAction().then((res) => {
                if (res.success && res.policy) {
                  setPolicy(res.policy);
                  setContent(res.policy.content);
                  setTitle(res.policy.title);
                }
                setIsLoadingPolicy(false);
              });
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* 1. CABEÇALHO PROFISSIONAL B2B */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Código de Conduta e Integridade
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Versão {policy.version} Ativa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Estabeleça e documente os princípios, vedações e regras de conduta da organização para fins probatórios em licitações e governança interna.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/diagnostico"
            className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Ver no Motor de Conformidade
          </Link>
        </div>
      </div>

      {/* 2. METADADOS E INFORMAÇÕES DA POLÍTICA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Status da Política</span>
          <strong className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {policy.is_active ? "Ativa & Vigente" : "Inativa"}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Versão Vigente</span>
          <strong className="text-xs font-mono font-bold text-slate-900 mt-1 block">
            v{policy.version}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Última Atualização</span>
          <strong className="text-xs font-bold text-slate-800 mt-1 block">
            {new Date(policy.updated_at).toLocaleDateString("pt-BR")}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Próxima Revisão</span>
          <strong className="text-xs font-bold text-slate-800 mt-1 block">
            {policy.next_review_date
              ? new Date(policy.next_review_date).toLocaleDateString("pt-BR")
              : "Em 12 meses (anual)"}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Aprovação</span>
          <strong className="text-xs font-bold text-slate-800 mt-1 block truncate" title={policy.approved_by}>
            {policy.approved_by || "Diretoria Executiva"}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Adesão Registrada</span>
          <strong className="text-xs font-bold text-blue-700 mt-1 block">
            {acceptedPolicies} de {totalEmployees} colaboradores
          </strong>
        </div>
      </div>

      {/* 3. INTEGRAÇÃO COM MOTOR DE CONFORMIDADE & STATUS DE PUBLICAÇÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card Motor de Conformidade */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Aderência do Pilar • Conduta
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
              {codePillarScore}% Atendido
            </span>
          </div>
          <h3 className="text-sm font-bold">Pilar: Código de Conduta e Integridade</h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Requisito formal auditado conforme o <strong>art. 25, § 4º da Lei nº 14.133/2021</strong> e <strong>art. 4º do Decreto nº 12.304/2024</strong>. Vinculado automaticamente ao Dossiê de Evidências.
          </p>
          <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Evidência registrada e válida para habilitação
          </div>
        </div>

        {/* Card Status de Publicação aos Colaboradores */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Publicação aos Colaboradores
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Código Publicado
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Versão v{policy.version} vinculada ao Link Único
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Todos os novos acessos no link público do WhatsApp visualizam esta versão antes do treinamento e confirmação de ciência com IP.
          </p>
          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Publicado em: {new Date(policy.published_at || policy.updated_at).toLocaleDateString("pt-BR")}
          </div>
        </div>

        {/* Card Histórico de Versões */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Histórico Documental
            </span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Trilhas e Revisões Anteriores
          </h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
              <span>v{policy.version} (Atual Vigente)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Ativa</span>
            </div>
            {policy.history?.map((h) => (
              <div
                key={h.version}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
              >
                <span>v{h.version} ({new Date(h.created_at).toLocaleDateString("pt-BR")})</span>
                <button
                  type="button"
                  onClick={() => setViewingVersion(h)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Visualizar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EDITOR PRINCIPAL COM TABS DE EDIÇÃO E PREVIEW FORMATADO */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Barra Superior do Editor */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("EDITAR")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "EDITAR"
                  ? "bg-white text-blue-700 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Conteúdo
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("VISUALIZAR")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "VISUALIZAR"
                  ? "bg-white text-blue-700 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visualizar Prévia Formatada
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Aprovado em: {new Date(policy.approved_at).toLocaleDateString("pt-BR")} por {policy.approved_by}
          </span>
        </div>

        {/* Formulário / Corpo */}
        <form onSubmit={handleSave} className="p-6 sm:p-7 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título Oficial do Código de Conduta
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Código de Conduta e Integridade"
              className="w-full text-sm font-bold text-slate-900 p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            />
          </div>

          {activeTab === "EDITAR" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Estrutura e Conteúdo Normativo (Markdown)
                </label>
                <span className="text-[11px] text-slate-400">
                  15 seções estruturadas • Exemplos práticos incluídos
                </span>
              </div>
              <textarea
                rows={22}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs font-mono p-4 border border-slate-300 rounded-2xl leading-relaxed focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/40 text-slate-800"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Visualização Prévia (Como aparece aos colaboradores e auditores)
              </span>
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white max-h-[500px] overflow-y-auto prose prose-slate max-w-none text-xs leading-relaxed space-y-4 whitespace-pre-line">
                {content}
              </div>
            </div>
          )}

          {/* Configuração de Publicação de Versão */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <strong className="text-xs font-bold text-slate-800 block">
                Publicar imediatamente esta versão aos colaboradores
              </strong>
              <p className="text-[11px] text-slate-500">
                Ao salvar, a versão anterior será arquivada no histórico e o número de versão será incrementado para fins auditáveis.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={publishToEmployees}
                onChange={(e) => setPublishToEmployees(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Ações de Salvamento */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Nova versão v{policy.version} salva, arquivada no histórico e atualizada no Motor de Conformidade!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Cada versão salva gera registro cronológico permanente para apresentação a pregoeiros.
              </span>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Nova Versão
            </button>
          </div>
        </form>
      </div>

      {/* 5. SEÇÃO: BASES NORMATIVAS RELACIONADAS (CAMPOS DE APLICAÇÃO DISTINTOS) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-600" />
            Bases Normativas Relacionadas ao Código
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            As normas abaixo possuem campos de aplicação distintos e orientam diferentes obrigações da empresa:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 font-bold block">
              Lei Federal nº 14.133/2021 (Art. 25, § 4º)
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Exigência de Programa de Integridade para contratos de grande vulto e critério de desempate em licitações públicas (art. 60, IV), demandando código formal e treinamentos contínuos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 font-bold block">
              Lei Federal nº 14.457/2022 (Art. 23)
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Obrigatoriedade de inclusão de regras de conduta contra o assédio moral e sexual no manual interno, manutenção de canal de denúncias e garantia de não retaliação.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 font-bold block">
              Norma Regulamentadora nº 1 (NR-1)
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Disposições gerais de gerenciamento de riscos ocupacionais e segurança e saúde no trabalho. <em>Nota: o cumprimento isolado da NR-1 não equivale a Programa de Integridade licitatório.</em>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE VISUALIZAÇÃO DE VERSÃO ANTERIOR */}
      {viewingVersion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Arquivo Histórico • Somente Leitura
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  Versão {viewingVersion.version} — {viewingVersion.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingVersion(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>Criado em: {new Date(viewingVersion.created_at).toLocaleDateString("pt-BR")}</span>
              <span>Aprovado por: {viewingVersion.approved_by}</span>
            </div>

            <div className="overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono leading-relaxed whitespace-pre-line flex-1">
              {viewingVersion.content}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setViewingVersion(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
