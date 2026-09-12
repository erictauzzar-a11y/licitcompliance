"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { Employee } from "@/types";

export interface EmployeesResponse {
  success: boolean;
  employees: Employee[];
  error?: string;
}

/**
 * Busca colaboradores da empresa autenticada diretamente do Supabase.
 * Filtra estritamente por company_id — nunca retorna dados de outra empresa.
 */
export async function getEmployeesAction(): Promise<EmployeesResponse> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, employees: [], error: "Sessão inválida." };
  }

  if (!isSupabaseConfigured) {
    // Fallback: retorna array vazio para empresa nova (não dados demo)
    return { success: true, employees: [] };
  }

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("employees")
      .select("*")
      .eq("company_id", admin.companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getEmployeesAction] Supabase error:", error);
      return { success: false, employees: [], error: error.message };
    }

    return { success: true, employees: (data as Employee[]) ?? [] };
  } catch (err) {
    console.error("[getEmployeesAction] Exception:", err);
    return { success: false, employees: [], error: "Erro interno ao buscar colaboradores." };
  }
}

/**
 * Cria um colaborador no Supabase para a empresa autenticada.
 */
export async function createEmployeeSupabaseAction(data: {
  full_name: string;
  cpf: string;
  role: string;
  phone: string;
  email?: string;
}): Promise<{ success: boolean; employee?: Employee; error?: string }> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida." };
  }

  const cleanCpf = data.cpf.replace(/\D/g, "");
  const { generateSecureToken } = await import("@/lib/utils");

  const newEmployee = {
    company_id: admin.companyId,
    full_name: data.full_name.trim(),
    cpf: cleanCpf,
    role: data.role.trim() || "Colaborador",
    phone: data.phone.trim() || "",
    email: data.email?.trim() || null,
    access_token: generateSecureToken("tok"),
    policy_accepted_at: null,
    policy_acceptance_ip: null,
  };

  if (!isSupabaseConfigured) {
    // Fallback mock (ambiente sem Supabase)
    const { mockStore } = await import("@/lib/mock-data");
    const emp = mockStore.addEmployee(data, admin.companyId);
    return { success: true, employee: emp };
  }

  try {
    const db = getSupabaseAdmin();
    const { data: inserted, error } = await db
      .from("employees")
      .insert(newEmployee)
      .select()
      .single();

    if (error) {
      console.error("[createEmployeeSupabaseAction] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, employee: inserted as Employee };
  } catch (err) {
    console.error("[createEmployeeSupabaseAction] Exception:", err);
    return { success: false, error: "Erro interno ao criar colaborador." };
  }
}
