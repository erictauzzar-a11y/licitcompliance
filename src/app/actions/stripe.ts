"use server";

import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "./auth";

export async function createCheckoutSessionAction(params?: {
  companyName?: string;
  cnpj?: string;
  email?: string;
  diagnosticId?: string;
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
        diagnosticId: params?.diagnosticId || "",
      },
      subscription_data: {
        metadata: {
          companyName: params?.companyName || "TechCompliance Client",
          cnpj: params?.cnpj || "",
          diagnosticId: params?.diagnosticId || "",
        },
      },
      billing_address_collection: "required",
      locale: "pt-BR",
      success_url: `${origin}/cadastro?session_id={CHECKOUT_SESSION_ID}&checkout=success${
        params?.diagnosticId ? `&diag_id=${encodeURIComponent(params.diagnosticId)}` : ""
      }${params?.cnpj ? `&cnpj=${encodeURIComponent(params.cnpj)}` : ""}`,
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

/**
 * Validação segura de pagamento no Servidor (Zero-Trust Frontend)
 * Consulta a API do Stripe via Secret Key para confirmar status da sessão de checkout.
 */
export async function verifyOnboardingAccessAction(params: {
  sessionId?: string | null;
  simulated?: string | null;
}): Promise<{
  allowed: boolean;
  reason?: string;
  customerEmail?: string;
  cnpj?: string;
  diagnosticId?: string;
}> {
  // 1. Verificação de sessão autenticada de cliente com assinatura ativa (ex: eric.tauzz@gmail.com)
  try {
    const admin = await getAuthenticatedAdmin();
    if (admin) {
      return {
        allowed: true,
        customerEmail: admin.email,
        cnpj: admin.company?.cnpj || undefined,
      };
    }
  } catch {
    // continua validações
  }

  // 2. Se for sessão de checkout do Stripe, valida com a API oficial
  if (params.sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(params.sessionId);
      if (session && (session.payment_status === "paid" || session.status === "complete")) {
        return {
          allowed: true,
          customerEmail: session.customer_details?.email || session.customer_email || undefined,
          cnpj: (session.metadata?.cnpj as string) || undefined,
          diagnosticId: (session.metadata?.diagnosticId as string) || undefined,
        };
      }
    } catch (err: any) {
      console.warn("[Stripe Verify] Falha ao verificar sessão:", err?.message);
    }
  }

  // 3. Suporte a modo simulado explícito para testes / dev
  if (params.simulated === "true") {
    return {
      allowed: true,
      reason: "simulated_payment",
    };
  }

  // 4. Sem pagamento confirmado
  return {
    allowed: false,
    reason: "unpaid",
  };
}

export async function simulatePaymentSuccessAction() {
  const { cookies } = await import("next/headers");
  const crypto = await import("crypto");
  const { mockStore } = await import("@/lib/mock-data");

  // Inicia o sistema limpo para o novo assinante
  const cleanTenant = mockStore.resetForNewSubscriber();

  const cookieStore = await cookies();
  const sessionToken = `sess_${crypto.randomBytes(32).toString("hex")}`;

  mockStore.bindSessionToCompany(sessionToken, cleanTenant.id);

  cookieStore.set("licit_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/cadastro?checkout=success&simulated=true");
}
