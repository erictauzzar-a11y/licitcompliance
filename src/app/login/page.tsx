"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { loginAdminAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await loginAdminAction(email, password);
      if (res.success) {
        router.push(res.redirectTo || redirectUrl);
      } else {
        setErrorMsg(res.error || "Credenciais inválidas.");
      }
    } catch {
      setErrorMsg("Erro ao processar autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("compliance@translog.com.br");
    setPassword("TechCompliance#2026");
    setErrorMsg("");
  };

  return (
    <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl text-white shadow-lg mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">TechCompliance</h1>
        <p className="text-xs text-slate-400">
          Acesso exclusivo para Gestores e Oficiais de Integridade
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            E-mail Corporativo
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@empresa.com.br"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Senha de Acesso
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Entrar no Painel Seguro
        </Button>
      </form>

      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Usar Credenciais de Auditoria / Demonstração
        </button>
      </div>

      <div className="text-center space-y-2">
        <Link
          href="/acessar-demo"
          className="block text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          Ainda não tem acesso? Acessar versão demo →
        </Link>
        <Link
          href="/"
          className="block text-xs text-slate-400 hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 font-sans">
      <Suspense fallback={<div className="text-xs text-slate-400">Carregando painel de acesso...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
