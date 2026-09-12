import Stripe from "stripe";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "TechCompliance SaaS",
    version: "1.0.0",
  },
});

export const STRIPE_CONFIG = {
  productId: "prod_VFP7uWUaDGiTBS",
  priceId: process.env.STRIPE_PRICE_ID || "price_1UEuJNGx475CvFbvL6hjIAP1",
  currency: "brl",
  amountMonthly: 189.9,
};
