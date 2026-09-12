import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Company } from "@/types";

export async function generateWhistleblowerPosterPDF(
  company: Company,
  channelUrl: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Moldura e Fundo decorativo
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Faixa superior de destaque
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, 10, pageWidth - 20, 32, "F");

  // Título da faixa superior
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CANAL OFICIAL DE DENÚNCIAS & ÉTICA", pageWidth / 2, 24, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(
    "PROGRAMA DE INTEGRIDADE (LEI 14.133/2021) E PREVENÇÃO AO ASSÉDIO (NR-1 / LEI 14.457/2022)",
    pageWidth / 2,
    33,
    { align: "center" }
  );

  // 2. Nome da Empresa
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(company.trade_name.toUpperCase(), pageWidth / 2, 55, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Razão Social: ${company.legal_name}`, pageWidth / 2, 62, { align: "center" });

  // 3. Chamada Principal para os Colaboradores
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(20, 72, pageWidth - 40, 38, 4, 4, "FD");

  doc.setTextColor(30, 58, 138); // blue-900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("VIOLÊNCIA, ASSÉDIO OU FRAUDE? NÃO SE CALE.", pageWidth / 2, 82, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const infoText =
    "Este canal é sigiloso, seguro e independente. Você pode relatar fatos de forma 100% ANÔNIMA. A empresa assegura garantia irrestrita de não retaliação a qualquer relator de boa-fé.";
  doc.text(doc.splitTextToSize(infoText, pageWidth - 55), pageWidth / 2, 91, { align: "center" });

  // 4. Geração do QR Code
  const qrDataUrl = await QRCode.toDataURL(channelUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 300,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  const qrSize = 75;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 120;

  // Caixa de fundo para o QR Code
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 4, 4, "FD");
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Legenda do QR Code
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("APONTE A CÂMERA DO CELULAR PARA O QR CODE", pageWidth / 2, 210, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(channelUrl, pageWidth / 2, 218, { align: "center" });

  // 5. Categorias Acolhidas
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 226, pageWidth - 40, 40, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("O QUE VOCÊ PODE RELATAR NESTE CANAL:", 25, 234);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("• Assédio Moral ou Sexual (NR-1 / Lei nº 14.457/2022)", 25, 242);
  doc.text("• Corrupção, Vantagem Indevida ou Propina (Lei nº 14.133/2021)", 25, 249);
  doc.text("• Fraude em Contratos, Desvio de Materiais ou Conluio em Licitação", 25, 256);
  doc.text("• Condições Perigosas de Trabalho e Descumprimento de EPIs", pageWidth / 2 + 5, 242);
  doc.text("• Outras Violações Éticas ao Código de Conduta da Organização", pageWidth / 2 + 5, 249);

  // 6. Rodapé Legal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Cartaz informativo obrigatório para afixação em murais, áreas de convivência e canteiros de obras. Gerado pelo TechCompliance.",
    pageWidth / 2,
    280,
    { align: "center" }
  );

  doc.save(`Cartaz_Mural_Canal_Denuncias_${company.slug}.pdf`);
}
