"use server";

import crypto from "crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { cleanCNPJ } from "@/lib/utils";
import { cookies } from "next/headers";

export interface FreeDiagnosticRecord {
  id: string;
  cnpj: string;
  legal_name: string;
  trade_name: string;
  company_size: string;
  public_contracts: string;
  answers: {
    codeOfConduct: string;
    whistleblowerChannel: string;
    training: string;
    evidenceRecords: string;
    dueDiligence: string;
    disciplinaryMeasures: string;
  };
  score: number;
  points_structured: number;
  points_attention: number;
  points_to_develop: number;
  attention_points: string[];
  created_at: string;
  claimed_by_company_id?: string | null;
}

// Armazenamento em memória com persistência segura de fallback
const memoryFreeDiagnostics = new Map<string, FreeDiagnosticRecord>();

/**
 * Salva o diagnóstico gratuito de forma segura e retorna o identificador único (diagnostic_id)
 */
export async function saveFreeDiagnosticAction(
  data: Omit<FreeDiagnosticRecord, "id" | "created_at">
): Promise<{ success: boolean; diagnosticId: string; error?: string }> {
  try {
    const diagnosticId = `diag_${crypto.randomUUID()}`;
    const clean = cleanCNPJ(data.cnpj);
    const now = new Date().toISOString();

    const record: FreeDiagnosticRecord = {
      ...data,
      id: diagnosticId,
      cnpj: clean,
      created_at: now,
      claimed_by_company_id: null,
    };

    // 1. Salva em memória para recuperação rápida
    memoryFreeDiagnostics.set(diagnosticId, record);
    memoryFreeDiagnostics.set(`cnpj_${clean}`, record);

    // 2. Persiste em cookie seguro de navegação
    const cookieStore = await cookies();
    cookieStore.set("tech_last_diagnostic_id", diagnosticId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: "/",
    });

    // 3. Persiste no Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const db = getSupabaseAdmin();
        // Tenta salvar na tabela dedicada se existir
        await db.from("free_diagnostics").insert({
          id: diagnosticId,
          cnpj: clean,
          legal_name: data.legal_name,
          trade_name: data.trade_name,
          company_size: data.company_size,
          answers: data.answers,
          score: data.score,
          points_structured: data.points_structured,
          points_attention: data.points_attention,
          points_to_develop: data.points_to_develop,
          attention_points: data.attention_points,
          created_at: now,
        });
      } catch (dbErr) {
        // Fallback transparente se a tabela ainda não tiver sido criada no Supabase
        console.warn("[FreeDiagnostic] Fallback to memory store:", dbErr);
      }
    }

    return { success: true, diagnosticId };
  } catch (err: any) {
    console.error("[FreeDiagnostic] Erro ao salvar diagnóstico:", err);
    return {
      success: false,
      diagnosticId: "",
      error: err?.message || "Erro ao salvar diagnóstico.",
    };
  }
}

/**
 * Recupera um diagnóstico gratuito pelo identificador único (ID)
 */
export async function getFreeDiagnosticAction(
  diagnosticId: string
): Promise<{ success: boolean; diagnostic: FreeDiagnosticRecord | null }> {
  if (!diagnosticId) return { success: false, diagnostic: null };

  // 1. Busca na memória
  const inMemory = memoryFreeDiagnostics.get(diagnosticId);
  if (inMemory) {
    return { success: true, diagnostic: inMemory };
  }

  // 2. Busca no Supabase
  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("free_diagnostics")
        .select("*")
        .eq("id", diagnosticId)
        .maybeSingle();

      if (!error && data) {
        return { success: true, diagnostic: data as FreeDiagnosticRecord };
      }
    } catch {
      // ignore
    }
  }

  return { success: false, diagnostic: null };
}

/**
 * Localiza o diagnóstico gratuito mais recente de um CNPJ
 */
export async function findFreeDiagnosticByCnpjAction(
  cnpj: string
): Promise<{ success: boolean; diagnostic: FreeDiagnosticRecord | null }> {
  const clean = cleanCNPJ(cnpj);
  if (!clean) return { success: false, diagnostic: null };

  // 1. Busca na memória
  const inMemory = memoryFreeDiagnostics.get(`cnpj_${clean}`);
  if (inMemory) {
    return { success: true, diagnostic: inMemory };
  }

  // 2. Busca no Supabase
  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("free_diagnostics")
        .select("*")
        .eq("cnpj", clean)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return { success: true, diagnostic: data as FreeDiagnosticRecord };
      }
    } catch {
      // ignore
    }
  }

  return { success: false, diagnostic: null };
}
