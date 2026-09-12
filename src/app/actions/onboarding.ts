"use server";

import { z } from "zod";
import { cleanCNPJ, isValidCNPJFormat } from "@/lib/utils";
import { mockStore } from "@/lib/mock-data";
import { cookies } from "next/headers";
import crypto from "crypto";

const OnboardingCompanySchema = z.object({
  cnpj: z.string().refine((val) => isValidCNPJFormat(cleanCNPJ(val)), {
    message: "CNPJ inválido.",
  }),
  legal_name: z.string().min(3, "Razão social deve ter no mínimo 3 caracteres.").max(255),
  trade_name: z.string().min(2, "Nome fantasia deve ter no mínimo 2 caracteres.").max(255),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras, números e hífens."),
  status: z.string().optional().default("ATIVA"),
  opening_date: z.string().optional(),
  legal_nature: z.string().optional(),
  company_size: z.string().optional(),
  share_capital: z.union([z.string(), z.number()]).optional(),
  headquarters_or_branch: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  full_address: z.string().optional(),
  main_cnae_code: z.union([z.string(), z.number()]).optional(),
  main_cnae_description: z.string().optional(),
  secondary_cnaes: z.array(z.any()).optional().default([]),
  is_simples_nacional: z.boolean().nullable().optional(),
  is_mei: z.boolean().nullable().optional(),
  tax_regime: z.string().optional(),
  partners: z.array(z.any()).optional().default([]),
  integrity_officer_name: z.string().optional(),
  integrity_officer_email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  integrity_officer_phone: z.string().optional(),
  compliance_officer_name: z.string().optional(),
  approximate_employees_count: z.number().int().positive().optional().default(10),
  conducts_public_contracts: z.boolean().optional().default(true),
});

export async function submitOnboardingAction(rawInput: any) {
  try {
    const parseResult = OnboardingCompanySchema.safeParse({
      ...rawInput,
      cnpj: cleanCNPJ(rawInput.cnpj || ""),
      approximate_employees_count: Number(rawInput.approximate_employees_count) || 10,
    });

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados inválidos.";
      return { success: false, error: firstError };
    }

    const validData = parseResult.data;

    // 1. Cria o Tenant Real e Isolado no mockStore
    const createdCompany = mockStore.createRealCompanyTenant({
      ...validData,
      cnpj: validData.cnpj,
      legal_name: validData.legal_name.trim(),
      trade_name: validData.trade_name.trim(),
      slug: validData.slug.trim(),
    });

    // 2. Cria sessão autenticada com token criptográfico e vincula ao ID do novo tenant
    const cookieStore = await cookies();
    const sessionToken = `sess_${crypto.randomBytes(32).toString("hex")}`;
    
    mockStore.bindSessionToCompany(sessionToken, createdCompany.id);

    cookieStore.set("licit_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      companyId: createdCompany.id,
      companyName: createdCompany.trade_name || createdCompany.legal_name,
      slug: createdCompany.slug,
    };
  } catch (err: any) {
    console.error("Erro no onboarding:", err);
    return { success: false, error: "Falha ao criar ambiente da empresa no sistema." };
  }
}

/**
 * Atualiza dados cadastrais da empresa a partir de nova consulta ao CNPJ oficial
 * Preserva colaboradores, políticas, evidências e denúncias existentes no tenant.
 */
export async function refreshCompanyFromCNPJAction(companyId?: string) {
  try {
    const { getAuthenticatedAdmin } = await import("./auth");
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return { success: false, error: "Acesso não autorizado." };
    }

    const targetCompanyId = companyId || admin.companyId;
    const currentCompany = mockStore.getCompany(targetCompanyId);

    if (!currentCompany || !currentCompany.cnpj) {
      return { success: false, error: "Empresa não localizada." };
    }

    const { fetchCompanyByCNPJ } = await import("@/lib/cnpj-service");
    const freshData = await fetchCompanyByCNPJ(currentCompany.cnpj);

    const updated = mockStore.updateCompany(
      {
        legal_name: freshData.legal_name,
        trade_name: freshData.trade_name || freshData.legal_name,
        status: freshData.status,
        opening_date: freshData.opening_date,
        legal_nature: freshData.legal_nature,
        company_size: freshData.company_size,
        share_capital: freshData.share_capital,
        headquarters_or_branch: freshData.headquarters_or_branch,
        cep: freshData.cep,
        street: freshData.street,
        number: freshData.number,
        complement: freshData.complement,
        neighborhood: freshData.neighborhood,
        city: freshData.city,
        state: freshData.state,
        full_address: freshData.full_address,
        main_cnae_code: freshData.main_cnae_code,
        main_cnae_description: freshData.main_cnae_description,
        secondary_cnaes: freshData.secondary_cnaes,
        is_simples_nacional: freshData.is_simples_nacional,
        is_mei: freshData.is_mei,
        tax_regime: freshData.tax_regime,
        partners: freshData.partners && freshData.partners.length > 0 ? freshData.partners : currentCompany.partners,
      },
      targetCompanyId
    );

    return { success: true, company: updated };
  } catch (err: any) {
    console.error("Erro ao atualizar dados cadastrais via CNPJ:", err);
    return { success: false, error: err.message || "Erro ao consultar base da Receita Federal." };
  }
}

