import { NextRequest, NextResponse } from "next/server";
import { validateCrmApiKey, dispatchCrmWebhook, type DemoLeadRecord } from "@/lib/crm-service";

/**
 * POST /api/leads/webhook-test
 * Dispara um lead de teste para o CRM_WEBHOOK_URL configurado no ambiente,
 * permitindo ao desenvolvedor/usuário validar a conexão do mini CRM imediatamente.
 */
export async function POST(request: NextRequest) {
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Acesso não autorizado." },
      },
      { status: 401 }
    );
  }

  const webhookUrl = process.env.CRM_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WEBHOOK_URL_NOT_CONFIGURED",
          message:
            "A variável CRM_WEBHOOK_URL não está configurada no seu arquivo .env.local. Defina a URL do seu CRM para receber os disparos em tempo real.",
        },
      },
      { status: 400 }
    );
  }

  const mockTestLead: DemoLeadRecord = {
    id: crypto.randomUUID(),
    name: "Lead de Teste CRM",
    phone: "(11) 98888-7777",
    email: "contato.teste@exemplo-empresa.com.br",
    company_name: "Empresa Teste Integração Ltda",
    source: "webhook_test",
    status: "test",
    created_at: new Date().toISOString(),
  };

  const dispatchResult = await dispatchCrmWebhook(mockTestLead);

  return NextResponse.json({
    success: dispatchResult.dispatched,
    message: dispatchResult.dispatched
      ? `Lead de teste enviado com sucesso para: ${webhookUrl}`
      : `Falha ao enviar para ${webhookUrl}: ${dispatchResult.error || "Erro desconhecido"}`,
    target_url: webhookUrl,
    lead_sent: mockTestLead,
    dispatch_details: dispatchResult,
  });
}
