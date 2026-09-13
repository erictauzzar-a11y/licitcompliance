"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck,
  ChevronRight,
  Filter,
  ExternalLink,
  Layers,
  BookOpen,
  Users,
  AlertCircle,
  HelpCircle,
  Info,
  X,
  Search,
  Scale,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  ListTodo,
} from "lucide-react";
import { evaluateCompanyCompliance } from "@/lib/compliance-engine";
import {
  ComplianceDiagnostic,
  ComplianceRequirement,
  PillarCategory,
  RequirementStatus,
  DiagnosticAnswerValue,
  CompanyComplianceProfile,
  ActionPlanItem,
} from "@/types/compliance";
import { generateDossierPDF } from "@/lib/pdf-generator";
import { useCompany } from "@/contexts/CompanyContext";
import {
  DIAGNOSTIC_STEPS,
  DIAGNOSTIC_QUESTIONS,
  DiagnosticQuestion,
} from "@/lib/diagnostic-questions";
import {
  getCompanyDiagnosticProfileAction,
  saveDiagnosticStepAction,
  completeDiagnosticAction,
  getActionPlanAction,
} from "@/app/actions/diagnostic";

type DiagnosticTab = "QUESTIONARIO" | "MATRIZ_REQUISITOS" | "PLANO_ACAO";

export default function ProgramDiagnosticPage() {
  const { company, isLoading } = useCompany();

  // Tab ativa
  const [activeTab, setActiveTab] = useState<DiagnosticTab>("QUESTIONARIO");

  // Perfil e Questionário
  const [profile, setProfile] = useState<CompanyComplianceProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, { answer: DiagnosticAnswerValue; notes?: string }>>({});
  const [savingStep, setSavingStep] = useState(false);
  const [stepSavedNotice, setStepSavedNotice] = useState(false);

  // Motor e Métricas
  const [diagnostic, setDiagnostic] = useState<ComplianceDiagnostic>(() =>
    evaluateCompanyCompliance(company?.id)
  );
  const [planItems, setPlanItems] = useState<ActionPlanItem[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory | "TODOS">("TODOS");
  const [selectedStatus, setSelectedStatus] = useState<RequirementStatus | "TODOS">("TODOS");
  const [activeReqModal, setActiveReqModal] = useState<ComplianceRequirement | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Carrega perfil e plano de ação ao iniciar
  const loadProfile = useCallback(async () => {
    if (!company?.id) return;
    try {
      const res = await getCompanyDiagnosticProfileAction();
      if (res.success && res.profile) {
        setProfile(res.profile);
        setCurrentStep(res.profile.current_step || 1);
        const mapped: Record<string, { answer: DiagnosticAnswerValue; notes?: string }> = {};
        Object.entries(res.profile.answers || {}).forEach(([k, v]) => {
          mapped[k] = { answer: v.answer, notes: v.notes };
        });
        setAnswers(mapped);

        // Se o diagnóstico já estiver concluído, podemos abrir por padrão na Matriz
        if (res.profile.status === "CONCLUIDO") {
          setActiveTab("MATRIZ_REQUISITOS");
        }
      }
      // Atualiza compliance engine e plano de ação
      setDiagnostic(evaluateCompanyCompliance(company.id));
      const planRes = await getActionPlanAction();
      if (planRes.success) {
        setPlanItems(planRes.items);
      }
    } catch (e) {
      console.error(e);
    }
  }, [company?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleDownloadDossier = async () => {
    try {
      setGeneratingPdf(true);
      await generateDossierPDF(undefined, company?.id);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Salvar respostas da etapa atual
  const handleSaveCurrentStep = async (advance: boolean = false) => {
    if (!company?.id) return;
    setSavingStep(true);
    setStepSavedNotice(false);

    // Filtra respostas da etapa atual
    const stepQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.step === currentStep);
    const stepPayload: Record<string, { answer: DiagnosticAnswerValue; notes?: string }> = {};

    stepQuestions.forEach((q) => {
      if (answers[q.id]) {
        stepPayload[q.id] = answers[q.id];
      }
    });

    try {
      const res = await saveDiagnosticStepAction(currentStep, stepPayload);
      if (res.success) {
        setStepSavedNotice(true);
        setTimeout(() => setStepSavedNotice(false), 3000);
        // Atualiza estado
        if (advance) {
          if (currentStep < 9) {
            setCurrentStep((prev) => prev + 1);
          } else {
            // Última etapa concluída!
            await completeDiagnosticAction();
            setActiveTab("MATRIZ_REQUISITOS");
          }
        }
        await loadProfile();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingStep(false);
    }
  };

  // Definir resposta para uma pergunta
  const handleSetAnswer = (questionId: string, answer: DiagnosticAnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        answer,
      },
    }));
  };

  const handleSetNotes = (questionId: string, notes: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { answer: "NAO_SEI" }),
        notes,
      },
    }));
  };

  if (isLoading || !company) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // Questões da etapa atual
  const currentStepMeta = DIAGNOSTIC_STEPS.find((s) => s.step === currentStep) || DIAGNOSTIC_STEPS[0];
  const currentStepQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.step === currentStep);
  const totalAnswered = Object.keys(answers).length;
  const isDiagnosticFinished = profile?.status === "CONCLUIDO" || totalAnswered >= DIAGNOSTIC_QUESTIONS.length;

  // Filtragem de Requisitos
  const filteredRequirements = diagnostic.requirements.filter((req) => {
    if (selectedPillar !== "TODOS" && req.pillar !== selectedPillar) return false;
    if (selectedStatus !== "TODOS" && req.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: RequirementStatus) => {
    switch (status) {
      case "ATENDIDO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Atendido
          </span>
        );
      case "PARCIALMENTE_ATENDIDO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Parcialmente Atendido
          </span>
        );
      case "PENDENTE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Pendente
          </span>
        );
      case "EM_REVISAO":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">
            Em Revisão
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 w-fit">
            Não Aplicável
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-12 font-sans">
      {/* 1. HERO SUPERIOR COM SCORE AUDITÁVEL */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              Diagnóstico Adaptativo • Decreto Federal nº 12.304/2024
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Maturidade e Evidenciação do Programa
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Avaliação pericial e contínua fundamentada no Decreto nº 12.304/2024 e na Lei Federal nº 14.133/2021. Cada exigência normativa é vinculada exclusivamente a evidências documentais ou sistêmicas reais da organização.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Regra de Evidência:</strong> Respostas afirmativas no questionário indicam intenção ou prática, ficando registradas como pendentes até a homologação do correspondente documento ou comprovação na plataforma.
              </span>
            </div>
          </div>

          {/* Medidor Circular / Score */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Maturidade Auditável
              </span>
              <div className="text-5xl font-black text-emerald-400 my-1 font-mono">
                {diagnostic.overall_score}%
              </div>
              <span className="text-xs font-semibold text-emerald-300">
                {diagnostic.overall_score >= 76
                  ? "Nível Avançado"
                  : diagnostic.overall_score >= 51
                  ? "Nível Operacional"
                  : diagnostic.overall_score >= 26
                  ? "Em Estruturação"
                  : "Nível Inicial"}
              </span>
            </div>

            <button
              onClick={handleDownloadDossier}
              disabled={generatingPdf}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <FileCheck className="w-4 h-4" />
              {generatingPdf ? "Compilando..." : "Gerar Dossiê de Evidências (PDF)"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. ABAS DE NAVEGAÇÃO PRINCIPAL */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("QUESTIONARIO")}
          className={
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer " +
            (activeTab === "QUESTIONARIO"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")
          }
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Questionário Adaptativo (9 Etapas)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-blue-300">
            {totalAnswered}/{DIAGNOSTIC_QUESTIONS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MATRIZ_REQUISITOS")}
          className={
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer " +
            (activeTab === "MATRIZ_REQUISITOS"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")
          }
        >
          <Layers className="w-4 h-4" />
          <span>2. Matriz de Requisitos & Evidências</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {diagnostic.met_count}/{diagnostic.total_requirements}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PLANO_ACAO")}
          className={
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer " +
            (activeTab === "PLANO_ACAO"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")
          }
        >
          <ListTodo className="w-4 h-4" />
          <span>3. Plano de Ação & Pendências</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
            {planItems.length}
          </span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* ABA 1: QUESTIONÁRIO ADAPTATIVO (9 ETAPAS) */}
      {/* =================================================================== */}
      {activeTab === "QUESTIONARIO" && (
        <div className="space-y-6">
          {/* Navegador das 9 Etapas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Progresso das 9 Etapas do Decreto nº 12.304/2024
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                Etapa {currentStep} de 9
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {DIAGNOSTIC_STEPS.map((s) => {
                const isCurrent = s.step === currentStep;
                const isStepAnswered = DIAGNOSTIC_QUESTIONS.filter((q) => q.step === s.step).every(
                  (q) => !!answers[q.id]
                );

                return (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer " +
                      (isCurrent
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : isStepAnswered
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100")
                    }
                  >
                    <div className="text-[10px] font-bold uppercase">Passo {s.step}</div>
                    <div className="text-[11px] font-bold truncate mt-0.5">{s.short_title}</div>
                    {isStepAnswered && !isCurrent && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 mx-auto mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cabeçalho da Etapa Atual */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-100 p-5 sm:p-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200">
              <Sparkles className="w-3 h-3" />
              {currentStepMeta.normative_focus}
            </div>
            <h2 className="text-xl font-black text-slate-900">{currentStepMeta.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentStepMeta.description}
            </p>
          </div>

          {/* Questões da Etapa Atual */}
          <div className="space-y-4">
            {currentStepQuestions.map((q) => {
              const currentAns = answers[q.id]?.answer;
              const currentNotes = answers[q.id]?.notes || "";

              return (
                <div
                  key={q.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                        Item {q.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {q.legal_reference}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {q.question}
                    </p>
                    <p className="text-xs text-slate-500 italic">{q.explanation}</p>
                  </div>

                  {/* Opções de Resposta Adaptativas */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Selecione a situação atual da sua empresa:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(
                        [
                          { value: "SIM", label: "Sim", color: "hover:border-emerald-500 hover:bg-emerald-50/50" },
                          { value: "PARCIALMENTE", label: "Parcialmente", color: "hover:border-amber-500 hover:bg-amber-50/50" },
                          { value: "NAO", label: "Não", color: "hover:border-red-500 hover:bg-red-50/50" },
                          { value: "NAO_SEI", label: "Não Sei", color: "hover:border-slate-500 hover:bg-slate-100" },
                          { value: "NAO_APLICAVEL", label: "Não Aplicável", color: "hover:border-slate-400 hover:bg-slate-50" },
                        ] as const
                      ).map((opt) => {
                        const isSelected = currentAns === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSetAnswer(q.id, opt.value)}
                            className={
                              "p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer active:scale-98 " +
                              (isSelected
                                ? opt.value === "SIM"
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                  : opt.value === "PARCIALMENTE"
                                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                  : opt.value === "NAO"
                                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                                  : "bg-slate-800 text-white border-slate-800 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 " + opt.color)
                            }
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Campo de Justificativa / Observação */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Observações ou detalhes (opcional):
                    </label>
                    <input
                      type="text"
                      value={currentNotes}
                      onChange={(e) => handleSetNotes(q.id, e.target.value)}
                      placeholder="Ex: Temos código preliminar em revisão pela diretoria..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Ação Sugerida */}
                  {q.suggested_action_href && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Como comprovar este requisito na plataforma:
                      </span>
                      <Link
                        href={q.suggested_action_href}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <span>{q.suggested_action_label || "Resolver na Plataforma"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rodapé de Navegação da Etapa */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Etapa Anterior</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={savingStep}
                onClick={() => handleSaveCurrentStep(false)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>{savingStep ? "Salvando..." : "Salvar Rascunho"}</span>
              </button>

              <button
                type="button"
                disabled={savingStep}
                onClick={() => handleSaveCurrentStep(true)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
              >
                <span>{currentStep === 9 ? "Finalizar Diagnóstico" : "Salvar e Avançar"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ABA 2: MATRIZ DE REQUISITOS E EVIDÊNCIAS */}
      {/* =================================================================== */}
      {activeTab === "MATRIZ_REQUISITOS" && (
        <div className="space-y-6">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Requisitos Atendidos
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
                {diagnostic.met_count}
                <span className="text-xs text-slate-400 font-normal ml-1">/ {diagnostic.total_requirements}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Conformidade comprovada</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pontos de Atenção
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2 font-mono">
                {diagnostic.partial_count}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Requer documento comprobatório</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Pendências Críticas
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
                {diagnostic.pending_count}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sem evidência associada</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Evidências Validadas
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-2 font-mono">
                {diagnostic.total_evidences}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Documentos, logs e certificados</p>
            </div>
          </div>

          {/* Barras de Maturidade por Pilar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Estruturação por Pilar do Programa (Decreto nº 12.304/2024)
              </h2>
              <p className="text-xs text-slate-500">
                Clique em qualquer pilar abaixo para filtrar os requisitos correspondentes:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(diagnostic.pillars).map(([pKey, pData]) => {
                const isSelected = selectedPillar === pKey;
                return (
                  <button
                    key={pKey}
                    onClick={() => setSelectedPillar(isSelected ? "TODOS" : (pKey as PillarCategory))}
                    className={
                      "p-4 rounded-xl border text-left transition-all cursor-pointer " +
                      (isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white")
                    }
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{pData.label}</span>
                      <span className={"font-mono text-sm " + (pData.score >= 50 ? "text-emerald-700" : "text-amber-700")}>
                        {pData.score}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className={"h-full rounded-full transition-all " + (pData.score >= 50 ? "bg-emerald-500" : "bg-amber-500")}
                        style={{ width: `${pData.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>{pData.met_requirements}/{pData.total_requirements} atendidos</span>
                      <span>{pData.evidence_count} evidência(s)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabela de Requisitos e Evidências */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Quadro de Requisitos e Evidências Vinculadas
                </h2>
                <p className="text-xs text-slate-500">
                  Fundamentação legal e comprovação documental por exigência.
                </p>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
                >
                  <option value="TODOS">Todos os Pilares</option>
                  <option value="CODIGO_CONDUTA">Código e Conduta</option>
                  <option value="POLITICAS">Políticas</option>
                  <option value="TREINAMENTOS">Treinamentos</option>
                  <option value="CANAL_DENUNCIAS">Canal de Denúncias</option>
                  <option value="GESTAO_TERCEIROS">Gestão de Terceiros</option>
                  <option value="CONTROLES_INTERNOS">Controles Internos</option>
                  <option value="GESTAO_RISCOS">Gestão de Riscos</option>
                  <option value="MONITORAMENTO">Monitoramento</option>
                  <option value="EVIDENCIAS">Evidências</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
                >
                  <option value="TODOS">Todos os Status</option>
                  <option value="ATENDIDO">Atendido</option>
                  <option value="PARCIALMENTE_ATENDIDO">Parcialmente Atendido</option>
                  <option value="PENDENTE">Pendente</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRequirements.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setActiveReqModal(req)}
                  className="py-4 hover:bg-slate-50/70 cursor-pointer transition-colors rounded-xl px-3 group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-[11px] font-semibold text-blue-700">
                          {req.legal_basis.norm} ({req.legal_basis.article})
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          • Responsável: {req.responsible}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {req.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {req.situation_summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {req.evidences.map((ev) => (
                          <span
                            key={ev.id}
                            className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium"
                          >
                            <FileText className="w-3 h-3 text-slate-400" />
                            {ev.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                      {getStatusBadge(req.status)}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ABA 3: PLANO DE AÇÃO DINÂMICO & RESOLUÇÃO DE PENDÊNCIAS */}
      {/* =================================================================== */}
      {activeTab === "PLANO_ACAO" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <h2 className="text-base font-bold text-slate-900">
              Plano de Ação para Evolução do Programa de Integridade
            </h2>
            <p className="text-xs text-slate-500">
              Todas as pendências identificadas geram ações concretas com links diretos para resolução nos módulos correspondentes da plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border " +
                        (item.priority === "ALTA"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-800 border-amber-200")
                      }
                    >
                      {item.priority === "ALTA" ? "Prioridade Alta" : "Média Prioridade"}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {item.requirement_id}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div>
                      <strong className="text-slate-800">Base Normativa:</strong> {item.legal_reference}
                    </div>
                    <div>
                      <strong className="text-slate-800">Objetivo:</strong> {item.why_is_needed}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    href={item.action_href}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <span>{item.action_label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE DETALHAMENTO DO REQUISITO */}
      {activeReqModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Fundamento Normativo Auditável
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  {activeReqModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReqModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">
                    {activeReqModal.legal_basis.norm} — {activeReqModal.legal_basis.article}
                  </strong>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeReqModal.legal_basis.type}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {activeReqModal.legal_basis.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                  Por que este requisito possui este status?
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11px]">
                  {activeReqModal.why_status?.evidences_found?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  )) || <li>Evidências registradas nos módulos correspondentes.</li>}
                </ul>
                {activeReqModal.why_status?.what_is_missing && (
                  <div className="pt-2 border-t border-blue-200/60 text-amber-900">
                    <span className="text-[11px] font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      O que está faltando para atender plenamente:
                    </span>
                    <p className="text-[11px] mt-0.5 font-medium">
                      {activeReqModal.why_status.what_is_missing}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Situação Atual
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 leading-relaxed">
                  {activeReqModal.situation_summary}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Evidências Registradas na Plataforma ({activeReqModal.evidences.length})
                </span>
                <div className="space-y-2">
                  {activeReqModal.evidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          {ev.title}
                        </div>
                        <p className="text-[11px] text-slate-500">{ev.description}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ev.module_source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setActiveReqModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
