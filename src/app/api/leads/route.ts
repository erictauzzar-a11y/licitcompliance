import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  validateCrmApiKey,
  getLeadsList,
  dispatchCrmWebhook,
  type DemoLeadRecord,
} from "@/lib/crm-service";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

// Schema de criação de lead via API REST
const CreateLeadSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres."),
  phone: z.string().trim().min(10, "Telefone deve conter DDD e número válido."),
  email: z.string().trim().email("E-mail inválido."),
  company_name: z.string().trim().min(2, "Nome da empresa obrigatório."),
  source: z.string().optional().default("api_crm"),
});

/**
 * GET /api/leads
 * Lista leads cadastrados com autenticação via CRM_API_KEY.
 * Parâmetros de consulta suportados:
 * - status: 'pending', 'contacted', 'converted', etc. (ou 'all')
 * - limit: número máximo de registros (padrão 50, máx 100)
 * - offset: paginação por deslocamento (padrão 0)
 * - since: data ISO para buscar cadastros a partir de um momento
 */
export async function GET(request: NextRequest) {
  // 1. Validação de Autenticação da Chave de API
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message:
            "Acesso não autorizado. Envie o header 'x-api-key', 'Authorization: Bearer <token>' ou o parâmetro '?api_key=<token>'.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const since = searchParams.get("since") || undefined;

    const result = await getLeadsList({
      status,
      limit: isNaN(limit) ? 50 : limit,
      offset: isNaN(offset) ? 0 : offset,
      since,
    });

    return NextResponse.json({
      success: true,
      total: result.total,
      limit,
      offset,
      leads: result.leads,
    });
  } catch (error: unknown) {
    console.error("[API Leads GET] Erro ao listar leads:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Erro ao consultar leads.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Cria um lead diretamente pela API (para automações externas, importações ou testes).
 * Também dispara o Webhook para o CRM se configurado.
 */
export async function POST(request: NextRequest) {
  // 1. Validação de Autenticação da Chave de API
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message:
            "Acesso não autorizado. Envie o header 'x-api-key', 'Authorization: Bearer <token>' ou o parâmetro '?api_key=<token>'.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = CreateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Dados de lead inválidos.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { name, phone, email, company_name, source } = parsed.data;

    const newLead: DemoLeadRecord = {
      id: crypto.randomUUID(),
      name,
      phone,
      email: email.toLowerCase(),
      company_name,
      source: source || "api_crm",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // 1. Persistência no Supabase
    if (isSupabaseConfigured) {
      try {
        const db = getSupabaseAdmin();
        await db.from("demo_leads").insert(newLead);
      } catch (dbErr) {
        console.error("[API Leads POST] Erro ao salvar no banco:", dbErr);
      }
    }

    // 2. Disparo do Webhook assíncrono para o CRM
    dispatchCrmWebhook(newLead).catch((webhookErr) => {
      console.error("[API Leads POST] Falha no webhook:", webhookErr);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead registrado com sucesso.",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[API Leads POST] Erro ao criar lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Formato de payload inválido ou erro no processamento.",
        },
      },
      { status: 400 }
    );
  }
}
