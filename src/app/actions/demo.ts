"use server";

import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

// Schema de validação com Zod (estritamente 4 campos de dados + honeypot invisível)
const DemoRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(255, "Nome muito longo."),
  phone: z
    .string()
    .trim()
    .min(14, "Informe um telefone ou WhatsApp válido com DDD.")
    .max(20, "Telefone inválido."),
  email: z
    .string()
    .trim()
    .email("Informe um endereço de e-mail válido.")
    .max(255, "E-mail muito longo."),
  company_name: z
    .string()
    .trim()
    .min(2, "Informe o nome da sua empresa.")
    .max(255, "Nome da empresa muito longo."),
  website_hp: z.string().optional(), // Honeypot anti-spam
});

export interface DemoRequestInput {
  name: string;
  phone: string;
  email: string;
  company_name: string;
  website_hp?: string;
}

export interface DemoLeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  company_name: string;
  source: string;
  status: string;
  created_at: string;
}

// Fallback em memória para resiliência contínua
declare global {
  // eslint-disable-next-line no-var
  var __memoryDemoLeads: DemoLeadRecord[] | undefined;
}

const memoryLeads: DemoLeadRecord[] = globalThis.__memoryDemoLeads || [];
globalThis.__memoryDemoLeads = memoryLeads;

export async function submitDemoRequest(input: DemoRequestInput): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    // 1. Validação com Zod
    const validation = DemoRequestSchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      return {
        success: false,
        error: "Verifique os campos obrigatórios e tente novamente.",
        fieldErrors,
      };
    }

    const data = validation.data;

    // 2. Proteção Anti-Spam: se o campo invisível (honeypot) foi preenchido por robô
    if (data.website_hp && data.website_hp.trim().length > 0) {
      // Simula sucesso sem salvar spam no banco
      return { success: true };
    }

    // 3. Monta o registro padronizado
    const leadRecord: DemoLeadRecord = {
      id: crypto.randomUUID(),
      name: data.name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      company_name: data.company_name,
      source: "demo_request",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // 4. Salva em memória (garantia de retenção local)
    memoryLeads.unshift(leadRecord);

    // 5. Salva no banco Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const db = getSupabaseAdmin();
        const { error: dbError } = await db.from("demo_leads").insert({
          id: leadRecord.id,
          name: leadRecord.name,
          phone: leadRecord.phone,
          email: leadRecord.email,
          company_name: leadRecord.company_name,
          source: leadRecord.source,
          status: leadRecord.status,
          created_at: leadRecord.created_at,
        });

        if (dbError) {
          console.error("[DemoLeads] Aviso ao persistir no Supabase:", dbError.message);
        }
      } catch (dbErr) {
        console.error("[DemoLeads] Exceção na conexão com banco:", dbErr);
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("[DemoLeads] Erro inesperado no processamento da demo:", error);
    return {
      success: false,
      error: "Não foi possível enviar sua solicitação. Tente novamente.",
    };
  }
}
