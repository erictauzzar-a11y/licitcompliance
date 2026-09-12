import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, FileText, CheckCircle2 } from "lucide-react";
import { SOLUTIONS_ITEMS, RESOURCES_ITEMS, LEGISLATION_ITEMS } from "@/config/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs selection:bg-blue-600 selection:text-white">
      {/* SEÇÃO PRINCIPAL DE LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Coluna 1: Marca e Posicionamento */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="leading-tight tracking-tight font-black text-xl">TechCompliance</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma de Gestão Tecnológica de Integridade para Contratações Públicas. Diagnostique requisitos, organize evidências auditáveis e gere dossiês com validação pública perante a Lei nº 14.133/2021 e NR-1.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Criptografia SHA-256</span>
              </span>
              <span>•</span>
              <span>Privacidade LGPD</span>
            </div>
          </div>

          {/* Coluna 2: Soluções */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Soluções</h4>
            <ul className="space-y-2 text-xs">
              {SOLUTIONS_ITEMS.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/como-funciona" className="text-blue-400 font-semibold hover:underline">
                  Ver Como Funciona →
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Recursos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Recursos do Sistema</h4>
            <ul className="space-y-2 text-xs">
              {RESOURCES_ITEMS.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/para-empresas" className="hover:text-blue-400 transition-colors">
                  Para Empresas Licitantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legislação & Acesso */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Base Legal</h4>
            <ul className="space-y-2 text-xs">
              {LEGISLATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/precos" className="text-emerald-400 font-bold hover:underline">
                  Planos e Preços →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* AVISO LEGAL DE RESPONSABILIDADE REGULATÓRIA */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 bg-slate-900/40 p-5 rounded-2xl text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">Aviso Regulatório e Isenção Legal:</p>
          O TechCompliance é uma plataforma de tecnologia voltada ao apoio à gestão, estruturação documental e organização probatória de Programas de Integridade corporativos. O sistema não atua como órgão certificador oficial, não emite parecer jurídico vinculante, não substitui auditoria legal independente e não garante vitória em certames licitatórios ou aprovação compulsória por comissões de contratação do Poder Público.
        </div>
      </div>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="mailto:suportegrupodigitalajuda@gmail.com?subject=Contato%20TechCompliance"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Fale Conosco: suportegrupodigitalajuda@gmail.com</span>
            </a>
            <Link href="/login" className="hover:text-white transition-colors">Acesso ao Painel</Link>
            <Link href="/cadastro" className="hover:text-white transition-colors">Cadastre sua Empresa</Link>
            <Link href="/precos" className="hover:text-white transition-colors">Assinatura</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
