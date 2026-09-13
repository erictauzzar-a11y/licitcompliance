"use server";

import { getAuthenticatedAdmin } from "./auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockStore } from "@/lib/mock-data";
import { INTEGRITY_TEMPLATES } from "@/lib/integrity-templates-data";
import { formatCNPJ } from "@/lib/utils";
import {
  CompanyDocument,
  DocumentStatus,
  IntegrityTemplate,
  IntegrityCategory,
  NormativeNature,
} from "@/types";

import { renderTemplateWithCompany } from "@/lib/template-renderer";

/**
 * 1. Retorna os 20 modelos globais oficiais do TechCompliance
 */
export async function getIntegrityTemplatesAction(): Promise<{
  success: boolean;
  templates: IntegrityTemplate[];
  error?: string;
}> {
  try {
    return {
      success: true,
      templates: INTEGRITY_TEMPLATES,
    };
  } catch (err: any) {
    return {
      success: false,
      templates: [],
      error: err?.message || "Erro ao carregar modelos globais.",
    };
  }
}

/**
 * 2. Retorna a lista de documentos gerados/adotados pela empresa ativa (estrito isolamento multi-tenant)
 */
export async function getCompanyDocumentsAction(): Promise<{
  success: boolean;
  documents: CompanyDocument[];
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, documents: [], error: "Sessão inválida ou não autenticada." };
  }

  try {
    if (isSupabaseConfigured) {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("company_documents")
        .select("*")
        .eq("company_id", admin.companyId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return { success: true, documents: data as CompanyDocument[] };
      }
    }

    // Fallback store seguro
    const docs = mockStore.getDocuments(admin.companyId);
    return { success: true, documents: docs };
  } catch (err: any) {
    return { success: false, documents: [], error: err?.message || "Erro ao consultar documentos da empresa." };
  }
}

/**
 * 3. Cria um novo documento da empresa derivado de um modelo da Biblioteca
 * Realiza o pré-preenchimento automático dos dados conhecidos da empresa
 */
export async function createDocumentFromTemplateAction(
  templateId: string,
  governanceValues: Record<string, string> = {}
): Promise<{
  success: boolean;
  document?: CompanyDocument;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId || !admin?.company) {
    return { success: false, error: "Sessão inválida ou não autenticada." };
  }

  const template = INTEGRITY_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return { success: false, error: "Modelo de integridade não encontrado." };
  }

  const company = admin.company;
  const initialVersion = "1.0";
  const now = new Date();

  // Substituição de variáveis dinâmicas e governança com os dados reais da empresa autenticada
  const renderedContent = renderTemplateWithCompany(
    template.default_content,
    company,
    governanceValues,
    template
  );

  const docId = `doc-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  const newDocument: CompanyDocument = {
    id: docId,
    company_id: admin.companyId,
    template_id: template.id,
    category: template.category,
    title: `${template.title} - ${company.trade_name || company.legal_name}`,
    description: template.description,
    content: renderedContent,
    version: initialVersion,
    status: "RASCUNHO",
    is_active: true,
    normative_nature: template.normative_nature,
    legal_basis: template.legal_basis,
    file_type: "TEXTO",
    created_by: admin.email,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    history: [
      {
        version: initialVersion,
        status: "RASCUNHO",
        changed_by: admin.email,
        changed_at: now.toISOString(),
        notes: "Criação de documento a partir do modelo oficial TechCompliance.",
      },
    ],
  };

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("company_documents")
        .insert(newDocument)
        .select()
        .single();

      if (!error && data) {
        return { success: true, document: data as CompanyDocument };
      }
    } catch {
      // continua para fallback mockStore
    }
  }

  mockStore.saveDocument(newDocument, admin.companyId);
  return { success: true, document: newDocument };
}

/**
 * 4. Salva alterações de texto e metadados de um documento
 */
export async function saveCompanyDocumentAction(
  documentId: string,
  data: {
    title: string;
    content: string;
    description?: string;
  }
): Promise<{
  success: boolean;
  document?: CompanyDocument;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida ou não autenticada." };
  }

  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data: updated, error } = await db
        .from("company_documents")
        .update({
          title: data.title,
          content: data.content,
          description: data.description,
          updated_at: now,
        })
        .eq("id", documentId)
        .eq("company_id", admin.companyId)
        .select()
        .single();

      if (!error && updated) {
        return { success: true, document: updated as CompanyDocument };
      }
    } catch {
      // fallback
    }
  }

  const existing = mockStore.getDocumentById(documentId, admin.companyId);
  if (!existing) {
    return { success: false, error: "Documento não localizado." };
  }

  const updatedDoc: CompanyDocument = {
    ...existing,
    title: data.title,
    content: data.content,
    description: data.description || existing.description,
    updated_at: now,
  };

  mockStore.saveDocument(updatedDoc, admin.companyId);
  return { success: true, document: updatedDoc };
}

/**
 * 5. Gerenciamento do ciclo de vida e versionamento (Rascunho -> Aguardando Aprovação -> Aprovado -> Publicado)
 */
export async function updateDocumentStatusAction(
  documentId: string,
  newStatus: DocumentStatus,
  notes?: string
): Promise<{
  success: boolean;
  document?: CompanyDocument;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida ou não autenticada." };
  }

  const now = new Date().toISOString();
  let existing = mockStore.getDocumentById(documentId, admin.companyId);

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data } = await db
        .from("company_documents")
        .select("*")
        .eq("id", documentId)
        .eq("company_id", admin.companyId)
        .single();
      if (data) existing = data as CompanyDocument;
    } catch {
      // fallback
    }
  }

  if (!existing) {
    return { success: false, error: "Documento não encontrado." };
  }

  // Incremento de versão inteligente
  let currentVersionNum = parseFloat(existing.version || "1.0");
  if (isNaN(currentVersionNum)) currentVersionNum = 1.0;

  let nextVersion = existing.version;
  if (newStatus === "PUBLICADO") {
    nextVersion = (Math.floor(currentVersionNum) + 1.0).toFixed(1);
  } else if (newStatus === "APROVADO" && existing.status !== "APROVADO") {
    nextVersion = (currentVersionNum + 0.1).toFixed(1);
  }

  const newLog = {
    version: nextVersion,
    status: newStatus,
    changed_by: admin.email,
    changed_at: now,
    notes: notes || `Transição de status para ${newStatus}`,
  };

  const history = existing.history ? [...existing.history, newLog] : [newLog];

  const updatedDoc: CompanyDocument = {
    ...existing,
    version: nextVersion,
    status: newStatus,
    updated_at: now,
    history,
    approved_by: newStatus === "APROVADO" || newStatus === "PUBLICADO" ? (admin.company?.integrity_officer_name || admin.email) : existing.approved_by,
    approved_at: newStatus === "APROVADO" || newStatus === "PUBLICADO" ? now : existing.approved_at,
    published_at: newStatus === "PUBLICADO" ? now : existing.published_at,
  };

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data: saved, error } = await db
        .from("company_documents")
        .update({
          version: updatedDoc.version,
          status: updatedDoc.status,
          updated_at: updatedDoc.updated_at,
          history: updatedDoc.history,
          approved_by: updatedDoc.approved_by,
          approved_at: updatedDoc.approved_at,
          published_at: updatedDoc.published_at,
        })
        .eq("id", documentId)
        .eq("company_id", admin.companyId)
        .select()
        .single();

      if (!error && saved) {
        return { success: true, document: saved as CompanyDocument };
      }
    } catch {
      // fallback
    }
  }

  mockStore.saveDocument(updatedDoc, admin.companyId);
  return { success: true, document: updatedDoc };
}

/**
 * 6. Upload de documento próprio em PDF ou DOCX da empresa para o Supabase Storage
 */
export async function uploadOwnDocumentAction(formData: FormData): Promise<{
  success: boolean;
  document?: CompanyDocument;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId || !admin?.company) {
    return { success: false, error: "Sessão inválida ou não autenticada." };
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as IntegrityCategory) || "ESSENCIAIS";
  const normativeNature = (formData.get("normative_nature") as NormativeNature) || "BOA_PRATICA";
  const legalBasis = (formData.get("legal_basis") as string)?.trim() || "Documento interno da organização.";
  const description = (formData.get("description") as string)?.trim() || "Upload de documento próprio da empresa.";

  if (!file) {
    return { success: false, error: "Nenhum arquivo enviado." };
  }

  if (!title) {
    return { success: false, error: "Título do documento é obrigatório." };
  }

  // Validação de tipo de arquivo
  const allowedExtensions = [".pdf", ".docx", ".doc"];
  const fileName = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExt) {
    return {
      success: false,
      error: "Formato de arquivo inválido. Apenas arquivos PDF e Word (.docx, .doc) são aceitos.",
    };
  }

  // Limite de 25MB
  if (file.size > 25 * 1024 * 1024) {
    return { success: false, error: "O arquivo excede o limite máximo permitido de 25MB." };
  }

  const docId = `doc-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  const fileExt = fileName.substring(fileName.lastIndexOf("."));
  const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${admin.companyId}/${docId}-${sanitizedOriginalName}`;
  const now = new Date().toISOString();
  const fileType = fileExt === ".pdf" ? "PDF" : "DOCX";
  const fileSizeKb = `${(file.size / 1024).toFixed(0)} KB`;

  let uploadedUrl = storagePath;

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadErr } = await db.storage
        .from("company-documents")
        .upload(storagePath, buffer, {
          contentType: file.type || (fileType === "PDF" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
          upsert: true,
        });

      if (uploadErr) {
        console.error("[uploadOwnDocumentAction] Erro no storage Supabase:", uploadErr);
      }
    } catch (e) {
      console.error("[uploadOwnDocumentAction] Exceção no upload:", e);
    }
  }

  const newDocument: CompanyDocument = {
    id: docId,
    company_id: admin.companyId,
    template_id: null,
    category,
    title,
    description,
    content: `# ${title}\n\nDocumento digitalizado/anexado em formato original (${fileType}).\nArquivo: ${file.name}\nTamanho: ${fileSizeKb}`,
    version: "1.0",
    status: "APROVADO",
    is_active: true,
    normative_nature: normativeNature,
    legal_basis: legalBasis,
    file_url: uploadedUrl,
    file_name: file.name,
    file_size: fileSizeKb,
    file_type: fileType,
    created_by: admin.email,
    created_at: now,
    updated_at: now,
    approved_by: admin.company?.integrity_officer_name || admin.email,
    approved_at: now,
    history: [
      {
        version: "1.0",
        status: "APROVADO",
        changed_by: admin.email,
        changed_at: now,
        notes: `Upload de documento original (${file.name}).`,
      },
    ],
  };

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      await db.from("company_documents").insert(newDocument);
    } catch {
      // continua para fallback mockStore
    }
  }

  mockStore.saveDocument(newDocument, admin.companyId);
  return { success: true, document: newDocument };
}

/**
 * 7. Gera URL temporária segura e autenticada para download/visualização de documento anexado
 */
export async function getSecureDocumentUrlAction(documentId: string): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Acesso não autorizado." };
  }

  let doc = mockStore.getDocumentById(documentId, admin.companyId);

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data } = await db
        .from("company_documents")
        .select("*")
        .eq("id", documentId)
        .eq("company_id", admin.companyId)
        .single();
      if (data) doc = data as CompanyDocument;
    } catch {
      // fallback
    }
  }

  if (!doc) {
    return { success: false, error: "Documento não encontrado ou pertencente a outra organização." };
  }

  if (!doc.file_url) {
    return { success: false, error: "Este documento não possui arquivo anexado." };
  }

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      const { data, error } = await db.storage
        .from("company-documents")
        .createSignedUrl(doc.file_url, 900); // 15 minutos

      if (!error && data?.signedUrl) {
        return { success: true, url: data.signedUrl };
      }
    } catch {
      // fallback
    }
  }

  return { success: true, url: `/api/documents/${doc.id}/download` };
}

/**
 * 8. Exclui um documento pertencente à empresa
 */
export async function deleteCompanyDocumentAction(documentId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const admin = await getAuthenticatedAdmin();
  if (!admin?.companyId) {
    return { success: false, error: "Sessão inválida." };
  }

  if (isSupabaseConfigured) {
    try {
      const db = getSupabaseAdmin();
      await db
        .from("company_documents")
        .delete()
        .eq("id", documentId)
        .eq("company_id", admin.companyId);
    } catch {
      // fallback
    }
  }

  mockStore.deleteDocument(documentId, admin.companyId);
  return { success: true };
}
