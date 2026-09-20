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
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Briefcase,
  Users,
  FileCheck2,
  Phone,
  Mail,
  User,
  Edit3,
  Check,
  Lock,
} from "lucide-react";
import { formatCNPJ, maskCNPJInput, cleanCNPJ, isValidCNPJFormat } from "@/lib/utils";
import { mockStore } from "@/lib/mock-data";
import { Company } from "@/types";
import { submitOnboardingAction } from "@/app/actions/onboarding";
import { verifyOnboardingAccessAction } from "@/app/actions/stripe";
import { getFreeDiagnosticAction, findFreeDiagnosticByCnpjAction } from "@/app/actions/free-diagnostic";

type OnboardingStep = "CNPJ_INPUT" | "CONFIRM_DATA" | "COMPLIANCE_DETAILS" | "CREATING_ENVIRONMENT" | "SUCCESS_READY";

function OnboardingPaidBanner() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";

  if (!checkoutSuccess) return null;

  return (
    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-4 shadow-lg animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Pagamento Confirmado com Sucesso! 💳
          </h3>
          <p className="text-xs text-emerald-200/90">
            Sua assinatura está ativa. Digite o CNPJ da sua empresa abaixo para que o TechCompliance consulte a Receita Federal e configure todo o seu ambiente automaticamente.
          </p>
        </div>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shrink-0 hidden sm:inline-block">
        Assinatura Ativa
      </span>
    </div>
  );
}

function RegisterCompanyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<OnboardingStep>("CNPJ_INPUT");
  const [cnpjInput, setCnpjInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditingData, setIsEditingData] = useState(false);

  // Dados retornados e editáveis da empresa
  const [formData, setFormData] = useState<Partial<Company> & { password?: string }>({
    cnpj: "",
    legal_name: "",
    trade_name: "",
    status: "ATIVA",
    opening_date: "",
    legal_nature: "",
    company_size: "",
    share_capital: "",
    headquarters_or_branch: "MATRIZ",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    full_address: "",
    main_cnae_code: "",
    main_cnae_description: "",
    secondary_cnaes: [],
    is_simples_nacional: null,
    is_mei: null,
    tax_regime: "",
    partners: [],
    slug: "",
    integrity_officer_name: "",
    integrity_officer_email: "",
    integrity_officer_phone: "",
    compliance_officer_name: "",
    approximate_employees_count: 10,
    conducts_public_contracts: true,
    password: "",
  });

  const [accessStatus, setAccessStatus] = useState<"CHECKING" | "AUTHORIZED" | "UNAUTHORIZED">("CHECKING");
  const [linkedDiagnostic, setLinkedDiagnostic] = useState<{
    id: string;
    score: number;
    tradeName: string;
  } | null>(null);

  // Validação segura de acesso ao onboarding empresarial
  useEffect(() => {
    async function checkAccess() {
      const sessionId = searchParams.get("session_id");
      const simulated = searchParams.get("simulated");
      const checkout = searchParams.get("checkout");
      const diagId = searchParams.get("diag_id");
      const cnpjUrl = searchParams.get("cnpj");
      const emailParam = searchParams.get("email");

      // Pré-preenche o e-mail se presente na URL
      if (emailParam) {
        setFormData((prev) => ({
          ...prev,
          integrity_officer_email: prev.integrity_officer_email || emailParam,
        }));
      }

      // Valida autorização no servidor (sessão stripe, admin ativo ou simulação)
      const access = await verifyOnboardingAccessAction({
        sessionId,
        simulated: simulated || (checkout === "success" && !sessionId ? "true" : null),
      });

      if (access.allowed) {
        setAccessStatus("AUTHORIZED");

        if (access.customerEmail) {
          setFormData((prev) => ({
            ...prev,
            integrity_officer_email: prev.integrity_officer_email || access.customerEmail,
          }));
        }

        const targetCnpj = access.cnpj || cnpjUrl;
        if (targetCnpj) {
          setCnpjInput(maskCNPJInput(targetCnpj));
        }

        // Busca se existe diagnóstico gratuito para vinculação
        const targetDiagId = access.diagnosticId || diagId;
        if (targetDiagId) {
          const { diagnostic } = await getFreeDiagnosticAction(targetDiagId);
          if (diagnostic) {
            setLinkedDiagnostic({
              id: diagnostic.id,
              score: diagnostic.score,
              tradeName: diagnostic.trade_name || diagnostic.legal_name,
            });
            if (diagnostic.cnpj && !targetCnpj) {
              setCnpjInput(maskCNPJInput(diagnostic.cnpj));
            }
          }
        } else if (targetCnpj) {
          const { diagnostic } = await findFreeDiagnosticByCnpjAction(targetCnpj);
          if (diagnostic) {
            setLinkedDiagnostic({
              id: diagnostic.id,
              score: diagnostic.score,
              tradeName: diagnostic.trade_name || diagnostic.legal_name,
            });
          }
        }
      } else {
        setAccessStatus("UNAUTHORIZED");
      }
    }

    checkAccess();
  }, [searchParams]);

  const handleCnpjInputChange = (val: string) => {
    setCnpjInput(maskCNPJInput(val));
    if (errorMsg) setErrorMsg("");
  };

  const handleSearchCNPJ = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = cleanCNPJ(cnpjInput);

    if (!isValidCNPJFormat(clean)) {
      setErrorMsg("CNPJ inválido. Confira o número informado.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cnpj/${clean}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Não foi possível consultar os dados agora. Tente novamente.");
        return;
      }

      const nameForSlug = data.trade_name || data.legal_name || "empresa-licitante";
      const generatedSlug = nameForSlug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      setFormData((prev) => ({
        ...prev,
        cnpj: data.cnpj || clean,
        legal_name: data.legal_name || "",
        trade_name: data.trade_name || data.legal_name || "",
        status: data.status || "ATIVA",
        opening_date: data.opening_date || "",
        legal_nature: data.legal_nature || "",
        company_size: data.company_size || "",
        share_capital: data.share_capital || "",
        headquarters_or_branch: data.headquarters_or_branch || "MATRIZ",
        cep: data.cep || "",
        street: data.street || "",
        number: data.number || "S/N",
        complement: data.complement || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        full_address: data.full_address || "",
        main_cnae_code: data.main_cnae_code || "",
        main_cnae_description: data.main_cnae_description || "",
        secondary_cnaes: data.secondary_cnaes || [],
        is_simples_nacional: data.is_simples_nacional,
        is_mei: data.is_mei,
        tax_regime: data.tax_regime || "",
        partners: data.partners || [],
        slug: generatedSlug,
        integrity_officer_name: data.partners?.[0]?.name || prev.integrity_officer_name || "",
        compliance_officer_name: data.partners?.[0]?.name || prev.compliance_officer_name || "",
      }));

      setStep("CONFIRM_DATA");
    } catch (err: any) {
      setErrorMsg("Não foi possível consultar os dados agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const [provisioningStatus, setProvisioningStatus] = useState("CRIANDO AMBIENTE...");
  const [createdTenantInfo, setCreatedTenantInfo] = useState<{ companyName: string; slug: string } | null>(null);

  const handleFinishOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cnpj || !formData.legal_name) {
      setErrorMsg("Dados cadastrais incompletos. Por favor, revise.");
      return;
    }

    setErrorMsg("");
    setStep("CREATING_ENVIRONMENT");
    setProvisioningStatus("CRIANDO AMBIENTE...");

    try {
      // Simula a progressão transparente de inicialização
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProvisioningStatus("CONFIGURANDO PROGRAMA DE INTEGRIDADE...");

      const res = await submitOnboardingAction(formData);

      if (!res.success) {
        setErrorMsg(res.error || "Falha ao criar ambiente da empresa.");
        setStep("COMPLIANCE_DETAILS");
        return;
      }

      // Sincroniza o tenant imediatamente no client mockStore e localStorage do browser
      if (res.company) {
        mockStore.saveClientTenant(res.company);
      } else {
        mockStore.saveClientTenant({
          id: res.companyId || "comp-" + Date.now(),
          trade_name: formData.trade_name || formData.legal_name || "Sua Empresa",
          legal_name: formData.legal_name || "Sua Empresa",
          cnpj: cleanCNPJ(formData.cnpj || ""),
          slug: res.slug || formData.slug || "minha-empresa",
          created_at: new Date().toISOString(),
          status: formData.status || "ATIVA",
          ...formData,
        } as Company);
      }

      await new Promise((resolve) => setTimeout(resolve, 900));
      setProvisioningStatus("AMBIENTE PRONTO");
      setCreatedTenantInfo({
        companyName: res.companyName || formData.trade_name || formData.legal_name || "Sua Empresa",
        slug: res.slug || formData.slug || "minha-empresa",
      });
      setStep("SUCCESS_READY");
    } catch (err: any) {
      setErrorMsg("Falha ao salvar dados da empresa.");
      setStep("COMPLIANCE_DETAILS");
    }
  };

  // 1. ESTADO DE CHECAGEM
  if (accessStatus === "CHECKING") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 max-w-md shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Validando autorização de acesso...</h2>
            <p className="text-xs text-slate-400">Verificando status de assinatura no sistema seguro.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. ESTADO NÃO AUTORIZADO (Tentativa de acesso sem pagamento confirmado)
  if (accessStatus === "UNAUTHORIZED") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">
              Onboarding Exclusivo para Assinantes
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              O cadastro e a criação do ambiente corporativo no TechCompliance são liberados após a confirmação da assinatura do plano.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/acessar-demo"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Acessar versão demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/precos"
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Conhecer Planos e Assinar</span>
            </Link>

            <Link
              href="/login"
              className="w-full text-slate-400 hover:text-white text-xs font-semibold py-2 block transition-colors"
            >
              Já sou cliente • Entrar com minha conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. ESTADO AUTORIZADO (PAGAMENTO CONFIRMADO)
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="max-w-3xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in">
        {/* Header Institucional */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">TechCompliance</span>
              <p className="text-[11px] text-slate-400">Onboarding de Integridade para Fornecedores Públicos</p>
            </div>
          </div>

          {/* Indicador de Passos */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span
              className={`px-2.5 py-1 rounded-full border ${
                step === "CNPJ_INPUT"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              1. CNPJ
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2.5 py-1 rounded-full border ${
                step === "CONFIRM_DATA"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              2. Confirmação
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2.5 py-1 rounded-full border ${
                step === "COMPLIANCE_DETAILS"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              3. Governança
            </span>
          </div>
        </div>

        {/* Banner de Boas-Vindas Pós-Pagamento */}
        <Suspense fallback={null}>
          <OnboardingPaidBanner />
        </Suspense>

        {/* Banner de Diagnóstico Prévio Localizado e Vinculado */}
        {linkedDiagnostic && (
          <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-200 flex items-center justify-between gap-4 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Diagnóstico Prévio Localizado! ({linkedDiagnostic.score}% estruturado)
                </h3>
                <p className="text-xs text-blue-200/90">
                  Os requisitos avaliados da empresa {linkedDiagnostic.tradeName} serão vinculados automaticamente ao seu novo ambiente.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shrink-0 hidden sm:inline-block">
              Vinculação Ativa
            </span>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASSO 1: INFORMAR CNPJ */}
        {/* =================================================================== */}
        {step === "CNPJ_INPUT" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Consulta Automática em Bases Oficiais
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Vamos configurar sua empresa
              </h1>
              <p className="text-sm text-slate-400">
                Digite o CNPJ da empresa para começar. Nós consultamos a Receita Federal e preenchemos dados cadastrais, endereço, CNAE e sócios automaticamente.
              </p>
            </div>

            <form onSubmit={handleSearchCNPJ} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  CNPJ da Empresa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cnpjInput}
                    maxLength={18}
                    onChange={(e) => handleCnpjInputChange(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    autoFocus
                    required
                    className="w-full text-base sm:text-lg font-mono px-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Compatível com o formato numérico atual e preparado para o padrão alfanumérico.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !cnpjInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Consultando bases oficiais da Receita Federal...</span>
                  </>
                ) : (
                  <>
                    <span>Consultar CNPJ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Já tem uma empresa cadastrada? Pular para o Painel
              </Link>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASSO 2: CONFIRMAR DADOS ENCONTRADOS */}
        {/* =================================================================== */}
        {step === "CONFIRM_DATA" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Encontramos sua empresa
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Confira os dados antes de continuar</h2>
                <p className="text-xs text-slate-400">
                  Os dados foram obtidos automaticamente. Se necessário, clique em &quot;Corrigir dados&quot; para ajustar qualquer informação.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingData(!isEditingData)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  isEditingData
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditingData ? "Concluir Edição" : "Corrigir dados"}
              </button>
            </div>

            {/* CARD 1: DADOS DA EMPRESA */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Dados da Empresa
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Preenchido automaticamente
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">CNPJ</label>
                  <div className="font-mono font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {formatCNPJ(formData.cnpj || "")}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Situação Cadastral</label>
                  {isEditingData ? (
                    <input
                      type="text"
                      value={formData.status || ""}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white font-bold"
                    />
                  ) : (
                    <div className="font-bold text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {formData.status || "ATIVA"}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Razão Social Oficial</label>
                  {isEditingData ? (
                    <input
                      type="text"
                      value={formData.legal_name || ""}
                      onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white font-bold text-sm"
                    />
                  ) : (
                    <div className="font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-sm">
                      {formData.legal_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nome Fantasia</label>
                  {isEditingData ? (
                    <input
                      type="text"
                      value={formData.trade_name || ""}
                      onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white font-semibold"
                    />
                  ) : (
                    <div className="font-semibold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {formData.trade_name || formData.legal_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Porte da Empresa</label>
                  {isEditingData ? (
                    <input
                      type="text"
                      value={formData.company_size || ""}
                      onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  ) : (
                    <div className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {formData.company_size || "Não especificado"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Data de Abertura</label>
                  <div className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {formData.opening_date || "Não disponível"}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Capital Social</label>
                  <div className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {formData.share_capital
                      ? Number(formData.share_capital).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : "Não informado"}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Natureza Jurídica</label>
                  <div className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {formData.legal_nature || "Não disponível"}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: ENDEREÇO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Endereço Cadastrado
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Preenchido automaticamente
                </span>
              </div>

              {isEditingData ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Logradouro</label>
                    <input
                      type="text"
                      value={formData.street || ""}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Número</label>
                    <input
                      type="text"
                      value={formData.number || ""}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.neighborhood || ""}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Município / UF</label>
                    <input
                      type="text"
                      value={`${formData.city || ""} - ${formData.state || ""}`}
                      onChange={(e) => {
                        const [c, u] = e.target.value.split("-");
                        setFormData({ ...formData, city: c?.trim() || "", state: u?.trim() || "" });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CEP</label>
                    <input
                      type="text"
                      value={formData.cep || ""}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
                  {formData.full_address ||
                    `${formData.street}, ${formData.number} - ${formData.neighborhood} - ${formData.city}/${formData.state} - CEP: ${formData.cep}`}
                </div>
              )}
            </div>

            {/* CARD 3: ATIVIDADES & REGIME TRIBUTÁRIO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Atividades & Regime Tributário
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Preenchido automaticamente
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">CNAE Principal:</span>
                  <div className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <strong className="text-blue-400">{formData.main_cnae_code}</strong> -{" "}
                    {formData.main_cnae_description || "Atividade principal registrada na Receita"}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block mb-1">Regime Tributário Estimado:</span>
                    <div className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-semibold">
                      {formData.tax_regime || "Lucro Presumido / Lucro Real"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Optante pelo Simples / MEI:</span>
                    <div className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {formData.is_simples_nacional
                        ? "Sim (Simples Nacional)"
                        : formData.is_mei
                        ? "Sim (MEI)"
                        : "Não optante"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: QUADRO SOCIETÁRIO (QSA) */}
            {formData.partners && formData.partners.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Quadro de Sócios e Administradores (QSA)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {formData.partners.length} sócio(s) localizado(s)
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {formData.partners.map((p, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {p.role} {p.cpf_cnpj_masked ? `• CPF: ${p.cpf_cnpj_masked}` : ""}
                        </div>
                      </div>
                      {p.age_range && (
                        <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {p.age_range}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de Ação do Passo 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("CNPJ_INPUT")}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>

              <button
                type="button"
                onClick={() => setStep("COMPLIANCE_DETAILS")}
                className="flex-1 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Confirmar e continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASSO 3: INFORMAÇÕES EXCLUSIVAS DE COMPLIANCE */}
        {/* =================================================================== */}
        {step === "COMPLIANCE_DETAILS" && (
          <form onSubmit={handleFinishOnboarding} className="space-y-6 animate-in fade-in">
            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-0.5 rounded-full text-xs font-bold border border-blue-400/30">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                Estruturação do Programa de Integridade
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Finalizar Configuração de Governança
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solicitamos apenas as informações específicas de conformidade que não constam na base do CNPJ e são essenciais para gerar seu Dossiê da Lei nº 14.133/2021 e NR-1.
              </p>
            </div>

            <div className="space-y-4">
              {/* Responsável pelo Programa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Responsável pelo Programa de Integridade *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.integrity_officer_name || ""}
                      onChange={(e) => setFormData({ ...formData, integrity_officer_name: e.target.value })}
                      placeholder="Ex: Dra. Mariana Silva"
                      required
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Nome de quem responderá formalmente perante os órgãos de contratação.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Responsável pelo Compliance / Ouvidoria
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.compliance_officer_name || ""}
                      onChange={(e) => setFormData({ ...formData, compliance_officer_name: e.target.value })}
                      placeholder="Ex: Comitê de Ética / Dr. Carlos Rocha"
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ShieldCheck className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Contato do Responsável */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    E-mail do Responsável *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.integrity_officer_email || ""}
                      onChange={(e) => setFormData({ ...formData, integrity_officer_email: e.target.value })}
                      placeholder="compliance@suaempresa.com.br"
                      required
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Mail className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Telefone / WhatsApp para Notificações *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.integrity_officer_phone || ""}
                      onChange={(e) => setFormData({ ...formData, integrity_officer_phone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      required
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Senha de Acesso do Gestor para Login Seguro */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Defina a Senha de Acesso do Gestor *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={(formData as any).password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value } as any)}
                    placeholder="Mínimo 8 caracteres (letras, números, símbolos)"
                    required
                    minLength={8}
                    className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Esta senha será utilizada para acessar o painel de integridade pelo e-mail informado acima.
                </p>
              </div>

              {/* Porte e Quantidade aproximada de colaboradores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Quantidade Estimada de Colaboradores
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={formData.approximate_employees_count || 10}
                      onChange={(e) =>
                        setFormData({ ...formData, approximate_employees_count: Number(e.target.value) })
                      }
                      required
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Users className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Utilizado para calcular a taxa de adesão ao treinamento de microlearning.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Identificador do Link Único (Slug)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300">
                    <span className="text-slate-500">/treinar/</span>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="bg-transparent text-blue-400 font-bold focus:outline-none w-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Link exclusivo para compartilhamento no WhatsApp da sua equipe.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões Finais */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep("CONFIRM_DATA")}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar aos dados
              </button>

              <button
                type="submit"
                className="flex-1 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>Concluir Onboarding e Entrar no TechCompliance</span>
              </button>
            </div>
          </form>
        )}

        {/* =================================================================== */}
        {/* ESTADO 4: CRIANDO AMBIENTE / CONFIGURANDO PROGRAMA DE INTEGRIDADE */}
        {/* =================================================================== */}
        {step === "CREATING_ENVIRONMENT" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-10 h-10 animate-pulse" />
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-blue-500/20 blur-xl -z-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                {provisioningStatus}
              </span>
              <h2 className="text-2xl font-black text-white">
                Inicializando o ambiente seguro da sua empresa
              </h2>
              <p className="text-xs text-slate-400">
                Estamos gerando o Código de Conduta exclusivo da empresa, estruturando os 32 requisitos normativos da Lei nº 14.133/2021 e ativando seu Canal de Denúncias independente.
              </p>
            </div>

            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-[shimmer_1.5s_infinite] w-full" />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ESTADO 5: AMBIENTE PRONTO & BOAS-VINDAS */}
        {/* =================================================================== */}
        {step === "SUCCESS_READY" && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-lg">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/15 px-3.5 py-1 rounded-full border border-emerald-500/30">
                <Check className="w-4 h-4" />
                Ambiente Configurado com Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Bem-vindo ao TechCompliance, {createdTenantInfo?.companyName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                O seu Programa de Integridade foi estruturado com os dados oficiais da sua empresa. Os 32 requisitos normativos, o Código de Conduta e o Canal de Denúncias estão ativos e prontos para uso.
              </p>
            </div>

            <div className="w-full max-w-sm pt-4">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Entrar no meu programa de integridade</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterCompanyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">Carregando...</div>}>
      <RegisterCompanyForm />
    </Suspense>
  );
}
