"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileText,
  ExternalLink,
  Building2,
  Lock,
  LogOut,
  HelpCircle,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAdminAction } from "@/app/actions/auth";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const company = mockStore.getCompany();

  const navItems = [
    {
      label: "Visão Geral",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Diagnóstico do Programa",
      href: "/dashboard/diagnostico",
      icon: ShieldCheck,
      active: pathname.startsWith("/dashboard/diagnostico"),
    },
    {
      label: "Analisar Edital",
      href: "/dashboard/analise-edital",
      icon: FileText,
      active: pathname.startsWith("/dashboard/analise-edital"),
    },
    {
      label: "Due Diligence (DDI)",
      href: "/dashboard/due-diligence",
      icon: ShieldCheck,
      active: pathname.startsWith("/dashboard/due-diligence") || pathname.startsWith("/dashboard/fornecedores"),
    },
    {
      label: "Colaboradores & Treinos",
      href: "/dashboard/colaboradores",
      icon: Users,
      active: pathname.startsWith("/dashboard/colaboradores"),
    },
    {
      label: "Canal de Denúncias",
      href: "/dashboard/denuncias",
      icon: AlertTriangle,
      active: pathname.startsWith("/dashboard/denuncias"),
    },
    {
      label: "Código & Políticas",
      href: "/dashboard/politicas",
      icon: FileText,
      active: pathname.startsWith("/dashboard/politicas"),
    },
    {
      label: "Compartilhar Programa",
      href: "/dashboard/compartilhar",
      icon: ExternalLink,
      active: pathname.startsWith("/dashboard/compartilhar"),
    },
    {
      label: "Ajuda & Suporte",
      href: "/dashboard/ajuda",
      icon: HelpCircle,
      active: pathname.startsWith("/dashboard/ajuda"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Barra Lateral / Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-base tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>TechCompliance</span>
          </Link>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-400/30">
            SaaS B2B
          </span>
        </div>

        {/* Tenant Ativo */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Empresa / Fornecedor
          </div>
          <div className="font-bold text-sm text-white truncate">{company.trade_name}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">CNPJ: {formatCNPJ(company.cnpj)}</div>
        </div>

        {/* Links de Navegação */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Acesso aos Recursos Públicos do Programa */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Divulgação Pública</span>
            <Link
              href="/dashboard/compartilhar"
              className="text-[10px] text-blue-400 hover:underline font-semibold"
            >
              Gerenciar
            </Link>
          </div>
          <Link
            href={`/canal/${company.slug}`}
            target="_blank"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span className="truncate">Canal de Denúncias</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-red-400" />
          </Link>
          <Link
            href={`/treinar/${company.slug}`}
            target="_blank"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold transition-colors"
          >
            <span className="truncate">Treinamento Rápido</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal da Dashboard */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Painel de Gestão de Integridade Licitatória (Lei 14.133) e NR-1 (Lei 14.457)
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/dashboard/diagnostico"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full transition-colors shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Programa Estruturado (82%) • 24/32 Requisitos
            </Link>
            <Link
              href="/dashboard/ajuda"
              title="Ajuda e Suporte Técnico"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Ajuda & Suporte</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logoutAdminAction();
                window.location.href = "/login";
              }}
              title="Sair do Sistema"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>{children}</div>
          
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-500">
              TechCompliance Software de Gestão Tecnológica de Integridade • CNPJ e Dados Auditáveis
            </p>
            <p className="mt-1 leading-relaxed text-slate-400 max-w-4xl mx-auto">
              <strong>Aviso Legal (Disclaimer):</strong> O TechCompliance é uma plataforma tecnológica de gestão de conformidade e integridade corporativa em apoio ao cumprimento da Lei nº 14.133/2021 e NR-1 / Lei nº 14.457/2022. A disponibilização do software, dos modelos de código e das trilhas educativas não constitui assessoria ou consultoria jurídica privativa (Lei nº 8.906/1994), cabendo a cada organização validar suas rotinas junto ao seu corpo técnico e jurídico.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
