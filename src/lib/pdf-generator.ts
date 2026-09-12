import jsPDF from "jspdf";
import QRCode from "qrcode";
import { formatCNPJ, formatCPF } from "./utils";
import { mockStore } from "./mock-data";

export async function generateDossierPDF(originUrl?: string): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const company = mockStore.getCompany();
  const policy = mockStore.getPolicy();
  const employees = mockStore.getEmployees();
  const metrics = mockStore.getComplianceMetrics();
  const validationCode = `DOSSIE-${new Date().getFullYear()}-${company.cnpj.substring(0, 8)}`;
  
  const canonicalUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://licitcompliance.vercel.app");
  const validationUrl = `${canonicalUrl}/validar/${validationCode}`;

  // Gerar QRCode DataURL
  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
      margin: 1,
      width: 120,
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
  }

  // --- CABEÇALHO OFICIAL ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 34, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("DOSSIÊ DE EVIDÊNCIAS DO PROGRAMA DE INTEGRIDADE", 14, 15);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("Relatório Documental de Evidenciação e Conformidade • Lei nº 14.133/2021 e NR-1", 14, 22);

  doc.setFontSize(7.5);
  doc.text(`Compilação eletrônica de registros auditáveis gerada em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 29);

  // --- DADOS DA EMPRESA (TENANT) ---
  let y = 43;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text("1. IDENTIFICAÇÃO DA EMPRESA FORNECEDORA", 14, y);

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 30, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Razão Social:`, 18, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(company.legal_name, 45, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Nome Fantasia:`, 18, y + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${company.trade_name} (${company.company_size || "DEMAIS"} - ${company.status || "ATIVA"})`, 45, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`CNPJ:`, 18, y + 18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(formatCNPJ(company.cnpj), 45, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Responsável:`, 18, y + 24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${company.integrity_officer_name || "Diretoria de Compliance"} (${company.integrity_officer_email || "compliance@empresa.com.br"})`, 45, y + 24);

  // --- DECLARAÇÃO FORMAL DE EVIDENCIAÇÃO ---
  y += 38;
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("2. TERMO DE CONSOLIDAÇÃO DE EVIDÊNCIAS REGISTRADAS", 14, y);

  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const declarationText = `O presente relatório consolida as informações e evidências registradas na plataforma TechCompliance, para fins de comprovação documental perante Comissões de Contratação, Pregoeiros e Fiscais de Contratos da Administração Pública.\nA pessoa jurídica qualificada mantém registros de Código de Conduta formalizado, ações periódicas de capacitação em integridade licitatória (art. 25, § 4º da Lei Federal nº 14.133/2021), canal de denúncias independente com garantia de sigilo e não retaliação (NR-1 e Lei nº 14.457/2022) e procedimento de Due Diligence prévia de terceiros.`;
  const splitDeclaration = doc.splitTextToSize(declarationText, 182);
  doc.text(splitDeclaration, 14, y);

  // --- INDICADORES QUANTITATIVOS DE PREPARAÇÃO ---
  y += 28;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("3. INDICADORES DE ADESÃO E CAPACITAÇÃO", 14, y);

  y += 6;
  // Card 1
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Colaboradores Totais", 18, y + 6);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${metrics.totalEmployees}`, 18, y + 15);

  // Card 2
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(77, y, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Aceite da Política", 81, y + 6);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // green-500
  doc.text(`${metrics.policyRate}%`, 81, y + 15);

  // Card 3
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(140, y, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Conclusão Treinamentos", 144, y + 6);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(`${metrics.trainingRate}%`, 144, y + 15);

  // --- RELATÓRIO NOMINAL DE AUDITORIA ---
  y += 28;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("4. REGISTRO NOMINAL AUDITÁVEL DE COLABORADORES", 14, y);

  y += 5;
  // Header da tabela
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 7, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("COLABORADOR", 16, y + 5);
  doc.text("CPF", 75, y + 5);
  doc.text("CARGO", 100, y + 5);
  doc.text("POLÍTICA ASSINADA", 140, y + 5);
  doc.text("STATUS TREINO", 172, y + 5);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  employees.slice(0, 10).forEach((emp, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, "F");
    }
    doc.setTextColor(30, 41, 59);
    doc.text(emp.full_name.substring(0, 28), 16, y + 4.5);
    doc.text(formatCPF(emp.cpf), 75, y + 4.5);
    doc.text(emp.role.substring(0, 20), 100, y + 4.5);
    
    if (emp.policy_accepted_at) {
      doc.setTextColor(16, 185, 129);
      doc.text("SIM (Auditado)", 140, y + 4.5);
    } else {
      doc.setTextColor(239, 68, 68);
      doc.text("Pendente", 140, y + 4.5);
    }

    const completed = mockStore.getEmployeeCertificates(emp.id).length;
    if (completed >= 2) {
      doc.setTextColor(16, 185, 129);
      doc.text("100% Concluído", 172, y + 4.5);
    } else if (completed === 1) {
      doc.setTextColor(217, 119, 6);
      doc.text("50% Parcial", 172, y + 4.5);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text("Em andamento", 172, y + 4.5);
    }

    y += 6;
  });

  // --- EVIDENCIAÇÃO DO CANAL DE DENÚNCIAS ---
  y += 5;
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("5. COMPROVAÇÃO DO CANAL DE DENÚNCIAS & PREVENÇÃO AO ASSÉDIO", 14, y);

  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const canalText = `A empresa mantém canal de denúncias independente e sigiloso acessível permanentemente pelo endereço público /canal/${company.slug}. Registros de atendimentos no período: ${metrics.totalReports} chamado(s), com ${metrics.resolvedReports} concluído(s) ou instruído(s) sob estrito sigilo e garantia de não retaliação nos termos da NR-1 / Lei nº 14.457/2022.`;
  const splitCanal = doc.splitTextToSize(canalText, 182);
  doc.text(splitCanal, 14, y);

  // --- RODAPÉ COM QR CODE E VALIDAÇÃO PÚBLICA ---
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 255, 196, 255);

  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 14, 258, 28, 28);
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("VALIDAÇÃO PÚBLICA DE AUTENTICIDADE DOCUMENTAL", 46, 264);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Chave de Autenticação do Dossiê: ${validationCode}`, 46, 269);
  doc.text(`Acesse a rota ou aponte a câmera para o QR Code ao lado para conferência de autenticidade:`, 46, 274);
  doc.setTextColor(37, 99, 235);
  doc.text(validationUrl, 46, 279);

  // Salvar PDF
  doc.save(`Dossie_Integridade_${company.slug.toUpperCase()}_${new Date().getFullYear()}.pdf`);
}

export async function generateCertificatePDF(
  employeeName: string,
  cpf: string,
  trainingTitle: string,
  completedDate: string,
  certificateCode: string,
  originUrl?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const company = mockStore.getCompany();
  const canonicalUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://licitcompliance.vercel.app");
  const validationUrl = `${canonicalUrl}/validar/${certificateCode}`;

  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
      margin: 1,
      width: 120,
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code do certificado:", err);
  }

  // Borda elegante
  doc.setDrawColor(30, 58, 138); // blue-900
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(0.8);
  doc.rect(13, 13, 271, 184);

  // Cabeçalho
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text("CERTIFICADO DE CAPACITAÇÃO E CONFORMIDADE", 148, 38, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("PROGRAMA DE INTEGRIDADE LICITATÓRIA E NR-1", 148, 46, { align: "center" });

  // Corpo do Certificado
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text("Certificamos para todos os fins de direito e comprovação perante a Administração Pública que", 148, 70, { align: "center" });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(employeeName.toUpperCase(), 148, 85, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Inscrito(a) no CPF sob o nº ${formatCPF(cpf)}`, 148, 93, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text(`concluiu com êxito o treinamento corporativo obrigatório de microlearning sobre:`, 148, 110, { align: "center" });

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text(`"${trainingTitle}"`, 148, 122, { align: "center" });

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const legalRef = trainingTitle.includes("14.133")
    ? "Em estrito cumprimento às exigências de Programa de Integridade da Lei Federal nº 14.133/2021."
    : "Em cumprimento às normas de prevenção ao assédio e segurança no trabalho da NR-1 / Lei Federal nº 14.457/2022.";
  doc.text(legalRef, 148, 130, { align: "center" });

  // Rodapé com QR Code e Assinaturas
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 24, 145, 34, 34);
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Autenticidade digital verificável:", 62, 155);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Código: ${certificateCode}`, 62, 161);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235);
  doc.text(validationUrl, 62, 167);

  // Assinatura da Empresa
  doc.setDrawColor(148, 163, 184);
  doc.line(190, 165, 265, 165);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(company.legal_name, 227.5, 171, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Comissão de Integridade & Compliance - ${formatCNPJ(company.cnpj)}`, 227.5, 176, { align: "center" });
  doc.text(`Data de Conclusão: ${new Date(completedDate).toLocaleDateString("pt-BR")}`, 227.5, 181, { align: "center" });

  doc.save(`Certificado_${certificateCode}.pdf`);
}
