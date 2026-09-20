import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  validateCrmApiKey,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} from "@/lib/crm-service";

const UpdateLeadSchema = z.object({
  status: z.string().trim().min(1, "Status não pode ser vazio."),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/leads/[id]
 * Consulta os detalhes de um lead específico.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Acesso não autorizado." },
      },
      { status: 401 }
    );
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Lead não encontrado." },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    lead,
  });
}

/**
 * PATCH /api/leads/[id]
 * Permite ao CRM atualizar o status do lead (ex: 'contacted', 'converted', 'lost').
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Acesso não autorizado." },
      },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = UpdateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Status inválido.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(id, parsed.data.status);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Lead não encontrado para atualização." },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status do lead atualizado com sucesso.",
      lead: updated,
    });
  } catch (error: unknown) {
    console.error("[API Leads PATCH] Erro ao atualizar lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Falha ao processar atualização." },
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/leads/[id]
 * Exclui um lead específico.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Acesso não autorizado." },
      },
      { status: 401 }
    );
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Lead não encontrado." },
      },
      { status: 404 }
    );
  }

  await deleteLead(id);

  return NextResponse.json({
    success: true,
    message: "Lead removido com sucesso.",
  });
}
