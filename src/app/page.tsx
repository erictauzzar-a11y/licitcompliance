import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhyItMattersSection } from "@/components/landing/WhyItMattersSection";
import { FreeDiagnosticSection } from "@/components/landing/FreeDiagnosticSection";
import { DiagnosticPreviewSection } from "@/components/landing/DiagnosticPreviewSection";
import { ModulesGridSection } from "@/components/landing/ModulesGridSection";
import { SystemInActionSection } from "@/components/landing/SystemInActionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { RegulatoryComplianceSection } from "@/components/landing/RegulatoryComplianceSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 1. HERO COM IMAGEM DE FUNDO ATMOSFÉRICA & NAVEGAÇÃO GLOBAL */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        {/* Imagem de Fundo (Camada 1) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/hero-reference-bg.jpg"
            alt="Ambiente de trabalho executivo TechCompliance"
            fill
            priority
            quality={90}
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="100vw"
          />
          {/* Overlays suaves para legibilidade e transição ao escuro */}
          <div className="absolute inset-0 bg-slate-950/60 sm:bg-slate-950/50 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
        </div>

        {/* Conteúdo do Topo & Hero (Camada 2) */}
        <div className="relative z-10 flex flex-col justify-between">
          <SiteHeader />
          <HeroSection />
        </div>
      </div>

      {/* 2. POR QUE ISSO IMPORTA */}
      <WhyItMattersSection />

      {/* 3. DIAGNÓSTICO GRATUITO */}
      <FreeDiagnosticSection />

      {/* 4. RESULTADO DO DIAGNÓSTICO */}
      <DiagnosticPreviewSection />

      {/* 5. O QUE O TECHCOMPLIANCE RESOLVE */}
      <ModulesGridSection />

      {/* 6. SISTEMA EM AÇÃO */}
      <SystemInActionSection />

      {/* 7. COMO FUNCIONA */}
      <HowItWorksSection />

      {/* 8. BASE NORMATIVA / CONFIANÇA */}
      <RegulatoryComplianceSection />

      {/* 9. PREÇO */}
      <PricingSection />

      {/* 10. FAQ */}
      <FaqSection />

      {/* 11. CTA FINAL */}
      <FinalCtaSection />

      {/* 12. FOOTER */}
      <SiteFooter />
    </div>
  );
}
