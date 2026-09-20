"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CheckoutButtonProps {
  className?: string;
  label?: string;
  showIcon?: boolean;
  companyName?: string;
  cnpj?: string;
  email?: string;
}

export function CheckoutButton({
  className = "",
  label = "Acessar versão demo",
  showIcon = false,
}: CheckoutButtonProps) {
  return (
    <Link
      href="/acessar-demo"
      className={`relative inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${className}`}
    >
      {showIcon && <Sparkles className="w-4 h-4 text-blue-300" />}
      <span>{label || "Acessar versão demo"}</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
