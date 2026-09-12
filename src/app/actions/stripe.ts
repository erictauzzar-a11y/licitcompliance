"use server";

import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckoutSessionAction(params?: {
  companyName?: string;
  cnpj?: string;
  email?: string;
}) {
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://techcompliance.vercel.app";

  let checkoutUrl: string | null = null;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_CONFIG.priceId,
          quantity: 1,
        },
      ],
      customer_email: params?.email || undefined,
      metadata: {
        companyName: params?.companyName || "TechCompliance Client",
        cnpj: params?.cnpj || "",
      },
      subscription_data: {
        metadata: {
          companyName: params?.companyName || "TechCompliance Client",
          cnpj: params?.cnpj || "",
        },
      },
      billing_address_collection: "required",
      locale: "pt-BR",
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&checkout=success`,
      cancel_url: `${origin}/precos?checkout=cancel`,
    });

    checkoutUrl = session.url;
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { success: false, error: error.message || "Erro ao iniciar pagamento com Stripe." };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  return { success: false, error: "URL de checkout indisponível." };
}
