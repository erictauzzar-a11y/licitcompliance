"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Company } from "@/types";
import { IntegrityProgramSnapshot } from "@/types/compliance";
import { getActiveAdminCompanyAction } from "@/app/actions/auth";
import { getIntegrityProgramSnapshotAction } from "@/app/actions/diagnostic";

interface CompanyContextValue {
  company: Company | null;
  isLoading: boolean;
  snapshot: IntegrityProgramSnapshot | null;
  isSnapshotLoading: boolean;
  refresh: () => void;
  refreshSnapshot: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue>({
  company: null,
  isLoading: true,
  snapshot: null,
  isSnapshotLoading: false,
  refresh: () => {},
  refreshSnapshot: async () => {},
});

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [snapshot, setSnapshot] = useState<IntegrityProgramSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState(false);

  const fetchSnapshot = useCallback(async () => {
    setIsSnapshotLoading(true);
    try {
      const snapRes = await getIntegrityProgramSnapshotAction();
      if (snapRes.success && snapRes.snapshot) {
        setSnapshot(snapRes.snapshot);
      }
    } catch (err) {
      console.error("[CompanyContext] Erro ao buscar snapshot:", err);
    } finally {
      setIsSnapshotLoading(false);
    }
  }, []);

  const fetchCompany = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getActiveAdminCompanyAction();
      if (res.success && res.company) {
        setCompany(res.company as Company);
        const { mockStore } = await import("@/lib/mock-data");
        mockStore.saveClientTenant(res.company as Company);
        fetchSnapshot();
      } else {
        setCompany(null);
        setSnapshot(null);
      }
    } catch (err) {
      console.error("[CompanyContext] Erro ao buscar empresa:", err);
      setCompany(null);
      setSnapshot(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSnapshot]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return (
    <CompanyContext.Provider
      value={{
        company,
        isLoading,
        snapshot,
        isSnapshotLoading,
        refresh: fetchCompany,
        refreshSnapshot: fetchSnapshot,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

/**
 * Hook para acessar a empresa autenticada e snapshot no contexto do dashboard.
 */
export function useCompany(): CompanyContextValue {
  return useContext(CompanyContext);
}

