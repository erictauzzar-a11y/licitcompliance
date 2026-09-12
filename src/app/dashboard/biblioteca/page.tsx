"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  ExternalLink,
  Download,
  Copy,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Save,
  Trash2,
  Lock,
  ArrowRight,
  FileDown
} from "lucide-react";
import {
  IntegrityTemplate,
  CompanyDocument,
  IntegrityCategory,
  NormativeNature,
  DocumentStatus,
} from "@/types";
import { INTEGRITY_CATEGORIES_CONFIG } from "@/lib/integrity-templates-data";
import {
  getIntegrityTemplatesAction,
  getCompanyDocumentsAction,
  createDocumentFromTemplateAction,
  saveCompanyDocumentAction,
  updateDocumentStatusAction,
  uploadOwnDocumentAction,
  getSecureDocumentUrlAction,
  deleteCompanyDocumentAction,
} from "@/app/actions/library";
import { useCompany } from "@/contexts/CompanyContext";
import { Badge, Modal, Button, EmptyState } from "@/components/ui";
import { formatCNPJ } from "@/lib/utils";

export default function BibliotecaIntegridadePage() {
  const { company, isLoading: companyLoading } = useCompany();

  // Estados de dados
  const [activeTab, setActiveTab] = useState<"MODELOS" | "MEUS_DOCUMENTOS">("MODELOS");
  const [templates, setTemplates] = useState<IntegrityTemplate[]>([]);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [selectedNature, setSelectedNature] = useState<string>("TODAS");

  // Modais
  const [viewingTemplate, setViewingTemplate] = useState<IntegrityTemplate | null>(null);
  const [adoptingTemplate, setAdoptingTemplate] = useState<IntegrityTemplate | null>(null);
  const [governanceForm, setGovernanceForm] = useState<Record<string, string>>({});
  const [editingDoc, setEditingDoc] = useState<CompanyDocument | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Estados de ação
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Carrega modelos globais
  useEffect(() => {
    setIsLoadingTemplates(true);
    getIntegrityTemplatesAction()
      .then((res) => {
        if (res.success) setTemplates(res.templates);
      })
      .finally(() => setIsLoadingTemplates(false));
  }, []);

  // Carrega documentos da empresa autenticada
  const loadCompanyDocs = () => {
    if (!company) return;
    setIsLoadingDocs(true);
    getCompanyDocumentsAction()
      .then((res) => {
        if (res.success) setDocuments(res.documents);
      })
      .finally(() => setIsLoadingDocs(false));
  };

  useEffect(() => {
    loadCompanyDocs();
  }, [company]);

  // Mensagens temporárias de feedback
  const triggerSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const triggerError = (msg: string) => {
    setActionErrorMsg(msg);
    setTimeout(() => setActionErrorMsg(null), 5000);
  };

  // Filtragem dos modelos globais
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.legal_basis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "TODAS" || t.category === selectedCategory;
    const matchesNature = selectedNature === "TODAS" || t.normative_nature === selectedNature;
    return matchesSearch && matchesCategory && matchesNature;
  });

  // Filtragem dos documentos da empresa
  const filteredDocuments = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "TODAS" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Adoção de modelo
  const handleOpenAdoption = (tmpl: IntegrityTemplate) => {
    setViewingTemplate(null);
    setAdoptingTemplate(tmpl);
    const initialGov: Record<string, string> = {};
    tmpl.governance_fields.forEach((f) => {
      initialGov[f.field] = f.default_value || "";
    });
    setGovernanceForm(initialGov);
  };

  const handleConfirmAdoption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptingTemplate) return;
    setIsProcessing(true);
    try {
      const res = await createDocumentFromTemplateAction(adoptingTemplate.id, governanceForm);
      if (res.success && res.document) {
        setAdoptingTemplate(null);
        triggerSuccess(`Documento "${res.document.title}" criado com sucesso como Rascunho!`);
        loadCompanyDocs();
        setActiveTab("MEUS_DOCUMENTOS");
        setEditingDoc(res.document);
      } else {
        triggerError(res.error || "Erro ao criar documento a partir do modelo.");
      }
    } catch {
      triggerError("Falha na comunicação com o servidor.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Salvamento de edição de documento
  const handleSaveDocument = async () => {
    if (!editingDoc) return;
    setIsProcessing(true);
    try {
      const res = await saveCompanyDocumentAction(editingDoc.id, {
        title: editingDoc.title,
        content: editingDoc.content,
        description: editingDoc.description,
      });
      if (res.success && res.document) {
        setEditingDoc(res.document);
        triggerSuccess("Alterações salvas com sucesso!");
        loadCompanyDocs();
      } else {
        triggerError(res.error || "Erro ao salvar alterações.");
      }
    } catch {
      triggerError("Falha na comunicação ao salvar documento.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Alteração de status (Aprovação / Publicação)
  const handleUpdateStatus = async (newStatus: DocumentStatus) => {
    if (!editingDoc) return;
    setIsProcessing(true);
    try {
      const res = await updateDocumentStatusAction(editingDoc.id, newStatus);
      if (res.success && res.document) {
        setEditingDoc(res.document);
        triggerSuccess(`Documento atualizado para ${newStatus} (v${res.document.version})!`);
        loadCompanyDocs();
      } else {
        triggerError(res.error || "Erro ao atualizar status do documento.");
      }
    } catch {
      triggerError("Falha ao atualizar ciclo de vida do documento.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Exclusão de documento
  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este documento da organização?")) return;
    setIsProcessing(true);
    try {
      const res = await deleteCompanyDocumentAction(id);
      if (res.success) {
        triggerSuccess("Documento excluído com sucesso.");
        if (editingDoc?.id === id) setEditingDoc(null);
        loadCompanyDocs();
      } else {
        triggerError(res.error || "Erro ao excluir documento.");
      }
    } catch {
      triggerError("Erro na requisição de exclusão.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download / visualização segura de documento próprio
  const handleDownloadSecureDoc = async (docId: string) => {
    try {
      const res = await getSecureDocumentUrlAction(docId);
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      } else {
        triggerError(res.error || "Não foi possível gerar link de acesso seguro ao arquivo.");
      }
    } catch {
      triggerError("Erro ao recuperar arquivo do Storage.");
    }
  };

  // Badge da Natureza Normativa
  const renderNatureBadge = (nature: NormativeNature) => {
    switch (nature) {
      case "REQUISITO_LEGAL":
        return <Badge variant="danger">Requisito Legal Obrigatório</Badge>;
      case "BOA_PRATICA":
        return <Badge variant="info">Boa Prática Recomendada</Badge>;
      case "DIRETRIZ_RECOMENDADA":
        return <Badge variant="warning">Diretriz Recomendada</Badge>;
      case "REGRA_INTERNA":
        return <Badge variant="neutral">Regra Interna Opcional</Badge>;
    }
  };

  // Badge do Status do Documento
  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "RASCUNHO":
        return <Badge variant="neutral">Rascunho</Badge>;
      case "AGUARDANDO_APROVACAO":
        return <Badge variant="warning">Aguardando Aprovação</Badge>;
      case "APROVADO":
        return <Badge variant="info">Aprovado</Badge>;
      case "PUBLICADO":
        return <Badge variant="success">Publicado</Badge>;
    }
  };

  if (companyLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse pb-12">
        <div className="h-14 w-80 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Governança & Conformidade Documental</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Biblioteca de Integridade
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Modelos oficiais e acervo documental de conformidade isolado para{" "}
            <strong className="text-slate-800">{company?.trade_name || company?.legal_name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 border-slate-300"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Upload de Documento Próprio</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => setActiveTab("MODELOS")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Adotar Novo Modelo</span>
          </Button>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}
      {actionErrorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* TABS DE NAVEGAÇÃO */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("MODELOS")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "MODELOS"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Modelos TechCompliance ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("MEUS_DOCUMENTOS")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "MEUS_DOCUMENTOS"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Documentos da Empresa ({documents.length})</span>
        </button>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "MODELOS"
                ? "Buscar entre os 20 modelos por palavra-chave ou artigo legal..."
                : "Buscar nos documentos da empresa..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Categoria */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5" />
            <span>Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODAS">Todas as Categorias</option>
              {INTEGRITY_CATEGORIES_CONFIG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Natureza Normativa (apenas na aba de modelos) */}
          {activeTab === "MODELOS" && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Natureza:</span>
              <select
                value={selectedNature}
                onChange={(e) => setSelectedNature(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODAS">Todas as Naturezas</option>
                <option value="REQUISITO_LEGAL">Requisito Legal</option>
                <option value="BOA_PRATICA">Boa Prática</option>
                <option value="DIRETRIZ_RECOMENDADA">Diretriz Recomendada</option>
                <option value="REGRA_INTERNA">Regra Interna</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: MODELOS GLOBAIS */}
      {activeTab === "MODELOS" && (
        <div className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <EmptyState
              title="Nenhum modelo localizado"
              description="Tente ajustar seus termos de busca ou filtros de categoria."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Modelo #{t.order.toString().padStart(2, "0")}
                      </span>
                      {renderNatureBadge(t.normative_nature)}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <p className="font-medium text-slate-700">Base Normativa:</p>
                      <p className="line-clamp-2 text-slate-500">{t.legal_basis}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingTemplate(t)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Modelo</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenAdoption(t)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <span>Usar este Modelo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: DOCUMENTOS DA EMPRESA */}
      {activeTab === "MEUS_DOCUMENTOS" && (
        <div className="space-y-6">
          {filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">
                  Nenhum documento adotado até o momento
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sua empresa ainda não possui políticas complementares ou termos adotados. Explore a
                  aba de modelos oficiais ou faça o upload de documentos já vigentes.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => setActiveTab("MODELOS")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  Explorar 20 Modelos Oficiais
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUploadModalOpen(true)}
                  className="text-xs border-slate-300"
                >
                  Upload de Arquivo Próprio
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Documento</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Origem / Formato</th>
                      <th className="py-3 px-4">Versão</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Última Atualização</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          {doc.title}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                            {doc.category.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {doc.file_url ? (
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Download className="w-3.5 h-3.5 text-blue-600" />
                              <span>{doc.file_type || "PDF"} ({doc.file_size || "Anexo"})</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-600">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>Modelo Nativo</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          v{doc.version}
                        </td>
                        <td className="py-3 px-4">{renderStatusBadge(doc.status)}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(doc.updated_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc.file_url ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadSecureDoc(doc.id)}
                                className="text-xs h-8 border-slate-200"
                              >
                                <Download className="w-3.5 h-3.5 mr-1" />
                                <span>Baixar</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingDoc(doc)}
                                className="text-xs h-8 border-slate-200"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                <span>Editar / Ver</span>
                              </Button>
                            )}

                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                              title="Excluir documento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: VISUALIZAR MODELO OFICIAL */}
      {viewingTemplate && (
        <Modal
          isOpen={true}
          onClose={() => setViewingTemplate(null)}
          title={viewingTemplate.title}
          maxWidth="xl"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-700">
                  Modelo Oficial #{viewingTemplate.order.toString().padStart(2, "0")}
                </p>
                <p className="text-[11px] text-slate-500">{viewingTemplate.subtitle}</p>
              </div>
              {renderNatureBadge(viewingTemplate.normative_nature)}
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Base Normativa e Recomendação:</span>
              </p>
              <p>{viewingTemplate.legal_basis}</p>
              <p className="text-[11px] text-amber-700 pt-1">
                <strong>Recomendado para:</strong> {viewingTemplate.recommended_for}
              </p>
            </div>

            {/* PREVISÃO DO TEXTO DO MODELO */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Texto Integral do Modelo:</label>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                {viewingTemplate.default_content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setViewingTemplate(null)}>
                Fechar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleOpenAdoption(viewingTemplate)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <span>Usar este Modelo para a Empresa</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: ADOTAR MODELO COM CAMPOS DE GOVERNANÇA */}
      {adoptingTemplate && (
        <Modal
          isOpen={true}
          onClose={() => setAdoptingTemplate(null)}
          title={`Adotar: ${adoptingTemplate.title}`}
          maxWidth="lg"
        >
          <form onSubmit={handleConfirmAdoption} className="space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Preenchimento Inteligente dos Dados Cadastrais:</span>
              </p>
              <p className="text-blue-800">
                Os dados de <strong>Razão Social</strong>, <strong>Nome Fantasia</strong>,{" "}
                <strong>CNPJ</strong> e <strong>Responsável da Integridade</strong> da sua empresa
                serão vinculados automaticamente ao texto oficial.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-700 pt-1">
                <p>• Empresa: {company?.legal_name}</p>
                <p>• CNPJ: {company?.cnpj ? formatCNPJ(company.cnpj) : "N/A"}</p>
                <p>• Responsável: {company?.integrity_officer_name || "Diretoria de Integridade"}</p>
                <p>• Versão Inicial: 1.0 (Rascunho)</p>
              </div>
            </div>

            {/* CAMPOS ESPECÍFICOS DE GOVERNANÇA MANUAL */}
            {adoptingTemplate.governance_fields.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Definições de Governança Interna:
                </label>
                <div className="space-y-3">
                  {adoptingTemplate.governance_fields.map((f) => (
                    <div key={f.field} className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">{f.label}</label>
                      <input
                        type="text"
                        value={governanceForm[f.field] || ""}
                        onChange={(e) =>
                          setGovernanceForm({ ...governanceForm, [f.field]: e.target.value })
                        }
                        placeholder={f.default_value}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-400">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdoptingTemplate(null)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? "Gerando Documento..." : "Criar Documento Rascunho"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: EDITOR E GESTOR DE DOCUMENTO DA EMPRESA */}
      {editingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setEditingDoc(null)}
          title={`Documento da Empresa: ${editingDoc.title}`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            {/* CABEÇALHO DO DOCUMENTO COM CONTROLE DE VERSÕES */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Versão {editingDoc.version}</span>
                  {renderStatusBadge(editingDoc.status)}
                </div>
                <p className="text-xs text-slate-500">
                  Criado em {new Date(editingDoc.created_at).toLocaleDateString("pt-BR")} por{" "}
                  {editingDoc.created_by || "Gestor de Integridade"}
                </p>
              </div>

              {/* AÇÕES DE TRANSIÇÃO DE CICLO DE VIDA */}
              <div className="flex items-center gap-2">
                {editingDoc.status === "RASCUNHO" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus("AGUARDANDO_APROVACAO")}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    Submeter para Aprovação
                  </Button>
                )}

                {editingDoc.status === "AGUARDANDO_APROVACAO" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus("APROVADO")}
                    disabled={isProcessing}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Aprovar Documento
                  </Button>
                )}

                {editingDoc.status === "APROVADO" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus("PUBLICADO")}
                    disabled={isProcessing}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Publicar para Colaboradores
                  </Button>
                )}
              </div>
            </div>

            {/* TÍTULO EDITÁVEL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Título do Documento:</label>
              <input
                type="text"
                value={editingDoc.title}
                onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* EDITOR DE CONTEÚDO DO DOCUMENTO */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Conteúdo do Documento (Markdown / Texto Integral):
                </label>
                <span className="text-[11px] text-slate-400">
                  {editingDoc.content.length} caracteres
                </span>
              </div>
              <textarea
                rows={16}
                value={editingDoc.content}
                onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 leading-relaxed"
              />
            </div>

            {/* HISTÓRICO DE VERSÕES */}
            {editingDoc.history && editingDoc.history.length > 0 && (
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <p className="font-bold text-slate-700">Histórico de Versões e Auditoria:</p>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {editingDoc.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        • <strong>v{h.version}</strong> [{h.status}] - {h.notes}
                      </span>
                      <span>{new Date(h.changed_at).toLocaleString("pt-BR")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOTÕES DE AÇÃO */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setEditingDoc(null)}
                disabled={isProcessing}
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveDocument}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: UPLOAD DE DOCUMENTO PRÓPRIO */}
      {uploadModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setUploadModalOpen(false)}
          title="Upload de Documento Próprio da Empresa"
          maxWidth="lg"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsProcessing(true);
              const form = e.currentTarget;
              const formData = new FormData(form);
              try {
                const res = await uploadOwnDocumentAction(formData);
                if (res.success && res.document) {
                  setUploadModalOpen(false);
                  triggerSuccess(`Documento "${res.document.title}" anexado com sucesso!`);
                  loadCompanyDocs();
                  setActiveTab("MEUS_DOCUMENTOS");
                } else {
                  triggerError(res.error || "Erro no upload do documento.");
                }
              } catch {
                triggerError("Falha na comunicação ao realizar upload.");
              } finally {
                setIsProcessing(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Título do Documento *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ex: Política Anticorrupção Vigente - Revisão 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Categoria</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {INTEGRITY_CATEGORIES_CONFIG.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Natureza</label>
                <select
                  name="normative_nature"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="REQUISITO_LEGAL">Requisito Legal</option>
                  <option value="BOA_PRATICA">Boa Prática</option>
                  <option value="DIRETRIZ_RECOMENDADA">Diretriz Recomendada</option>
                  <option value="REGRA_INTERNA">Regra Interna</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Arquivo Digitalizado (PDF ou Word - máx. 25MB) *
              </label>
              <input
                type="file"
                name="file"
                required
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Descrição / Finalidade</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Breve resumo da finalidade e órgão emissor interno do documento..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? "Enviando Arquivo..." : "Concluir Upload"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
