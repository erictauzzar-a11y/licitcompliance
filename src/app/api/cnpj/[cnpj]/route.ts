import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyByCNPJ } from "@/lib/cnpj-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const resolvedParams = await params;
  const cnpjParam = resolvedParams.cnpj;

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
