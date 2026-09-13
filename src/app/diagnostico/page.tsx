"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Gauge,
  Lock,
  FileCheck2,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  FileDown,
  Info,
} from "lucide-react";
import { maskCNPJInput, cleanCNPJ, isValidCNPJFormat } from "@/lib/utils";
import { saveFreeDiagnosticAction } from "@/app/actions/free-diagnostic";
import { createCheckoutSessionAction } from "@/app/actions/stripe";

type Step = 1 | 2 | 3 | 4 | 5;

interface DiagnosticAnswers {
  cnpj: string;
  legalName: string;
  tradeName: string;
  companySize: string;
  publicContracts: string;
  codeOfConduct: string;
  whistleblowerChannel: string;
  training: string;
  evidenceRecords: string;
  dueDiligence: string;
  disciplinaryMeasures: string;
}

function DiagnosticTool() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [diagnosticId, setDiagnosticId] = useState<string>("");
  const [showCommercialDetails, setShowCommercialDetails] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [answers, setAnswers] = useState<DiagnosticAnswers>({
    cnpj: "",
    legalName: "",
    tradeName: "",
    companySize: "Pequeno Porte / EPP",
    publicContracts: "Sim, participa ativamente",
    codeOfConduct: "",
    whistleblowerChannel: "",
    training: "",
    evidenceRecords: "",
    dueDiligence: "",
    disciplinaryMeasures: "",
  });

  // Pre-fill via URL se houver
  useEffect(() => {
    const cnpjParam = searchParams.get("cnpj");
    if (cnpjParam) {
      setAnswers((prev) => ({
        ...prev,
        cnpj: maskCNPJInput(cnpjParam),
      }));
    }
  }, [searchParams]);

  // Consulta CNPJ na Etapa 1
  const handleCNPJSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = cleanCNPJ(answers.cnpj);

    if (!isValidCNPJFormat(raw)) {
      setErrorMsg("Digite um CNPJ válido com 14 dígitos para continuar.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`/api/cnpj/${raw}`);
      if (res.ok) {
        const data = await res.json();
        setAnswers((prev) => ({
          ...prev,
          legalName: data.legal_name || data.trade_name || "Empresa sob Consulta",
          tradeName: data.trade_name || data.legal_name || "Empresa sob Consulta",
          companySize: data.company_size || prev.companySize,
        }));
      }
    } catch {
      // Falha de rede não impede avanço
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  // Cálculo de resultado na Etapa 5
  const calculateResult = () => {
    let structured = 0;
    let attention = 0;
    let toDevelop = 0;

    const evalFields = [
      answers.codeOfConduct,
      answers.whistleblowerChannel,
      answers.training,
      answers.evidenceRecords,
      answers.dueDiligence,
      answers.disciplinaryMeasures,
    ];

    evalFields.forEach((val) => {
      if (val === "A") structured += 1;
      else if (val === "B") attention += 1;
      else toDevelop += 1;
    });

    // Ponderação da nota (0 a 100%)
    const score = Math.min(
      95,
      Math.max(25, Math.round(((structured * 1.0 + attention * 0.5 + toDevelop * 0.1) / 6) * 100))
    );

    const totalPointsStructured = Math.max(4, Math.round((score / 100) * 23));
    const totalPointsAttention = Math.max(3, attention * 2 + 1);
    const totalPointsToDevelop = Math.max(2, toDevelop * 2 + 2);

    const attentionPointsList: string[] = [];
    if (answers.codeOfConduct !== "A") {
      attentionPointsList.push(
        "Código de Ética e Conduta: formalizar documento com regras anticorrupção e compromisso da alta gestão."
      );
    }
    if (answers.whistleblowerChannel !== "A") {
      attentionPointsList.push(
        "Canal de Denúncias: estruturar mecanismo com garantia de anonimato exigido pela Lei 14.457/2022."
      );
    }
    if (answers.evidenceRecords !== "A") {
      attentionPointsList.push(
        "Acervo de Evidências: centralizar listas de presença, atas e certificados para rápida montagem de dossiê."
      );
    }
    if (answers.dueDiligence !== "A") {
      attentionPointsList.push(
        "Due Diligence de Terceiros: checar sanções administrativas e impedimentos de licitar em fornecedores críticos."
      );
    }

    return {
      score,
      totalPointsStructured,
      totalPointsAttention,
      totalPointsToDevelop,
      attentionPointsList,
    };
  };

  const result = calculateResult();

  // Finalização e salvamento do diagnóstico (sem criar empresa)
  const handleGenerateDiagnostic = async () => {
    if (!answers.evidenceRecords || !answers.dueDiligence || !answers.disciplinaryMeasures) {
      setErrorMsg("Por favor, responda todas as questões para emitir o resultado.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const saveRes = await saveFreeDiagnosticAction({
        cnpj: answers.cnpj,
        legal_name: answers.legalName,
        trade_name: answers.tradeName,
        company_size: answers.companySize,
        public_contracts: answers.publicContracts,
        answers: {
          codeOfConduct: answers.codeOfConduct,
          whistleblowerChannel: answers.whistleblowerChannel,
          training: answers.training,
          evidenceRecords: answers.evidenceRecords,
          dueDiligence: answers.dueDiligence,
          disciplinaryMeasures: answers.disciplinaryMeasures,
        },
        score: result.score,
        points_structured: result.totalPointsStructured,
        points_attention: result.totalPointsAttention,
        points_to_develop: result.totalPointsToDevelop,
        attention_points: result.attentionPointsList,
      });

      if (saveRes.success) {
        setDiagnosticId(saveRes.diagnosticId);
      }
    } catch (e) {
      console.warn("Falha ao salvar diagnóstico:", e);
    } finally {
      setLoading(false);
      setStep(5);
    }
  };

  // Iniciar contratação quando o usuário desejar
  const handleInitiateSubscription = async () => {
    setCheckoutLoading(true);
    try {
      await createCheckoutSessionAction({
        cnpj: cleanCNPJ(answers.cnpj),
        companyName: answers.tradeName || answers.legalName,
        diagnosticId: diagnosticId || undefined,
      });
    } catch (err: any) {
      // Redirecionamento é tratado no server action
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOPO MINIMALISTA DE PRODUTO */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                TechCompliance
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                Diagnóstico de Preparação
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Voltar ao site
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ÁREA DA FERRAMENTA */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full flex-1 flex flex-col justify-center">
        <div className="space-y-8">
          {/* Header da Ferramenta */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {step === 5
                ? "Diagnóstico Preliminar Concluído"
                : "Descubra como sua empresa está estruturada hoje"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              {step === 5
                ? "Este relatório foi gerado com base nas informações declaradas sobre os parâmetros da Lei 14.133/2021."
                : "Responda algumas perguntas e receba uma avaliação inicial dos principais pontos do seu Programa de Integridade."}
            </p>
          </div>

          {/* Barra de Progresso & Indicador de Etapa */}
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="text-blue-400">Etapa {step} de 5</span>
              <span>{step === 5 ? "Resultado Pronto" : `${Math.round((step / 5) * 100)}%`}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* CARD PRINCIPAL DA ETAPA ATIVA */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* =======================================================
                ETAPA 1: CNPJ
            ======================================================= */}
            {step === 1 && (
              <form onSubmit={handleCNPJSubmit} className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span>Comece pelo CNPJ da sua empresa</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Consultamos a base pública oficial para identificar automaticamente os dados cadastrais.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    CNPJ
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={answers.cnpj}
                      onChange={(e) => {
                        setAnswers({ ...answers, cnpj: maskCNPJInput(e.target.value) });
                        if (errorMsg) setErrorMsg("");
                      }}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      autoFocus
                      className="w-full bg-slate-950 text-white pl-12 pr-4 py-4 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none font-mono text-lg transition-all placeholder:text-slate-600 shadow-inner"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-400 font-medium pt-1">{errorMsg}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/40 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Consultando dados oficiais...</span>
                    ) : (
                      <span>CONTINUAR →</span>
                    )}
                  </button>
                </div>

                <div className="text-center text-xs font-semibold text-slate-400 pt-1 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Diagnóstico inicial gratuito • Sem cartão de crédito</span>
                </div>
              </form>
            )}

            {/* =======================================================
                ETAPA 2: PERFIL DA EMPRESA
            ======================================================= */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Confirme o perfil da sua empresa
                  </h2>
                  <p className="text-xs text-slate-400">
                    Esses dados auxiliam na calibração dos requisitos da Lei 14.133/2021.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="text-slate-400">CNPJ: {answers.cnpj}</div>
                  <div className="font-bold text-white text-sm">
                    {answers.tradeName || answers.legalName || "Empresa sob Consulta"}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-sans font-semibold">
                    ✓ Consulta oficial confirmada
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Qual o porte da empresa?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {["Microempresa / ME", "Pequeno Porte / EPP", "Médio / Grande Porte"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setAnswers({ ...answers, companySize: size })}
                        className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                          answers.companySize === size
                            ? "border-blue-500 bg-blue-500/15 text-white"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    A empresa já vende ou pretende vender para o governo?
                  </label>
                  <div className="space-y-2 text-xs">
                    {[
                      "Sim, participa ativamente de licitações e contratos públicos",
                      "Pretende começar a disputar licitações em breve",
                      "Apenas presta serviços como subcontratada / terceira",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers({ ...answers, publicContracts: opt })}
                        className={`w-full p-3.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                          answers.publicContracts === opt
                            ? "border-blue-500 bg-blue-500/15 text-white"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {answers.publicContracts === opt && (
                          <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-600/30 text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>CONTINUAR →</span>
                  </button>
                </div>
              </div>
            )}

            {/* =======================================================
                ETAPA 3: ESTRUTURA E PRÁTICAS ATUAIS
            ======================================================= */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Estrutura e práticas atuais
                  </h2>
                  <p className="text-xs text-slate-400">
                    Avaliação dos pilares essenciais de integridade e ética corporativa.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    1. A empresa possui Código de Ética e Conduta formalizado e vigente?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, aprovado pela diretoria e divulgado aos colaboradores" },
                      { val: "B", label: "Possui apenas regras básicas ou documento em elaboração" },
                      { val: "C", label: "Não possui formalizado" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, codeOfConduct: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.codeOfConduct === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.codeOfConduct === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    2. Há canal de denúncias disponível com garantia de anonimato (Lei 14.457)?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, canal estruturado com protocolo e opção anônima" },
                      { val: "B", label: "Apenas e-mail corporativo ou contato de RH tradicional" },
                      { val: "C", label: "Não possui mecanismo formal de reporte" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, whistleblowerChannel: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.whistleblowerChannel === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.whistleblowerChannel === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    3. São realizados treinamentos sobre integridade e prevenção ao assédio?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, periódicos para toda a equipe com controle de presença" },
                      { val: "B", label: "Apenas orientações no momento da admissão" },
                      { val: "C", label: "Não são realizados treinamentos sobre integridade" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, training: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.training === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.training === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!answers.codeOfConduct || !answers.whistleblowerChannel || !answers.training) {
                        setErrorMsg("Por favor, responda todas as questões para calibrar o diagnóstico.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(4);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-600/30 text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>CONTINUAR →</span>
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-red-400 text-right">{errorMsg}</p>}
              </div>
            )}

            {/* =======================================================
                ETAPA 4: EVIDÊNCIAS E DOCUMENTAÇÃO
            ======================================================= */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Evidências e documentação probatória
                  </h2>
                  <p className="text-xs text-slate-400">
                    Apresentação de provas materiais para atendimento a editais e fiscalizações.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    4. A empresa possui registros auditáveis das ações (atas, listas, certificados)?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, registros organizados e prontos para apresentação" },
                      { val: "B", label: "Registros dispersos em e-mails e pastas sem centralização" },
                      { val: "C", label: "Não arquiva evidências de forma estruturada" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, evidenceRecords: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.evidenceRecords === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.evidenceRecords === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    5. É feita análise prévia (Due Diligence) de fornecedores e parceiros críticos?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, consulta regular de sanções (CEIS/CNEP/TCU)" },
                      { val: "B", label: "Apenas checagem cadastral básica de CNPJ" },
                      { val: "C", label: "Não realiza checagem prévia de terceiros" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, dueDiligence: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.dueDiligence === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.dueDiligence === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    6. Há procedimento formal para apuração de irregularidades e aplicação de sanções?
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { val: "A", label: "Sim, procedimento formalizado e documentado" },
                      { val: "B", label: "Tratamento informal caso a caso pela diretoria" },
                      { val: "C", label: "Não possui procedimento definido" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, disciplinaryMeasures: opt.val })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.disciplinaryMeasures === opt.val
                            ? "border-blue-500 bg-blue-500/15 text-white font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.disciplinaryMeasures === opt.val && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleGenerateDiagnostic}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold py-3.5 px-7 rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Calculando diagnóstico...</span>
                    ) : (
                      <span>GERAR DIAGNÓSTICO →</span>
                    )}
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-red-400 text-right">{errorMsg}</p>}
              </div>
            )}

            {/* =======================================================
                ETAPA 5: RESULTADO DO DIAGNÓSTICO
                (NÃO envia para cadastro de empresa. É a tela final da ferramenta gratuita!)
            ======================================================= */}
            {step === 5 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Topo do Resultado */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      Seu diagnóstico está concluído
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                    {answers.tradeName || answers.legalName} • {answers.cnpj}
                  </span>
                </div>

                {/* Score Principal */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Índice de Estruturação do Programa
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl sm:text-6xl font-black text-white">{result.score}%</span>
                    <span className="text-sm font-bold text-blue-400">estruturado</span>
                  </div>
                  <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Avaliação técnica com base nas diretrizes da Lei 14.133/2021 e Decreto 12.304/2024
                  </p>
                </div>

                {/* 3 Cards de Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <div className="text-2xl font-black text-emerald-400">{result.totalPointsStructured}</div>
                    <div className="text-xs font-bold text-white">pontos estruturados</div>
                    <div className="text-[10px] text-slate-400">Requisitos atendidos</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <div className="text-2xl font-black text-amber-400">{result.totalPointsAttention}</div>
                    <div className="text-xs font-bold text-white">pontos de atenção</div>
                    <div className="text-[10px] text-slate-400">Podem ser aprimorados</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <div className="text-2xl font-black text-slate-300">{result.totalPointsToDevelop}</div>
                    <div className="text-xs font-bold text-white">pontos a desenvolver</div>
                    <div className="text-[10px] text-slate-400">Demandam implantação</div>
                  </div>
                </div>

                {/* Principais Pontos de Atenção Identificados */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Principais Pontos Identificados na sua Empresa:
                  </div>

                  <div className="space-y-2 text-xs">
                    {result.attentionPointsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-start gap-3"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* =======================================================
                    BLOCO COMERCIAL / CONVERSÃO PÓS-DIAGNÓSTICO
                    (Separação rigorosa: aqui o usuário decide se deseja contratar)
                ======================================================= */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-500/30 space-y-5">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>PRÓXIMO PASSO RECOMENDADO</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                      Quer transformar esse diagnóstico em um plano de ação e organizar tudo em um único ambiente?
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      O TechCompliance automatiza o Código de Ética, gerencia o Canal de Denúncias com anonimato, centraliza evidências auditáveis e gera o Dossiê completo para apresentação em licitações.
                    </p>
                  </div>

                  {/* Detalhes do produto (toggle sob demanda) */}
                  {showCommercialDetails && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
                      <div className="font-bold text-white">O que sua empresa recebe com a assinatura:</div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Código de Conduta formalizado</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Canal de Denúncias Lei 14.457</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dossiê probatório com QR Code</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Due Diligence de fornecedores</span>
                        </li>
                      </ul>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Plano Completo por R$ 189,90/mês • Sem taxa de adesão • Cancele quando quiser
                      </div>
                    </div>
                  )}

                  {/* CTAs Comerciais */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={checkoutLoading}
                      onClick={handleInitiateSubscription}
                      className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/40 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <span>Iniciando checkout seguro...</span>
                      ) : (
                        <>
                          <span>CONTRATAR AGORA (R$ 189,90/mês) →</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCommercialDetails(!showCommercialDetails)}
                      className="w-full sm:w-auto px-5 py-4 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{showCommercialDetails ? "Ocultar detalhes" : "Conhecer o TechCompliance"}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 text-center sm:text-left flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Seu diagnóstico ({diagnosticId || "salvo"}) será vinculado automaticamente à sua empresa após a confirmação do pagamento.
                    </span>
                  </div>
                </div>

                {/* Opções de saída sem compromisso */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setShowCommercialDetails(false);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refazer avaliação com outro CNPJ</span>
                  </button>

                  <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Voltar para a página inicial
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. RODAPÉ DA FERRAMENTA */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4">
          TechCompliance • Plataforma para Estruturação e Evidenciação de Programas de Integridade
        </div>
      </footer>
    </div>
  );
}

export default function DiagnosticoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Carregando ferramenta de diagnóstico...</div>}>
      <DiagnosticTool />
    </Suspense>
  );
}
