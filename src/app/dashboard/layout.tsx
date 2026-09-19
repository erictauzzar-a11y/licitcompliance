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
  LogOut,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAdminAction } from "@/app/actions/auth";
import { mockStore } from "@/lib/mock-data";
import { formatCNPJ } from "@/lib/utils";
import { CompanyProvider, useCompany } from "@/contexts/CompanyContext";

// Componente interno que consome o contexto
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { company, isLoading, snapshot } = useCompany();

  const navGroups = [
    {
      group: "Principal",
      items: [
        {
          label: "Visão Geral",
          href: "/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/dashboard",
        },
      ],
    },
    {
      group: "Programa de Integridade",
      items: [
        {
          label: "Diagnóstico do Programa",
          href: "/dashboard/diagnostico",
          icon: ShieldCheck,
          active: pathname.startsWith("/dashboard/diagnostico"),
          badge: snapshot ? `${snapshot.overallScore}%` : undefined,
        },
        {
          label: "Código & Políticas",
          href: "/dashboard/politicas",
          icon: FileText,
          active: pathname.startsWith("/dashboard/politicas"),
        },
        {
          label: "Biblioteca de Modelos",
          href: "/dashboard/biblioteca",
          icon: BookOpen,
          active: pathname.startsWith("/dashboard/biblioteca"),
        },
      ],
    },
    {
      group: "Operação & Pessoas",
      items: [
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
          label: "Due Diligence (DDI)",
          href: "/dashboard/due-diligence",
          icon: ShieldCheck,
          active: pathname.startsWith("/dashboard/due-diligence") || pathname.startsWith("/dashboard/fornecedores"),
        },
      ],
    },
    {
      group: "Evidências & Licitações",
      items: [
        {
          label: "Analisar Edital",
          href: "/dashboard/analise-edital",
          icon: FileText,
          active: pathname.startsWith("/dashboard/analise-edital"),
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
      ],
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
          {isLoading ? (
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
          ) : (
            <>
              <div className="font-bold text-sm text-white truncate">{company?.trade_name ?? "—"}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                CNPJ: {company ? formatCNPJ(company.cnpj) : "—"}
              </div>
            </>
          )}
        </div>

        {/* Links de Navegação Agrupados */}
        <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      item.active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
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
          {company && (
            <>
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
            </>
          )}
        </div>
      </aside>

      {/* Conteúdo Principal da Dashboard */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Painel de Gestão de Integridade Licitatória (Lei 14.133) e NR-1 (Lei 14.457)
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {snapshot && (
              <Link
                href="/dashboard/diagnostico"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full transition-colors shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Maturidade: {snapshot.overallScore}% • {snapshot.requirementsCount.met}/{snapshot.requirementsCount.total} Requisitos
              </Link>
            )}
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
                mockStore.clearClientTenant();
                // Limpa o localStorage do tenant
                if (typeof window !== "undefined") {
                  localStorage.removeItem("techcompliance_active_tenant");
                }
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </CompanyProvider>
  );
}
