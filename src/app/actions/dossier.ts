"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockStore } from "@/lib/mock-data";
import { Company, Policy, Employee, WhistleblowerReport, CompanyDocument } from "@/types";

export interface DossierData {
  company: Company;
  policy: Policy | null;
  employees: Employee[];
  reports: WhistleblowerReport[];
  companyDocuments?: CompanyDocument[];
  metrics: {
    totalEmployees: number;
    acceptedPolicies: number;
    policyRate: number;
    completedTrainings: number;
    trainingRate: number;
    totalReports: number;
    resolvedReports: number;
  };
}

export async function getDossierDataAction(companyId?: string): Promise<{
  success: boolean;
  data?: DossierData;
  error?: string;
}> {
  try {
    const admin = await getAuthenticatedAdmin();
    const resolvedCompanyId = companyId || admin?.companyId;

    if (!resolvedCompanyId) {
      return { success: false, error: "Empresa não informada ou não autenticada." };
    }

    if (isSupabaseConfigured) {
      const db = getSupabaseAdmin();

      // 1. Dados da empresa
      const { data: comp, error: compErr } = await db
        .from("companies")
        .select("*")
        .eq("id", resolvedCompanyId)
        .single();

      if (compErr || !comp) {
        return { success: false, error: "Empresa não encontrada no banco de dados." };
      }

      // 2. Política / Código de Conduta
      const { data: policyData } = await db
        .from("policies")
        .select("*")
        .eq("company_id", resolvedCompanyId)
        .order("created_at", { ascending: false })
        .maybeSingle();

      // 3. Colaboradores
      const { data: employeesData } = await db
        .from("employees")
        .select("*")
        .eq("company_id", resolvedCompanyId)
        .order("full_name", { ascending: true });

      // 4. Denúncias
      const { data: reportsData } = await db
        .from("whistleblower_reports")
        .select("*")
        .eq("company_id", resolvedCompanyId)
        .order("created_at", { ascending: false });

      // 5. Documentos da Empresa (Aprovados ou Publicados)
      const { data: docsData } = await db
        .from("company_documents")
        .select("*")
        .eq("company_id", resolvedCompanyId)
        .in("status", ["APROVADO", "PUBLICADO"])
        .order("created_at", { ascending: false });

      const employees = (employeesData as Employee[]) || [];
      const reports = (reportsData as WhistleblowerReport[]) || [];
      const companyDocuments = (docsData as CompanyDocument[]) || [];

      const totalEmployees = employees.length;
      const acceptedPolicies = employees.filter((e) => !!e.policy_accepted_at).length;
      const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;
      const totalReports = reports.length;
      const resolvedReports = reports.filter(
        (r) => r.status === "PROCEDENTE" || r.status === "IMPROCEDENTE" || r.status === "ARQUIVADA"
      ).length;

      return {
        success: true,
        data: {
          company: comp as Company,
          policy: (policyData as Policy) || null,
          employees,
          reports,
          companyDocuments,
          metrics: {
            totalEmployees,
            acceptedPolicies,
            policyRate,
            completedTrainings: 0,
            trainingRate: 0,
            totalReports,
            resolvedReports,
          },
        },
      };
    }

    // Fallback em memória (mockStore)
    const company = mockStore.getCompany(resolvedCompanyId);
    const policy = mockStore.getPolicy(resolvedCompanyId);
    const employees = mockStore.getEmployees(resolvedCompanyId);
    const certs = mockStore.getEmployeeCertificates("", resolvedCompanyId);
    const reports = mockStore.getReports(resolvedCompanyId);
    const companyDocuments = mockStore
      .getDocuments(resolvedCompanyId)
      .filter((d) => d.status === "APROVADO" || d.status === "PUBLICADO");

    const totalEmployees = employees.length;
    const acceptedPolicies = employees.filter((e) => !!e.policy_accepted_at).length;
    const policyRate = totalEmployees > 0 ? Math.round((acceptedPolicies / totalEmployees) * 100) : 0;
    const completedTrainings = certs.length;
    const trainingRate = totalEmployees > 0 ? Math.min(100, Math.round((completedTrainings / (totalEmployees * 2)) * 100)) : 0;
    const totalReports = reports.length;
    const resolvedReports = reports.filter((r) => r.status !== "RECEBIDA").length;

    return {
      success: true,
      data: {
        company,
        policy,
        employees,
        reports,
        companyDocuments,
        metrics: {
          totalEmployees,
          acceptedPolicies,
          policyRate,
          completedTrainings,
          trainingRate,
          totalReports,
          resolvedReports,
        },
      },
    };
  } catch (err: any) {
    console.error("[getDossierDataAction] Exception:", err);
    return { success: false, error: "Erro ao compilar dados do Dossiê." };
  }
}
