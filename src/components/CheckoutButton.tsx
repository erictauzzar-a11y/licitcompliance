"use client";

import { useState } from "react";
import { CreditCard, Loader2, ArrowRight } from "lucide-react";
import { createCheckoutSessionAction } from "@/app/actions/stripe";

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
  label = "Assinar Agora • R$ 189,90/mês",
  showIcon = true,
  companyName,
  cnpj,
  email,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await createCheckoutSessionAction({ companyName, cnpj, email });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`relative inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Redirecionando para o Stripe Seguro...</span>
        </>
      ) : (
        <>
          {showIcon && <CreditCard className="w-4 h-4 text-blue-200" />}
          <span>{label}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
