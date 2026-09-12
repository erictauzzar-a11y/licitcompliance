import { cleanCNPJ, isValidCNPJFormat } from "./utils";
import { CompanyPartner, SecondaryActivity } from "@/types";

export interface CNPJEnrichedData {
  cnpj: string;
  legal_name: string;
  trade_name: string;
  status: string;
  opening_date?: string;
  legal_nature?: string;
  company_size?: string;
  share_capital?: number | string;
  headquarters_or_branch?: string;
  // Endereço
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  full_address?: string;
  // Atividades
  main_cnae_code?: string | number;
  main_cnae_description?: string;
  secondary_cnaes?: SecondaryActivity[];
  // Regime Tributário
  is_simples_nacional?: boolean | null;
  simples_nacional_date?: string | null;
  is_mei?: boolean | null;
  mei_date?: string | null;
  tax_regime?: string;
  // Quadro Societário
  partners?: CompanyPartner[];
  // Raw data flag
  raw_source?: string;
}

/**
 * Consulta oficial de CNPJ na BrasilAPI com cabeçalho compatível e tratamento rigoroso de erros.
 * Suporta formatos numéricos e alfanuméricos de CNPJ.
 */
export async function fetchCompanyByCNPJ(rawCnpj: string): Promise<CNPJEnrichedData> {
  const cnpjClean = cleanCNPJ(rawCnpj);

  if (!isValidCNPJFormat(cnpjClean)) {
    throw new Error("CNPJ inválido. Confira o número informado.");
  }

  const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LicitCompliance-SaaS/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
  } catch (err) {
    console.error("Erro de conexão na consulta de CNPJ:", err);
    throw new Error("Não foi possível consultar os dados agora. Tente novamente.");
  }

  if (response.status === 404) {
    throw new Error("Não encontramos uma empresa para este CNPJ.");
  }

  if (!response.ok) {
    console.error("Erro HTTP ao consultar CNPJ:", response.status, response.statusText);
    throw new Error("Não foi possível consultar os dados agora. Tente novamente.");
  }

  const data = await response.json();

  // Tratamento de Quadro Societário (QSA)
  const partners: CompanyPartner[] = Array.isArray(data.qsa)
    ? data.qsa.map((s: any) => ({
        name: s.nome_socio || "Sócio Administrador",
        role: s.qualificacao_socio || "Administrador",
        cpf_cnpj_masked: s.cnpj_cpf_do_socio || "",
        age_range: s.faixa_etaria || undefined,
        entry_date: s.data_entrada_sociedade || undefined,
      }))
    : [];

  // Tratamento de CNAEs Secundários
  const secondaryCnaes: SecondaryActivity[] = Array.isArray(data.cnaes_secundarios)
    ? data.cnaes_secundarios.map((c: any) => ({
        code: c.codigo || c.code || "",
        description: c.descricao || c.description || "",
      }))
    : [];

  // Endereço formatado e detalhado
  const logradouro = data.logradouro || "";
  const numero = data.numero || "S/N";
  const complemento = data.complemento || "";
  const bairro = data.bairro || "";
  const municipio = data.municipio || "";
  const uf = data.uf || "";
  const cep = data.cep || "";

  const addressParts = [
    logradouro ? `${logradouro}, ${numero}` : "",
    complemento,
    bairro,
    municipio && uf ? `${municipio}/${uf}` : municipio || uf,
    cep ? `CEP: ${cep}` : "",
  ].filter(Boolean);

  const fullAddress = addressParts.join(" - ");

  // Regime tributário interpretado
  let taxRegime = "Regime Geral (Lucro Presumido / Real)";
  if (data.opcao_pelo_simples) {
    taxRegime = data.opcao_pelo_mei ? "SIMPLES NACIONAL (MEI)" : "SIMPLES NACIONAL";
  }

  return {
    cnpj: data.cnpj || cnpjClean,
    legal_name: data.razao_social || "Razão Social Não Informada",
    trade_name: data.nome_fantasia || data.razao_social || "Nome Fantasia",
    status: data.descricao_situacao_cadastral || "ATIVA",
    opening_date: data.data_inicio_atividade || undefined,
    legal_nature: data.natureza_juridica || undefined,
    company_size: data.porte || data.descricao_porte || undefined,
    share_capital: data.capital_social ? Number(data.capital_social) : undefined,
    headquarters_or_branch: data.descricao_identificador_matriz_filial || (data.identificador_matriz_filial === 1 ? "MATRIZ" : "FILIAL"),
    cep,
    street: logradouro,
    number: numero,
    complement: complemento,
    neighborhood: bairro,
    city: municipio,
    state: uf,
    full_address: fullAddress,
    main_cnae_code: data.cnae_fiscal,
    main_cnae_description: data.cnae_fiscal_descricao,
    secondary_cnaes: secondaryCnaes,
    is_simples_nacional: typeof data.opcao_pelo_simples === "boolean" ? data.opcao_pelo_simples : null,
    simples_nacional_date: data.data_opcao_pelo_simples || null,
    is_mei: typeof data.opcao_pelo_mei === "boolean" ? data.opcao_pelo_mei : null,
    mei_date: data.data_opcao_pelo_mei || null,
    tax_regime: taxRegime,
    partners,
    raw_source: "BrasilAPI (Receita Federal)",
  };
}
