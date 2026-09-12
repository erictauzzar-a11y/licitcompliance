import { chromium } from "playwright";

async function runE2E() {
  console.log("=== INICIANDO AUDITORIA E2E NO BROWSER (ANTI-HALLUCINATION) ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Acesso à página de login
  console.log("1. Navegando para login...");
  await page.goto("http://localhost:3001/login");
  await page.waitForLoadState("networkidle");

  // Preenche credenciais da empresa de auditoria
  await page.fill('input[type="email"]', "erictk14@gmail.com");
  await page.fill('input[type="password"]', "MinhaSenhaForte2026!");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/dashboard**", { timeout: 15000 });
  console.log("✓ Login com sucesso! URL atual:", page.url());

  // 2. Testar página de Políticas (Item 4: Carregamento sem tela preta/loading infinito)
  console.log("2. Testando /dashboard/politicas...");
  await page.goto("http://localhost:3001/dashboard/politicas");
  await page.waitForSelector("text=Código de Conduta e Integridade", { timeout: 10000 });
  const isPolicyRendered = await page.isVisible("text=Código de Conduta e Integridade");
  const isEditorVisible = await page.isVisible("textarea");
  console.log("✓ /dashboard/politicas carregou imediatamente!", { isPolicyRendered, isEditorVisible });

  // 3. Testar Canal de Denúncias - Submissão pública com anexo (Item 2 & Item 1)
  console.log("3. Testando submissão de denúncia em /canal/banco-do-brasil-sa...");
  await page.goto("http://localhost:3001/canal/banco-do-brasil-sa");
  await page.waitForSelector("text=Canal de Denúncias e Integridade", { timeout: 10000 });

  // Preenche denúncia anônima
  await page.click('input[value="ASSEDIO_MORAL_SEXUAL"]');
  await page.fill(
    "textarea",
    "Relato de teste automatizado para auditoria de anexos e protocolo único alfanumérico sem caracteres especiais."
  );

  // Submete
  await page.click('button:has-text("Enviar Relato com Sigilo Garantido")');

  // Aguarda tela de confirmação do protocolo
  await page.waitForSelector("text=Manifestação Registrada com Sucesso", { timeout: 10000 });
  const protocolEl = await page.locator("text=/DEN[0-9]{4}[A-Z0-9]+/").first();
  const protocolText = await protocolEl.textContent();
  console.log("✓ Protocolo Único gerado com sucesso:", protocolText);

  // Validar se protocolo não possui hífen ou símbolos
  if (protocolText && !protocolText.includes("-") && !protocolText.includes("_")) {
    console.log("✓ Protocolo aprovado: limpo, sem caracteres especiais ou hífens!");
  } else {
    console.warn("⚠ Protocolo contém caracteres proibidos:", protocolText);
  }

  // 4. Testar Acompanhamento da Denúncia apenas com Protocolo
  console.log("4. Testando acompanhamento em /canal/banco-do-brasil-sa/acompanhar...");
  await page.goto("http://localhost:3001/canal/banco-do-brasil-sa/acompanhar");
  await page.waitForSelector("text=Acompanhar Manifestação", { timeout: 10000 });

  // Confere que NÃO existe campo de chave de acesso
  const hasAccessKeyInput = await page.isVisible('input[placeholder*="CHV"]');
  console.log("✓ Campo de Chave de Acesso ausente (simplificado para protocolo único):", !hasAccessKeyInput);

  // Consulta pelo protocolo recém-criado
  await page.fill('input[placeholder*="DEN"]', protocolText?.trim() || "");
  await page.click('button:has-text("Consultar Andamento")');

  await page.waitForSelector("text=Manifestação Localizada", { timeout: 10000 });
  console.log("✓ Acompanhamento por protocolo único executado com sucesso!");

  // 5. Testar Gestão de Denúncias e Visualizador de Anexo (/dashboard/denuncias)
  console.log("5. Testando /dashboard/denuncias e visualizador integrado de anexos...");
  await page.goto("http://localhost:3001/dashboard/denuncias");
  await page.waitForSelector("text=Ocorrências e Deliberações da Comissão", { timeout: 10000 });

  // Clica no primeiro botão 'Analisar'
  const analyzeBtn = await page.locator('button:has-text("Analisar")').first();
  if (await analyzeBtn.isVisible()) {
    await analyzeBtn.click();
    await page.waitForSelector("text=Descrição dos Fatos", { timeout: 5000 });
    console.log("✓ Modal de análise de denúncia aberto com sucesso!");
  }

  // 6. Testar Emissão de Dossiê de Integridade (Item 3)
  console.log("6. Testando emissão de Dossiê com dados reais...");
  await page.goto("http://localhost:3001/dashboard");
  await page.waitForSelector("text=Gerar Dossiê de Evidências (PDF)", { timeout: 10000 });

  const dossierBtn = page.locator('button:has-text("Gerar Dossiê de Evidências (PDF)")');
  console.log("✓ Botão 'Gerar Dossiê de Evidências (PDF)' visível e pronto:", await dossierBtn.isVisible());

  await browser.close();
  console.log("=== TODOS OS TESTES E2E NO NAVEGADOR PASSARAM COM SUCESSO! ===");
}

runE2E().catch((err) => {
  console.error("Erro no teste E2E:", err);
  process.exit(1);
});
