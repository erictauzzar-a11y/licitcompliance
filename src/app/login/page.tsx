"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { loginAdminAction } from "@/app/actions/auth";

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
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.error || "Credenciais inválidas.");
      }
    } catch (err: any) {
      setErrorMsg("Erro ao processar autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("compliance@translog.com.br");
    setPassword("LicitCompliance#2026");
    setErrorMsg("");
  };

  return (
    <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl text-white shadow-lg mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">LicitCompliance</h1>
        <p className="text-xs text-slate-400">
          Acesso exclusivo para Gestores e Oficiais de Integridade
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            E-mail Corporativo
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@empresa.com.br"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Senha de Acesso
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm mt-2"
        >
          {loading ? "Autenticando..." : "Entrar no Painel Seguro"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Usar Credenciais de Auditoria / Demonstração
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
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
