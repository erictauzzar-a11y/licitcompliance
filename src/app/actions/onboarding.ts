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

    // Atualiza empresa de forma controlada
    mockStore.updateCompany({
      ...validData,
      cnpj: validData.cnpj,
      legal_name: validData.legal_name.trim(),
      trade_name: validData.trade_name.trim(),
      slug: validData.slug.trim(),
    });

    if (mockStore.policy) {
      mockStore.policy = {
        ...mockStore.policy,
        title: `Código de Ética, Integridade e Conduta - ${validData.trade_name}`,
        company_id: mockStore.company.id,
      };
    }

    // Cria sessão autenticada automática para o novo gestor
    const cookieStore = await cookies();
    const sessionToken = `sess_${crypto.randomBytes(32).toString("hex")}`;
    cookieStore.set("licit_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, slug: validData.slug };
  } catch (err: any) {
    return { success: false, error: "Falha ao registrar empresa no sistema." };
  }
}
