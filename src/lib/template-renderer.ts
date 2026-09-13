import { Company, IntegrityTemplate } from '@/types';
import { formatCNPJ } from './utils';

export function renderTemplateWithCompany(
  content: string,
  company: Company | null,
  governanceValues: Record<string, string> = {},
  template?: IntegrityTemplate | null
): string {
  if (!content) return '';

  const legalName = company?.legal_name || company?.trade_name || 'Sua Organização';
  const tradeName = company?.trade_name || company?.legal_name || 'Sua Organização';
  const formattedCnpj = company?.cnpj ? formatCNPJ(company.cnpj) : '00.000.000/0001-00';
  const officerName = company?.integrity_officer_name || 'Diretoria de Integridade';
  const officerRole = 'Responsável pelo Programa de Integridade';
  const formattedDate = new Date().toLocaleDateString('pt-BR');
  const version = '1.0';

  let rendered = content
    .replace(/\[RAZÃO SOCIAL\]/g, legalName)
    .replace(/\[NOME FANTASIA\]/g, tradeName)
    .replace(/\[NOME DA EMPRESA\]/g, tradeName)
    .replace(/\[EMPRESA\]/g, tradeName)
    .replace(/\[CNPJ\]/g, formattedCnpj)
    .replace(/\[RESPONSÁVEL\]/g, officerName)
    .replace(/\[CARGO\]/g, officerRole)
    .replace(/\[DATA\]/g, formattedDate)
    .replace(/\[VERSÃO\]/g, version);

  if (template?.governance_fields) {
    template.governance_fields.forEach((gf) => {
      const val = governanceValues[gf.field] || gf.default_value || gf.field;
      rendered = rendered.split(gf.field).join(val);
    });
  }

  Object.entries(governanceValues).forEach(([key, val]) => {
    if (val) {
      rendered = rendered.split(key).join(val);
    }
  });

  return rendered;
}
