import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyByCNPJ } from "@/lib/cnpj-service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { cleanCNPJ, isValidCNPJFormat } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const ip = getClientIp(request.headers);

  const resolvedParams = await params;
  const cnpjParam = cleanCNPJ(resolvedParams.cnpj);

  if (!isValidCNPJFormat(cnpjParam)) {
    return NextResponse.json(
      { error: "CNPJ inválido. Confira o formato e quantidade de dígitos." },
      { status: 400 }
    );
  }

  // 1. Rate Limiting anti-scraping/DoS (15 consultas válidas / minuto por IP)
  const rateCheck = checkRateLimit(`cnpj_${ip}`, {
    windowMs: 60000,
    maxRequests: 15,
    blockDurationMs: 60000,
  });

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Limite de consultas por minuto atingido. Aguarde alguns instantes." },
      { status: 429 }
    );
  }

  try {
    const companyData = await fetchCompanyByCNPJ(cnpjParam);
    return NextResponse.json(companyData);
  } catch (error: any) {
    const message = error?.message || "Não foi possível consultar os dados agora. Tente novamente.";
    const status = message.includes("inválido")
      ? 400
      : message.includes("Não encontramos")
      ? 404
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
