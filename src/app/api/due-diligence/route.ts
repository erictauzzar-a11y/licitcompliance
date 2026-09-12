import { NextRequest, NextResponse } from "next/server";
import { executeDueDiligence } from "@/lib/due-diligence-service";
import { mockStore } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cnpj = body.cnpj;

    if (!cnpj) {
      return NextResponse.json(
        { error: "CNPJ do fornecedor é obrigatório." },
        { status: 400 }
      );
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      return NextResponse.json(
        { error: "CNPJ deve possuir 14 dígitos." },
        { status: 400 }
      );
    }

    const result = await executeDueDiligence(cleanCnpj);
    
    // Vincula à empresa gestora demo
    result.company_id = mockStore.getCompany().id;
    if (result.supplier) {
      result.supplier.company_id = mockStore.getCompany().id;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na Due Diligence:", error);
    return NextResponse.json(
      { error: "Falha ao processar análise de Due Diligence." },
      { status: 500 }
    );
  }
}
