import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechCompliance | Plataforma de Gestão de Integridade e Compliance Licitatório (Lei 14.133)",
    template: "%s | TechCompliance",
  },
  description:
    "Software de gestão e comprovação de Programa de Integridade e Compliance para empresas fornecedoras do setor público. Canal de Denúncias, Treinamentos e Dossiê probatório auditável.",
  keywords: [
    "compliance licitatório",
    "programa de integridade",
    "lei 14.133",
    "lei 14.457",
    "canal de denúncias",
    "dossiê de integridade",
    "licitações públicas",
    "techcompliance",
  ],
  authors: [{ name: "TechCompliance Tecnologia" }],
  creator: "TechCompliance",
  metadataBase: new URL("https://techcompliance.vercel.app"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://techcompliance.vercel.app",
    title: "TechCompliance | Gestão de Integridade para Licitações Públicas",
    description:
      "Plataforma completa para estruturação, capacitação e emissão de dossiês de integridade exigidos pela Nova Lei de Licitações (Lei 14.133/2021).",
    siteName: "TechCompliance",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-600 selection:text-white">{children}</body>
    </html>
  );
}
