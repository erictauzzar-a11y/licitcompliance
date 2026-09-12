"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Company } from "@/types";
import { getActiveAdminCompanyAction } from "@/app/actions/auth";

interface CompanyContextValue {
  company: Company | null;
  isLoading: boolean;
  refresh: () => void;
}

const CompanyContext = createContext<CompanyContextValue>({
  company: null,
  isLoading: true,
  refresh: () => {},
});

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompany = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getActiveAdminCompanyAction();
      if (res.success && res.company) {
        setCompany(res.company as Company);
        // Sync para o mockStore APENAS como cache auxiliar (nao como fonte de verdade)
        const { mockStore } = await import("@/lib/mock-data");
        mockStore.saveClientTenant(res.company as Company);
      } else {
        setCompany(null);
      }
    } catch (err) {
      console.error("[CompanyContext] Erro ao buscar empresa:", err);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return (
    <CompanyContext.Provider value={{ company, isLoading, refresh: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

/**
 * Hook para acessar a empresa autenticada no contexto do dashboard.
 * Retorna null enquanto carrega (nunca retorna INITIAL_COMPANY/TransLog).
 */
export function useCompany(): CompanyContextValue {
  return useContext(CompanyContext);
}
