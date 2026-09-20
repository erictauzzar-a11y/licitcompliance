"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Building2,
  ArrowRight,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { submitDemoRequest } from "@/app/actions/demo";

// Utilitário de formatação de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : "";
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function AcessarDemoPage() {
  // Estados do formulário (exatamente 4 campos + honeypot oculto)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company_name: "",
    website_hp: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Manipulação de inputs
  const handleInputChange = (field: string, value: string) => {
    let finalVal = value;
    if (field === "phone") {
      finalVal = formatPhone(value);
    }
    setFormData((prev) => ({ ...prev, [field]: finalVal }));

    // Limpa erro do campo ao digitar
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (globalError) {
      setGlobalError(null);
    }
  };

  // Validação no frontend antes de enviar
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Este campo é obrigatório.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Informe seu nome completo.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errors.phone = "Este campo é obrigatório.";
    } else if (cleanPhone.length < 10) {
      errors.phone = "Informe um telefone com DDD válido.";
    }

    if (!formData.email.trim()) {
      errors.email = "Este campo é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Informe um e-mail válido.";
    }

    if (!formData.company_name.trim()) {
      errors.company_name = "Este campo é obrigatório.";
    } else if (formData.company_name.trim().length < 2) {
      errors.company_name = "Informe o nome da empresa.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const res = await submitDemoRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company_name: formData.company_name,
        website_hp: formData.website_hp,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
        setGlobalError(
          res.error || "Não foi possível enviar sua solicitação. Tente novamente."
        );
      }
    } catch {
      setGlobalError("Não foi possível enviar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Elementos visuais de fundo sutis */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          {/* Card Central */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-10">
            {isSuccess ? (
              /* TELA DE SUCESSO APÓS O CADASTRO */
              <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Solicitação recebida!
                  </h2>
                  <div className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto space-y-3">
                    <p>Obrigado pelo interesse no TechCompliance.</p>
                    <p>
                      Recebemos seus dados.{" "}
                      <strong className="text-white font-semibold">
                        Nossa equipe entrará em contato com você para apresentar a plataforma e liberar seu acesso à versão demo.
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all border border-slate-700/80"
                  >
                    <span>Voltar à página inicial</span>
                  </Link>
                  <Link
                    href="/como-funciona"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
                  >
                    <span>Conhecer a plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO DE CADASTRO */
              <div>
                {/* Header do Formulário */}
                <div className="text-center space-y-3 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Acesso Exclusivo à Demonstração</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Acesse a versão demo do TechCompliance
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    Preencha seus dados e nossa equipe entrará em contato para apresentar o TechCompliance e liberar seu acesso à versão demo.
                  </p>
                </div>

                {/* Alerta de Erro Geral */}
                {globalError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{globalError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Campo 1: Nome completo */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-slate-200"
                    >
                      Nome completo <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.name
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-rose-400 text-xs font-medium pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Campo 2: Telefone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-slate-200"
                    >
                      Telefone / WhatsApp <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.phone
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-rose-400 text-xs font-medium pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Campo 3: E-mail */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-slate-200"
                    >
                      E-mail <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="carlos@empresa.com.br"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.email
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-rose-400 text-xs font-medium pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Campo 4: Nome da empresa */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="company_name"
                      className="block text-xs font-semibold text-slate-200"
                    >
                      Nome da empresa <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        id="company_name"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.company_name}
                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                        placeholder="Ex: Construtora Aliança Ltda"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                          fieldErrors.company_name
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.company_name && (
                      <p className="text-rose-400 text-xs font-medium pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.company_name}
                      </p>
                    )}
                  </div>

                  {/* Campo Invisível Honeypot (Anti-Spam para bots) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website_hp}
                      onChange={(e) => handleInputChange("website_hp", e.target.value)}
                    />
                  </div>

                  {/* Botão de Envio */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <span>Solicitar acesso à demo</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Informação de Segurança & Privacidade */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Seus dados estão protegidos. Contato estritamente corporativo.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
