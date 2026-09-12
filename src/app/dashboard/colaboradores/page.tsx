"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Copy,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { Employee } from "@/types";
import { formatCPF, maskCPF } from "@/lib/utils";
import { createEmployeeAction, batchCreateEmployeesAction } from "@/app/actions/management";
import { useCompany } from "@/contexts/CompanyContext";
import { getEmployeesAction } from "@/app/actions/employees";

export default function EmployeesManagementPage() {
  const { company, isLoading: companyLoading } = useCompany();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGeneralLink, setCopiedGeneralLink] = useState(false);

  // Busca colaboradores reais do Supabase quando empresa está carregada
  useEffect(() => {
    if (!company) return;
    setLoadingEmployees(true);
    getEmployeesAction().then((res) => {
      if (res.success) setEmployees(res.employees);
      setLoadingEmployees(false);
    });
  }, [company]);

  // Form Individual
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Form Batch (CSV / Texto)
  const [batchText, setBatchText] = useState(
    "Ana Paula Souza;45678901234;Assistente Financeiro;11955554444;ana.souza@empresa.com.br\nLucas de Oliveira;56789012345;Operador de Empilhadeira;11944443333;lucas@empresa.com.br"
  );

  const handleAddIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cpf.trim()) return;

    const res = await createEmployeeAction({
      full_name: fullName.trim(),
      cpf: cpf.trim(),
      role: role.trim() || "Colaborador",
      phone: phone.trim() || "11999999999",
      email: email.trim() || undefined,
    });

    if (res.success) {
      // Recarrega do Supabase para garantir dados frescos
      const fresh = await getEmployeesAction();
      if (fresh.success) setEmployees(fresh.employees);
      setShowAddModal(false);
      setFullName("");
      setCpf("");
      setRole("");
      setPhone("");
      setEmail("");
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await batchCreateEmployeesAction(batchText);
    if (res.success) {
      const fresh = await getEmployeesAction();
      if (fresh.success) setEmployees(fresh.employees);
      setShowBatchModal(false);
    }
  };

  const copyEmployeeLink = (token: string, empId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/c/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(empId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWhatsAppShareUrl = (token: string, name: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/c/${token}`;
    const text = encodeURIComponent(
      `Olá ${name}! Acesse o portal corporativo para leitura do Código de Conduta e capacitação obrigatória em Integridade e NR-1: ${link}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.cpf.includes(search) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  // Loading: aguarda empresa e colaboradores
  if (companyLoading || !company) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Colaboradores</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre equipes, distribua os links mobile sem senha e audite aceites e certificados em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2 rounded-xl text-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            Importar em Lote
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Colaborador
          </button>
        </div>
      </div>

      {/* Banner Link Único WhatsApp (Sem Cadastro Prévio) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Método Ágil: Sem Cadastro Prévio
          </div>
          <h2 className="text-base font-bold text-white">Link Único de Conscientização da Equipe</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Envie este link direto no grupo de WhatsApp dos colaboradores. O próprio colaborador informa Nome, CPF e Função no primeiro acesso, lê os cards de microlearning, responde ao quiz e assina o Código de Conduta em 2 a 3 minutos.
          </p>
          <div className="text-xs font-mono text-emerald-400 pt-1">
            {typeof window !== "undefined" ? `${window.location.origin}/treinar/${company.slug}` : `/treinar/${company.slug}`}
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              const url = `${window.location.origin}/treinar/${company.slug}`;
              navigator.clipboard.writeText(url);
              setCopiedGeneralLink(true);
              setTimeout(() => setCopiedGeneralLink(false), 2000);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-slate-700" />
            {copiedGeneralLink ? "Link Copiado!" : "Copiar Link Único"}
          </button>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Olá equipe ${company.trade_name}! Segue o link oficial para realização do treinamento rápido de Integridade e NR-1 (2 a 3 minutos pelo celular): ${typeof window !== "undefined" ? window.location.origin : ""}/treinar/${company.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Enviar no WhatsApp
          </a>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, cargo ou CPF..."
          className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
        />
      </div>

      {/* Tabela de Colaboradores */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-4">CPF / Função</th>
                <th className="py-3 px-4">Aceite Código</th>
                <th className="py-3 px-4">Capacitação</th>
                <th className="py-3 px-4 text-right">Link de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.map((emp) => {
                const certs: any[] = [];
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{emp.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{emp.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>{formatCPF(emp.cpf)}</div>
                      <div className="text-[11px] text-slate-500">{emp.role}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {emp.policy_accepted_at ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Assinado
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {new Date(emp.policy_accepted_at).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pendente
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {certs.length === 2 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          2/2 Trilhas (100%)
                        </span>
                      ) : certs.length === 1 ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          1/2 Trilha (50%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          Não iniciado
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => copyEmployeeLink(emp.access_token, emp.id)}
                          title="Copiar link mobile"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={getWhatsAppShareUrl(emp.access_token, emp.full_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Disparar via WhatsApp"
                          className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/c/${emp.access_token}`}
                          target="_blank"
                          title="Abrir como Colaborador"
                          className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      {copiedId === emp.id && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">Link Copiado!</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro Individual */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Novo Colaborador</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIndividual} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Fernando Souza"
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF (11 dígitos)</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / Whats</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Função</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Motorista, Analista de Contratos..."
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@empresa.com.br"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Salvar e Gerar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cadastro em Lote */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Importação de Colaboradores em Lote</h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Cole abaixo os colaboradores no padrão: <br />
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-slate-700">Nome;CPF;Cargo;Telefone;Email</code>
            </p>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <textarea
                rows={6}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Importar e Gerar Acessos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
