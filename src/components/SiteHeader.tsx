"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  FileCheck2,
  Lock,
  Users,
  Search,
  FileDown,
  Layers,
  FileText,
  AlertTriangle,
  Award,
  Scale,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  SOLUTIONS_ITEMS,
  RESOURCES_ITEMS,
  LEGISLATION_ITEMS,
  NavItem,
} from "@/config/navigation";

// Mapeamento dinâmico de ícones
const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  Users,
  Search,
  FileDown,
  Layers,
  FileText,
  AlertTriangle,
  Award,
  Scale,
  AlertCircle,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICON_MAP[name] || FileText;
  return <IconComponent className={className || "w-4 h-4"} />;
}

export function SiteHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitorar rolagem para compactar cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar dropdown ao navegar (tecla Escape)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDropdownToggle = (menuName: string) => {
    setActiveDropdown((prev) => (prev === menuName ? null : menuName));
  };

  const handleMobileAccordionToggle = (menuName: string) => {
    setMobileAccordion((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-2xl border-slate-800 shadow-xl shadow-black/50"
          : "bg-slate-950/80 backdrop-blur-xl border-white/10"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-16" : "h-20"
        }`}
        ref={dropdownRef}
      >
        {/* LOGO INSTITUCIONAL */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={() => setActiveDropdown(null)}
            className="flex items-center gap-3 font-bold text-lg text-white group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight tracking-tight font-black text-xl">TechCompliance</span>
              <span className="text-[10px] text-blue-300 font-normal hidden sm:inline">
                Conformidade que gera oportunidades
              </span>
            </div>
          </Link>

          {/* NAVEGAÇÃO DESKTOP COM DROPDOWNS RICOS */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-200">
            {/* 1. SOLUÇÕES DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("solucoes")}
                aria-expanded={activeDropdown === "solucoes"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5 ${
                  activeDropdown === "solucoes" ? "text-white bg-white/10" : "text-slate-200"
                }`}
              >
                <span>Soluções</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "solucoes" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>

              {activeDropdown === "solucoes" && (
                <div className="absolute top-full left-0 mt-2 w-[480px] p-4 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>Soluções para Fornecedores</span>
                    <span className="text-blue-400">Lei 14.133 / NR-1</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-2">
                    {SOLUTIONS_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 group/item"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors shrink-0 mt-0.5">
                          <NavIcon name={item.iconName} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs group-hover/item:text-blue-300 transition-colors">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. COMO FUNCIONA (LINK DIRETO) */}
            <Link
              href="/como-funciona"
              onClick={() => setActiveDropdown(null)}
              className="px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Como Funciona
            </Link>

            {/* 3. RECURSOS DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("recursos")}
                aria-expanded={activeDropdown === "recursos"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5 ${
                  activeDropdown === "recursos" ? "text-white bg-white/10" : "text-slate-200"
                }`}
              >
                <span>Recursos</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "recursos" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>

              {activeDropdown === "recursos" && (
                <div className="absolute top-full left-0 mt-2 w-[520px] p-4 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>Módulos do Sistema</span>
                    <span className="text-emerald-400">Telas Reais</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    {RESOURCES_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-2.5 group/item"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 group-hover/item:border-blue-500/50 group-hover/item:text-blue-400 transition-colors shrink-0 mt-0.5">
                          <NavIcon name={item.iconName} className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs truncate group-hover/item:text-blue-300 transition-colors">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. LEGISLAÇÃO DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("legislacao")}
                aria-expanded={activeDropdown === "legislacao"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5 ${
                  activeDropdown === "legislacao" ? "text-white bg-white/10" : "text-slate-200"
                }`}
              >
                <span>Legislação</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "legislacao" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>

              {activeDropdown === "legislacao" && (
                <div className="absolute top-full left-0 mt-2 w-[460px] p-4 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>Base Normativa de Integridade</span>
                    <span className="text-amber-400">Apoio Probatório</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-2">
                    {LEGISLATION_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 group/item"
                      >
                        <div className="p-2 rounded-lg bg-slate-900 text-blue-400 border border-slate-800 group-hover/item:border-blue-500/50 group-hover/item:text-white group-hover/item:bg-blue-600 transition-colors shrink-0 mt-0.5">
                          <NavIcon name={item.iconName} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-white text-xs block group-hover/item:text-blue-300 transition-colors">
                            {item.title}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. PARA EMPRESAS */}
            <Link
              href="/para-empresas"
              onClick={() => setActiveDropdown(null)}
              className="px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Para Empresas
            </Link>

            {/* 6. PREÇOS */}
            <Link
              href="/precos"
              onClick={() => setActiveDropdown(null)}
              className="px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Preços
            </Link>

            {/* 7. FALE CONOSCO */}
            <a
              href="mailto:suportegrupodigitalajuda@gmail.com?subject=Contato%20TechCompliance"
              onClick={() => setActiveDropdown(null)}
              className="px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5 text-slate-200"
            >
              Fale Conosco
            </a>
          </nav>
        </div>

        {/* CTAS DESKTOP */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-200 hover:text-white px-3 py-2 transition-colors rounded-xl hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link
            href="/acessar-demo"
            className="text-xs font-bold text-slate-100 hover:text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all active:scale-[0.98]"
          >
            Acessar versão demo
          </Link>
          <Link
            href="/diagnostico"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Diagnóstico Gratuito</span>
          </Link>
        </div>

        {/* BOTÃO MOBILE (MENU HAMBÚRGUER) */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/diagnostico"
            className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg"
          >
            Diagnóstico
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* PAINEL MOBILE COMPLETO (ACCORDIONS) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {/* Accordion Soluções */}
            <div className="border-b border-white/5 pb-2">
              <button
                type="button"
                onClick={() => handleMobileAccordionToggle("solucoes")}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-white"
              >
                <span>Soluções</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileAccordion === "solucoes" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>
              {mobileAccordion === "solucoes" && (
                <div className="space-y-2 pt-2 pl-2">
                  {SOLUTIONS_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-300 hover:text-blue-400"
                    >
                      <NavIcon name={item.iconName} className="w-4 h-4 text-blue-400" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Link Como Funciona */}
            <div className="border-b border-white/5 py-2">
              <Link
                href="/como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-white hover:text-blue-400"
              >
                Como Funciona
              </Link>
            </div>

            {/* Accordion Recursos */}
            <div className="border-b border-white/5 pb-2">
              <button
                type="button"
                onClick={() => handleMobileAccordionToggle("recursos")}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-white"
              >
                <span>Recursos</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileAccordion === "recursos" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>
              {mobileAccordion === "recursos" && (
                <div className="space-y-2 pt-2 pl-2">
                  {RESOURCES_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-300 hover:text-blue-400"
                    >
                      <NavIcon name={item.iconName} className="w-4 h-4 text-blue-400" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion Legislação */}
            <div className="border-b border-white/5 pb-2">
              <button
                type="button"
                onClick={() => handleMobileAccordionToggle("legislacao")}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-white"
              >
                <span>Legislação</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileAccordion === "legislacao" ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>
              {mobileAccordion === "legislacao" && (
                <div className="space-y-2 pt-2 pl-2">
                  {LEGISLATION_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-300 hover:text-blue-400"
                    >
                      <NavIcon name={item.iconName} className="w-4 h-4 text-blue-400" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Link Para Empresas */}
            <div className="border-b border-white/5 py-2">
              <Link
                href="/para-empresas"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-white hover:text-blue-400"
              >
                Para Empresas
              </Link>
            </div>

            {/* Link Preços */}
            <div className="border-b border-white/5 py-2">
              <Link
                href="/precos"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-white hover:text-blue-400"
              >
                Preços
              </Link>
            </div>

            {/* Link Fale Conosco */}
            <div className="border-b border-white/5 py-2">
              <a
                href="mailto:suportegrupodigitalajuda@gmail.com?subject=Contato%20TechCompliance"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-200 hover:text-blue-400"
              >
                Fale Conosco (suportegrupodigitalajuda@gmail.com)
              </a>
            </div>
          </div>

          <div className="pt-4 space-y-2.5">
            <Link
              href="/acessar-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-center text-sm font-bold text-white block shadow-lg shadow-blue-600/40 hover:bg-blue-500 transition-all"
            >
              Acessar versão demo
            </Link>
            <Link
              href="/diagnostico"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-center text-sm font-bold text-white block hover:bg-white/15 transition-all"
            >
              Fazer Diagnóstico Gratuito
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl border border-slate-700 text-center text-sm font-bold text-white block hover:bg-white/5"
            >
              Acessar Conta (Entrar)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
