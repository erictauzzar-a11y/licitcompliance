import jsPDF from "jspdf";
import QRCode from "qrcode";
import { TenderAnalysisResult } from "@/types/compliance";
import { formatCNPJ } from "./utils";

/**
 * GERADOR DO RELATÓRIO DE ADERÊNCIA AO EDITAL DE LICITAÇÃO (PDF AUDITÁVEL)
 * Produz relatório específico do certame com cláusulas, conformidade percentual,
 * matriz de requisitos e QR Code de validação pública.
 */
export async function generateEdictAnalysisReportPDF(
  analysis: TenderAnalysisResult,
  tenantLegalName: string,
  tenantCnpj?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const canonicalUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://techcompliance.vercel.app");
  const validationUrl = `${canonicalUrl}/validar/${analysis.id}`;

  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 120 });
  } catch (err) {
    console.error("Erro ao gerar QR Code para Relatório de Edital:", err);
  }

  // --- CABEÇALHO EXECUTIVO ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RELATÓRIO DE ADERÊNCIA AO EDITAL DE LICITAÇÃO", 14, 13);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("Avaliação Preliminar de Integridade, Requisitos Normativos e Lei nº 14.133/2021", 14, 20);
  doc.text(
    `Licitante: ${tenantLegalName}${tenantCnpj ? ` (CNPJ: ${formatCNPJ(tenantCnpj)})` : ""} | Emissão: ${new Date(
      analysis.analyzedAt || Date.now()
    ).toLocaleString("pt-BR")}`,
    14,
    26
  );

  // --- SCORECARD DE ADERÊNCIA AO EDITAL ---
  let y = 38;
  const fitScore = analysis.overallFitScore ?? 0;
  let bannerColor: [number, number, number] = [16, 185, 129]; // Verde
  let fitStatusText = `ADERÊNCIA AO EDITAL: ${fitScore}% — ALTA CONFORMIDADE DE EVIDÊNCIAS`;

  if (fitScore < 50) {
    bannerColor = [220, 38, 38]; // Vermelho
    fitStatusText = `ADERÊNCIA AO EDITAL: ${fitScore}% — RISCO CRÍTICO / PENDÊNCIAS IMPEDITIVAS`;
  } else if (fitScore < 75) {
    bannerColor = [217, 119, 6]; // Âmbar
    fitStatusText = `ADERÊNCIA AO EDITAL: ${fitScore}% — CONFORMIDADE PARCIAL / REQUER COMPLEMENTAÇÃO`;
  }

  doc.setFillColor(...bannerColor);
  doc.roundedRect(14, y, 182, 14, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(fitStatusText, 18, y + 9.5);

  // --- IDENTIFICAÇÃO DO INSTRUMENTO CONVOCATÓRIO ---
  y += 20;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("1. IDENTIFICAÇÃO DO INSTRUMENTO CONVOCATÓRIO", 14, y);

  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 22, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Arquivo Analisado:", 18, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.fileName || "Edital_Pregao.pdf", 52, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Certame / Objeto:", 18, y + 11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.tenderNumber || "Pregão Eletrônico Identificado", 52, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Órgão Licitante:", 18, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.organName || "Órgão da Administração Pública", 52, y + 16);

  // --- MATRIZ DE REQUISITOS EXTRAÍDOS ---
  y += 27;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("2. MATRIZ DE CORRESPONDÊNCIA DE REQUISITOS DE INTEGRIDADE", 14, y);

  y += 5;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("REQUISITO DE INTEGRIDADE", 18, y + 4.2);
  doc.text("FUNDAMENTO / CLÁUSULA", 90, y + 4.2);
  doc.text("SITUAÇÃO DA LICITANTE", 148, y + 4.2);

  y += 6;
  const reqs = analysis.requirements || [];
  reqs.slice(0, 5).forEach((req, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 12, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 12, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(doc.splitTextToSize(req.title, 70), 18, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(req.legal_basis || req.edict_clause, 54), 90, y + 4.5);

    // Status da Licitante
    if (req.match === "ATENDIDO") {
      doc.setTextColor(16, 185, 129);
      doc.setFont("helvetica", "bold");
      doc.text("ATENDIDO", 148, y + 4.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Evidência cadastrada", 148, y + 8.5);
    } else if (req.match === "PRECISA_COMPLEMENTAR") {
      doc.setTextColor(217, 119, 6);
      doc.setFont("helvetica", "bold");
      doc.text("PRECISA COMPLEMENTAR", 148, y + 4.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Requer envio probatório", 148, y + 8.5);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text("AUSENTE / PENDENTE", 148, y + 4.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Ação recomendada", 148, y + 8.5);
    }

    y += 12;
  });

  // --- PLANO DE AÇÃO E RECOMENDAÇÕES ---
  y += 5;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("3. DIRETRIZES PARA A SESSÃO PÚBLICA DE HABILITAÇÃO", 14, y);

  y += 5;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const orientacoes = [
    "• Juntada Documental: Os certificados e o Código de Conduta devem ser anexados na íntegra aos autos de habilitação técnica.",
    "• Validação Pública: As certidões e comprovantes gerados pela plataforma contêm links e QR Codes verificáveis pelo Pregoeiro.",
    "• Subcontratação: Caso o edital preveja fornecimento por terceiros, execute o módulo DDI para atestar inexistência de sanção no CEIS/CNEP.",
  ];
  orientacoes.forEach((item) => {
    doc.text(item, 16, y);
    y += 4.5;
  });

  // --- TERMO DE RESPONSABILIDADE E RESSALVA JURÍDICA ---
  y += 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 16, 1, 1, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(71, 85, 105);
  const disclaimer =
    "Ressalva jurídica: A estimativa de aderência e correspondência gerada por este sistema constitui ferramenta de auxílio operacional e conformidade preventiva para a empresa licitante. Não substitui a leitura integral e atenta do edital e seus anexos, a consulta jurídica especializada ou o juízo discricionário e soberano do Pregoeiro, Agente de Contratação e Comissão de Licitação.";
  doc.text(doc.splitTextToSize(disclaimer, 176), 17, y + 4.5);

  // --- RODAPÉ COM QR CODE DE VALIDAÇÃO ---
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 255, 196, 255);

  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, "PNG", 14, 258, 28, 28);
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFICAÇÃO PÚBLICA DO RELATÓRIO DE EDITAL", 46, 264);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Identificador do Relatório: ${analysis.id}`, 46, 269);
  doc.text(`Aponte a câmera para o QR Code ao lado ou consulte a autenticidade oficial em:`, 46, 274);
  doc.setTextColor(37, 99, 235);
  doc.text(validationUrl, 46, 279);

  doc.save(`Aderencia_Edital_${analysis.id}_${new Date().getFullYear()}.pdf`);
}
