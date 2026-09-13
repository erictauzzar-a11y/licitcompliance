import Stripe from "stripe";

export const STRIPE_CONFIG = {
  productId: "prod_VFP7uWUaDGiTBS",
  priceId: process.env.STRIPE_PRICE_ID || "price_1UEuJNGx475CvFbvL6hjIAP1",
  currency: "brl",
  amountMonthly: 189.9,
};

/**
 * Retorna o cliente Stripe sob demanda (lazy initialization).
 * Evita falha no build da Vercel quando STRIPE_SECRET_KEY não está definida
 * no ambiente de CI/CD (a chave só é necessária em runtime).
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY não está configurada nas variáveis de ambiente do servidor."
    );
  }
  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia" as any,
    appInfo: {
      name: "TechCompliance SaaS",
      version: "1.0.0",
    },
  });
}

/**
 * @deprecated Use getStripe() para instanciação segura.
 * Mantido para compatibilidade com imports existentes quando a chave estiver disponível.
 */
export const stripe = {
  get webhooks() {
    return getStripe().webhooks;
  },
  get checkout() {
    return getStripe().checkout;
  },
  get customers() {
    return getStripe().customers;
  },
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get prices() {
    return getStripe().prices;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
};
