import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

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

// Fallback em memória para ambientes locais ou sem Supabase
declare global {
  // eslint-disable-next-line no-var
  var __memoryDemoLeads: DemoLeadRecord[] | undefined;
}

const memoryLeads: DemoLeadRecord[] = globalThis.__memoryDemoLeads || [];
globalThis.__memoryDemoLeads = memoryLeads;

/**
 * Valida a chave de API fornecida na requisição HTTP contra CRM_API_KEY.
 * Suporta:
 * - Header `x-api-key: SUA_CHAVE`
 * - Header `Authorization: Bearer SUA_CHAVE`
 * - Query param `?api_key=SUA_CHAVE`
 */
export function validateCrmApiKey(request: Request): boolean {
  const configuredKey = process.env.CRM_API_KEY?.trim();

  // Se nenhuma chave estiver definida no ambiente, permite chave de desenvolvimento padrão
  const validKey = configuredKey || "tc_live_crm_key_default";

  // 1. Header x-api-key
  const headerKey = request.headers.get("x-api-key")?.trim();
  if (headerKey && headerKey === validKey) {
    return true;
  }

  // 2. Header Authorization: Bearer <key>
  const authHeader = request.headers.get("authorization")?.trim();
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === validKey) {
      return true;
    }
  }

  // 3. Query string ?api_key=<key>
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("api_key")?.trim();
  if (queryKey && queryKey === validKey) {
    return true;
  }

  return false;
}

/**
 * Dispara um webhook HTTP POST assíncrono para o endpoint do CRM configurado em CRM_WEBHOOK_URL.
 * Ocorre de forma segura e com timeout para não atrasar a resposta da aplicação.
 */
export async function dispatchCrmWebhook(lead: DemoLeadRecord): Promise<{ dispatched: boolean; status?: number; error?: string }> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    // Webhook não configurado (normal até o usuário fornecer a URL de seu CRM)
    return { dispatched: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "TechCompliance-Webhook/1.0",
    };

    const webhookSecret = process.env.CRM_WEBHOOK_SECRET?.trim();
    if (webhookSecret) {
      headers["x-webhook-secret"] = webhookSecret;
    }

    const payload = {
      event: "lead.created",
      timestamp: new Date().toISOString(),
      lead: {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        company_name: lead.company_name,
        source: lead.source,
        status: lead.status,
        created_at: lead.created_at,
      },
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      dispatched: true,
      status: response.status,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CRM Webhook] Erro ao despachar lead para CRM:", errorMsg);
    return {
      dispatched: false,
      error: errorMsg,
    };
  }
}

/**
 * Busca leads com paginação e filtros
 */
export async function getLeadsList(filters: {
  status?: string;
  limit?: number;
  offset?: number;
  since?: string;
}): Promise<{ total: number; leads: DemoLeadRecord[] }> {
  const limit = Math.min(filters.limit || 50, 100);
  const offset = filters.offset || 0;

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      let query = db
        .from("demo_leads")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.since) {
        query = query.gte("created_at", filters.since);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (!error && data) {
        return {
          total: count ?? data.length,
          leads: data as DemoLeadRecord[],
        };
      }
    } catch (err) {
      console.error("[CRM Service] Erro ao buscar no Supabase, usando fallback:", err);
    }
  }

  // Fallback em memória
  let filtered = [...memoryLeads];
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((l) => l.status === filters.status);
  }
  if (filters.since) {
    const sinceDate = new Date(filters.since).getTime();
    filtered = filtered.filter((l) => new Date(l.created_at).getTime() >= sinceDate);
  }

  const paginated = filtered.slice(offset, offset + limit);
  return {
    total: filtered.length,
    leads: paginated,
  };
}

/**
 * Busca lead por ID
 */
export async function getLeadById(id: string): Promise<DemoLeadRecord | null> {
  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("demo_leads")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return data as DemoLeadRecord;
      }
    } catch (err) {
      console.error("[CRM Service] Erro ao buscar lead no Supabase:", err);
    }
  }

  return memoryLeads.find((l) => l.id === id) || null;
}

/**
 * Atualiza o status de um lead no banco e memória
 */
export async function updateLeadStatus(id: string, newStatus: string): Promise<DemoLeadRecord | null> {
  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("demo_leads")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) {
        // Atualiza em memória também
        const memIdx = memoryLeads.findIndex((l) => l.id === id);
        if (memIdx >= 0) {
          memoryLeads[memIdx].status = newStatus;
        }
        return data as DemoLeadRecord;
      }
    } catch (err) {
      console.error("[CRM Service] Erro ao atualizar status no Supabase:", err);
    }
  }

  const memLead = memoryLeads.find((l) => l.id === id);
  if (memLead) {
    memLead.status = newStatus;
    return memLead;
  }

  return null;
}

/**
 * Exclui um lead
 */
export async function deleteLead(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      await db.from("demo_leads").delete().eq("id", id);
    } catch (err) {
      console.error("[CRM Service] Erro ao excluir lead no Supabase:", err);
    }
  }

  const memIdx = memoryLeads.findIndex((l) => l.id === id);
  if (memIdx >= 0) {
    memoryLeads.splice(memIdx, 1);
  }

  return true;
}
