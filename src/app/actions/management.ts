"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "./auth";
import { mockStore } from "@/lib/mock-data";
import { Employee, Policy } from "@/types";
import { sanitizeCsvField } from "@/lib/utils";

export interface CreateEmployeeInput {
  full_name: string;
  cpf: string;
  role: string;
  phone?: string;
  email?: string;
}

/**
 * Cadastrar Colaborador Individualmente (Exige Admin)
 */
export async function createEmployeeAction(data: CreateEmployeeInput) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, error: "Acesso não autorizado. Efetue login." };
  }

  if (!data.full_name?.trim() || !data.cpf?.trim()) {
    return { success: false, error: "Nome e CPF são obrigatórios." };
  }

  const cleanName = sanitizeCsvField(data.full_name.trim());
  const cleanRole = sanitizeCsvField(data.role?.trim() || "Colaborador");
  const cleanCpf = data.cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) {
    return { success: false, error: "CPF deve conter 11 dígitos numéricos." };
  }

  const newEmp = mockStore.addEmployee({
    full_name: cleanName,
    cpf: cleanCpf,
    role: cleanRole,
    phone: data.phone?.trim() || "Não informado",
    email: data.email?.trim() || undefined,
  });

  revalidatePath("/dashboard/colaboradores");
  return { success: true, employee: newEmp };
}

/**
 * Cadastrar Colaboradores em Lote com Sanitização anti-CSV Injection (Exige Admin)
 */
export async function batchCreateEmployeesAction(csvContent: string) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, error: "Acesso não autorizado. Efetue login." };
  }

  const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
  const parsed = lines.map((line) => {
    const [name, c, r, p, m] = line.split(";").map((item) => (item ? item.trim() : ""));
    return {
      full_name: sanitizeCsvField(name || "Novo Colaborador"),
      cpf: (c || "00000000000").replace(/\D/g, ""),
      role: sanitizeCsvField(r || "Colaborador"),
      phone: p || "11999999999",
      email: m || undefined,
    };
  });

  mockStore.addEmployeesBatch(parsed);
  revalidatePath("/dashboard/colaboradores");
  return { success: true, count: parsed.length };
}

/**
 * Salvar e Publicar Código de Conduta (Exige Admin)
 */
export async function updatePolicyAction(
  content: string,
  title: string,
  publishToEmployees: boolean = true
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, error: "Acesso não autorizado. Efetue login." };
  }

  if (!content?.trim() || !title?.trim()) {
    return { success: false, error: "Título e conteúdo do código são obrigatórios." };
  }

  const updated = mockStore.updatePolicy(content.trim(), title.trim(), publishToEmployees);
  revalidatePath("/dashboard/politicas");
  revalidatePath("/dashboard");
  return { success: true, policy: updated };
}
