import { NextRequest, NextResponse } from "next/server";
import { executeDueDiligence } from "@/lib/due-diligence-service";
import { mockStore } from "@/lib/mock-data";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { isValidCNPJFormat, cleanCNPJ } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // 1. Rate Limiting anti-abuso/DoS (10 requisições / minuto por IP)
    const rateCheck = checkRateLimit(`ddi_${ip}`, {
      windowMs: 60000,
      maxRequests: 10,
      blockDurationMs: 300000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Limite de consultas excedido. Aguarde alguns instantes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawCnpj = body?.cnpj;

    if (!rawCnpj) {
      return NextResponse.json(
        { error: "CNPJ do fornecedor é obrigatório." },
        { status: 400 }
      );
    }

    const cleaned = cleanCNPJ(String(rawCnpj));
    if (!isValidCNPJFormat(cleaned)) {
      return NextResponse.json(
        { error: "CNPJ deve possuir exatamente 14 dígitos." },
        { status: 400 }
      );
    }

    const result = await executeDueDiligence(cleaned);
    
    // Vincula à empresa do contexto atual
    const company = mockStore.getCompany();
    result.company_id = company.id;
    if (result.supplier) {
      result.supplier.company_id = company.id;
    }

    // Persiste no acervo da plataforma para validação pública imediata
    mockStore.saveDueDiligenceRecord(result, company.id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao processar análise de Due Diligence." },
      { status: 500 }
    );
  }
}
