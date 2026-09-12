# RELATÓRIO DE AUDITORIA DE SEGURANÇA DE CÓDIGO (SECURITY CODE REVIEW)
**Projeto:** LicitCompliance SaaS  
**Data:** 11 de Setembro de 2026  
**Auditor:** Antigravity Security Agent  
**Escopo:** Frontend, Backend/Server Actions, APIs REST, Banco de Dados (PostgreSQL / Supabase Schema & RLS), Uploads, Dependências e Configurações de Deploy.

---

## 1. RESUMO EXECUTIVO

Foi realizada uma revisão estática e dinâmica minuciosa de código (*White-box Security Code Review*) em todos os componentes da aplicação **LicitCompliance**.

A aplicação possui uma excelente proposta funcional e arquitetura moderna com Next.js 16 (App Router), TypeScript e integração com órgãos regulatórios (BrasilAPI, CGU, MTE). Contudo, **o sistema atualmente opera em um modelo híbrido com armazenamento local em memória (`mockStore`) e comandos de transição para o Supabase**, apresentando **falhas severas de controle de acesso, ausência total de autenticação em endpoints administrativos críticos e políticas de RLS no banco que permitem vazamento massivo de dados entre empresas (Tenants) e denúncias sigilosas**.

---

## 2. QUADRO RESUMO DE VULNERABILIDADES

| Severidade | Quantidade | Principais Categorias |
| :--- | :---: | :--- |
| 🔴 **CRÍTICA** | **8** | Broken Access Control, RLS Flawed, IDOR, Server Actions desprotegidas, Mock em memória compartilhado |
| 🟠 **ALTA** | **9** | SSRF/DoS, Upload inseguro, Ausência de Rate Limiting, Enumeração de CNPJ/Sócios, Bypass de Autenticação |
| 🟡 **MÉDIA** | **8** | XSS potencial em Markdown, CORS/Cache permissivo, Manipulação de IP em auditoria, Exposição de dados cadastrais |
| 🟢 **BAIXA** | **5** | CSP ausente, Header de segurança ausente, Geração de chaves fracas (Math.random) |

---

## 3. RELATÓRIO DETALHADO DE VULNERABILIDADES

---

### 🔴 VULNERABILIDADES CRÍTICAS

#### VULN-CRIT-01: Ausência Completa de Autenticação e Autorização nas Rotas do Dashboard e Ações de Gestão
- **Severidade:** CRÍTICA
- **Arquivo:** `src/app/dashboard/layout.tsx`, `src/app/dashboard/denuncias/page.tsx`, `src/app/dashboard/politicas/page.tsx`
- **Linha:** Linhas 1-177 (`dashboard/layout.tsx`), Linhas 67-76 (`dashboard/denuncias/page.tsx`)
- **Componente afetado:** Área Administrativa `/dashboard/*`
- **Vulnerabilidade:** *Broken Access Control / Missing Authentication & Authorization* (CWE-306, OWASP A01:2021)
- **Como poderia ser explorada:**
  Qualquer usuário anônimo na internet pode acessar diretamente a URL `/dashboard`, `/dashboard/denuncias`, `/dashboard/colaboradores` ou `/dashboard/politicas` sem fornecer qualquer credencial de login, sessão, cookie ou token Bearer. Não existe middleware do Next.js (`middleware.ts`), verificação de sessão de usuário ou validação de JWT.
- **Impacto:**
  Um invasor tem acesso imediato à lista completa de colaboradores (nomes, CPFs, cargos, telefones), a todas as denúncias sigilosas internas da empresa (incluindo relatos de assédio e corrupção), e pode alterar o status das investigações ou alterar o Código de Conduta corporativo.
- **Correção recomendada:**
  Implementar um `middleware.ts` na raiz do Next.js integrando com Supabase Auth (`@supabase/ssr` ou token JWT de sessão), bloqueando qualquer acesso às rotas `/dashboard/*` e redirecionando usuários não autenticados para `/login`.

---

#### VULN-CRIT-02: Quebra Crítica de RLS em Denúncias Sigilosas no Banco de Dados
- **Severidade:** CRÍTICA
- **Arquivo:** `supabase/schema.sql`
- **Linha:** Linhas 114-117
- **Componente afetado:** Tabela `whistleblower_reports` (RLS Policy)
- **Vulnerabilidade:** *Flawed Row-Level Security / Insecure Direct Object Reference* (CWE-284)
- **Código vulnerável:**
  ```sql
  -- Linhas 115-117 de schema.sql:
  CREATE POLICY "Denunciante consulta por protocolo e chave" ON whistleblower_reports FOR SELECT USING (
    auth.role() = 'anon' OR auth.role() = 'authenticated'
  );
  ```
- **Como poderia ser explorada:**
  A política RLS foi definida como `USING (auth.role() = 'anon' OR auth.role() = 'authenticated')`. Isso significa que **qualquer cliente com a chave pública anônima do Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) pode executar uma query `supabase.from('whistleblower_reports').select('*')` e descarregar TODAS as denúncias de TODAS as empresas cadastradas no banco de dados**, ignorando completamente o protocolo e a chave de acesso!
- **Impacto:**
  Vazamento em massa de denúncias corporativas confidenciais, nomes de denunciantes não anônimos, relatos de crimes e provas anexadas, violando a Lei nº 14.457/2022 e a LGPD.
- **Correção recomendada:**
  Remover a política permissiva e substituí-la por uma política restrita ou por uma RPC segura (`SECURITY DEFINER`):
  ```sql
  DROP POLICY IF EXISTS "Denunciante consulta por protocolo e chave" ON whistleblower_reports;
  -- Criar função RPC segura para validação atômica de protocolo + chave com hash
  ```

---

#### VULN-CRIT-03: Server Action de Atualização de Denúncias Permite Manipulação sem Autenticação
- **Severidade:** CRÍTICA
- **Arquivo:** `src/app/actions/whistleblower.ts`
- **Linha:** Linhas 169-193
- **Componente afetado:** Função `updateReportResolutionAction`
- **Vulnerabilidade:** *Missing Authorization in Server Action / BOLA (Broken Object Level Authorization)* (CWE-285)
- **Código vulnerável:**
  ```typescript
  export async function updateReportResolutionAction(
    reportId: string,
    status: ReportStatus,
    resolutionNotes: string
  ) { ... }
  ```
- **Como poderia ser explorada:**
  Next.js Server Actions são endpoints HTTP públicos expostos via POST. Qualquer atacante pode disparar uma requisição POST direta contra o endpoint da action passando qualquer `reportId` arbitrário e alterar o status da denúncia para `ARQUIVADA` ou `IMPROCEDENTE`, inserindo notas de resolução arbitrárias, sem estar logado e sem provar que é o gestor responsável pela empresa daquela denúncia.
- **Impacto:**
  Adulteração indevida de apurações de denúncias de crimes e assédio por agentes maliciosos ou pelos próprios investigados.
- **Correção recomendada:**
  Verificar no início da Server Action a identidade do usuário logado via `supabase.auth.getUser()` e conferir se o `company_id` da denúncia pertence à empresa administrada por esse usuário.

---

#### VULN-CRIT-04: Isolamento Multi-Tenant Inexistente no Estado em Memória (`mockStore`)
- **Severidade:** CRÍTICA
- **Arquivo:** `src/lib/mock-data.ts`, `src/app/actions/whistleblower.ts`, `src/app/api/due-diligence/route.ts`
- **Linha:** Linhas 13-100 (`mock-data.ts`), Linhas 27-32 (`api/due-diligence/route.ts`)
- **Componente afetado:** `ComplianceMockStore` (Singleton Global de Dados)
- **Vulnerabilidade:** *Multi-Tenant Data Bleeding / Cross-Tenant Pollution* (CWE-668)
- **Como poderia ser explorada:**
  O `mockStore` é uma instância singleton exportada no escopo global do processo Node.js. Em ambiente Server-Side (como na Vercel Serverless Function ou container Docker), essa instância é compartilhada entre requisições. Quando a rota `POST /api/due-diligence` é chamada:
  ```typescript
  result.company_id = mockStore.getCompany().id;
  ```
  Ou na tela de onboarding (`/cadastro`), quando um usuário salva uma nova empresa com `mockStore.updateCompany(...)`, ele **sobrescreve os dados da empresa de todos os outros usuários do sistema**.
- **Impacto:**
  Um cliente vê e sobrescreve as informações, colaboradores e códigos de conduta de outro cliente da plataforma.
- **Correção recomendada:**
  Migrar impreterivelmente todas as operações de leitura e escrita para o banco de dados PostgreSQL (Supabase) vinculado estritamente ao `tenant_id` / `company_id` do usuário autenticado.

---

#### VULN-CRIT-05: IDOR / Obtenção Não Autorizada de Dados Pessoais via Token Previsível
- **Severidade:** CRÍTICA
- **Arquivo:** `src/lib/mock-data.ts`, `src/app/c/[accessToken]/page.tsx`
- **Linha:** Linhas 480-485 (`mock-data.ts`), Linhas 46-57 (`src/app/c/[accessToken]/page.tsx`)
- **Componente afetado:** Rota `/c/[accessToken]`
- **Vulnerabilidade:** *IDOR / Insecure Access Token Generation* (CWE-330, CWE-284)
- **Código vulnerável:**
  ```typescript
  // mock-data.ts linha 434:
  access_token: "tok-" + Math.random().toString(36).substring(2, 9),
  ```
- **Como poderia ser explorada:**
  O token que permite ao colaborador acessar seu painel individual de treinamento e emitir certificados é gerado utilizando `Math.random().toString(36).substring(2, 9)`. `Math.random()` não é criptograficamente seguro e gera tokens de apenas 7 caracteres alfanuméricos minúsculos. Um invasor pode facilmente criar um script de brute-force para enumerar tokens (`tok-xxxxxxx`) e acessar o nome completo, CPF, cargo, telefone e histórico de treinamentos de todos os empregados da empresa.
- **Impacto:**
  Vazamento em massa de dados protegidos pela LGPD (CPF, dados funcionais) e falsificação de aceites de treinamento por terceiros.
- **Correção recomendada:**
  Utilizar gerador criptográfico com alta entropia (`crypto.randomBytes(32).toString('hex')` ou `crypto.randomUUID()`) e vincular a expiração e revogação no banco de dados.

---

#### VULN-CRIT-06: Consulta Pública de Denúncia Permite Acesso sem Validar Empresa
- **Severidade:** CRÍTICA
- **Arquivo:** `src/app/actions/whistleblower.ts`
- **Linha:** Linhas 116-125
- **Componente afetado:** `trackWhistleblowerReportAction`
- **Vulnerabilidade:** *Cross-Tenant Access / Inadequate Query Filtering* (CWE-284)
- **Código vulnerável:**
  ```typescript
  const { data: dbReport, error } = await supabase
    .from("whistleblower_reports")
    .select("*")
    .eq("protocol", cleanProtocol)
    .eq("access_key", cleanKey)
    .maybeSingle();
  ```
- **Como poderia ser explorada:**
  A rota recebe o parâmetro `slug` da empresa na URL (`/canal/:slug/acompanhar`), porém a query efetuada no Supabase **não filtra pelo `company_id`**. Se um usuário possuir as credenciais de uma denúncia da Empresa A, ele pode consultar essa denúncia através do portal da Empresa B.
- **Impacto:**
  Falha no isolamento de contexto entre empresas clientes e inconsistência probatória.
- **Correção recomendada:**
  Adicionar a validação estrita `.eq("company_id", company.id)` na query SQL.

---

#### VULN-CRIT-07: Inclusão e Alteração Arbitrária de Colaboradores e Políticas sem Autorização
- **Severidade:** CRÍTICA
- **Arquivo:** `src/app/dashboard/colaboradores/page.tsx`, `src/app/dashboard/politicas/page.tsx`
- **Linha:** Linhas 43-62 (`colaboradores/page.tsx`), Linhas 44-50 (`politicas/page.tsx`)
- **Componente afetado:** Ações de inserção de funcionários e edição de políticas
- **Vulnerabilidade:** *Unauthenticated Mutation / Client-Side Trust* (CWE-862)
- **Como poderia ser explorada:**
  A manipulação de colaboradores (inclusão individual e lote em massa) e a alteração do texto do Código de Conduta e sua aprovação formal são disparadas diretamente pelo client-side sem passar por autenticação no backend. Um atacante que acesse essas telas pode injetar colaboradores fantasmas na empresa ou alterar o Código de Conduta para remover vedações legais a atos de corrupção.
- **Impacto:**
  Adulteração do Programa de Integridade utilizado para comprovação legal em certames públicos regidos pela Lei 14.133/2021.
- **Correção recomendada:**
  Transferir todas as mutações para Server Actions autenticadas com conferência de sessão de usuário gestor.

---

#### VULN-CRIT-08: RLS de Consulta das Tabelas `companies` e `policies` Expõe Metadados Internos
- **Severidade:** CRÍTICA
- **Arquivo:** `supabase/schema.sql`
- **Linha:** Linhas 94-95
- **Componente afetado:** Tabelas `companies` e `policies`
- **Vulnerabilidade:** *Excessive Data Exposure via Public SELECT Policy* (CWE-200)
- **Código vulnerável:**
  ```sql
  CREATE POLICY "Empresas visíveis publicamente por slug" ON companies FOR SELECT USING (true);
  CREATE POLICY "Políticas visíveis publicamente" ON policies FOR SELECT USING (true);
  ```
- **Como poderia ser explorada:**
  A tabela `companies` contém campos confidenciais como `user_id`, telefone e e-mail pessoal do oficial de integridade e dados fiscais. Ao definir `USING (true)`, qualquer requisição REST aberta ao Supabase pode fazer `SELECT user_id, integrity_officer_phone, integrity_officer_email FROM companies;`, listando os IDs de usuários de autenticação e contatos privados de todos os clientes.
- **Impacto:**
  Vazamento de dados cadastrais, e-mails de gestores e identificadores de usuários para alvos de ataques de phishing e engenharia social.
- **Correção recomendada:**
  Restringir a política para expor apenas colunas públicas essenciais (`id`, `trade_name`, `slug`, `logo_url`) ou utilizar uma View pública com RLS específica.

---

### 🟠 VULNERABILIDADES ALTAS

#### VULN-HIGH-01: Upload de Arquivos Sem Validação de Extensão, Tipo MIME e Tamanho
- **Severidade:** ALTA
- **Arquivo:** `src/app/canal/[slug]/page.tsx`
- **Linha:** Linhas 76-96
- **Componente afetado:** Upload de Evidências no Canal de Denúncias
- **Vulnerabilidade:** *Unrestricted File Upload* (CWE-434, OWASP A04:2021)
- **Código vulnerável:**
  ```typescript
  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${resolvedParams.slug}/${cleanFileName}`;

  const { data: uploadRes, error: uploadErr } = await supabase.storage
    .from("whistleblower-evidence")
    .upload(filePath, file);
  ```
- **Como poderia ser explorada:**
  Não há validação no frontend nem no backend quanto ao tipo de arquivo (`.exe`, `.html`, `.svg`, `.js`, `.sh`, `.php`), tamanho máximo (permitindo anexos de gigabytes que esgotam a cota de armazenamento) ou análise antivírus. Um atacante pode fazer upload de um arquivo `.html` ou `.svg` contendo scripts maliciosos de roubo de sessão ou arquivos binários que podem comprometer os computadores da comissão de compliance ao baixarem as evidências.
- **Impacto:**
  Stored XSS, infecção de estações de trabalho de auditores de integridade e Denial of Service (DoS) por sobrecarga de storage.
- **Correção recomendada:**
  - Validar estritamente extensões permitidas (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.mp3`, `.mp4`).
  - Validar MIME-type no backend inspecionando os bytes mágicos do arquivo.
  - Limitar o tamanho máximo do arquivo para 10 MB por anexo.

---

#### VULN-HIGH-02: Ausência Total de Rate Limiting nos Endpoints Públicos de Consulta
- **Severidade:** ALTA
- **Arquivo:** `src/app/api/cnpj/[cnpj]/route.ts`, `src/app/api/due-diligence/route.ts`, `src/app/actions/whistleblower.ts`
- **Linha:** Linhas 4-24 (`api/cnpj`), Linhas 5-41 (`api/due-diligence`)
- **Componente afetado:** Rotas de API e Server Actions
- **Vulnerabilidade:** *Lack of Rate Limiting / Resource Exhaustion* (CWE-770, OWASP A04:2021)
- **Como poderia ser explorada:**
  Qualquer script automatizado pode efetuar dezenas de milhares de chamadas consecutivas por minuto contra `/api/cnpj/[cnpj]` ou `/api/due-diligence`. Como essas rotas realizam chamadas externas para BrasilAPI e Portal da Transparência da CGU, um atacante pode provocar o bloqueio da chave da CGU por excesso de requisições ou causar DoS na infraestrutura da Vercel.
- **Impacto:**
  Esgotamento de limites de API de órgãos governamentais, negação de serviço para clientes legítimos e aumento drástico de custos computacionais.
- **Correção recomendada:**
  Implementar middleware com Rate Limiting baseado em IP (utilizando Upstash Redis ou biblioteca `@upstash/ratelimit`), limitando consultas a no máximo 10 requisições por minuto por IP em rotas públicas.

---

#### VULN-HIGH-03: Risco de Server-Side Request Forgery (SSRF) e DoS em Chamadas Externas
- **Severidade:** ALTA
- **Arquivo:** `src/lib/due-diligence-service.ts`
- **Linha:** Linhas 99-112
- **Componente afetado:** Módulo de Due Diligence / Consulta PEP
- **Código vulnerável:**
  ```typescript
  for (const socio of qsaList) {
    const pepRes = await fetch(
      `https://api.portaldatransparencia.gov.br/api-de-dados/pep?nome=${encodeURIComponent(socio.nome)}&pagina=1`,
      { headers: { "chave-api-dados": cguApiKey } }
    ); ...
  }
  ```
- **Como poderia ser explorada:**
  Se um CNPJ possuir um Quadro Societário com centenas de cooperados ou cotistas, a aplicação executa requisições sequenciais síncronas para a CGU dentro do ciclo de vida da requisição HTTP da API do Next.js sem nenhum timeout configurado. Isso ultrapassa o limite de execução da Vercel (15 segundos no plano gratuito), travando a rota.
- **Impacto:**
  Timeout de funções serverless, DoS em cascata e degradação severa da plataforma.
- **Correção recomendada:**
  Adicionar `AbortSignal.timeout(5000)` em cada fetch, limitar a busca de PEP aos sócios administradores principais (máximo 5) e executar as consultas em paralelo via `Promise.allSettled`.

---

#### VULN-HIGH-04: Confiança Cega em IP Informado pelo Cliente para Auditoria Jurídica
- **Severidade:** ALTA
- **Arquivo:** `src/app/treinar/[slug]/page.tsx`, `src/app/c/[accessToken]/page.tsx`
- **Linha:** Linhas 59-64 (`treinar/page.tsx`), Linha 61 (`c/[accessToken]/page.tsx`)
- **Componente afetado:** Aceite de Termos de Integridade e Emissão de Certificados
- **Vulnerabilidade:** *Client-Supplied IP Address Spoofing* (CWE-345)
- **Código vulnerável:**
  ```typescript
  // treinar/[slug]/page.tsx:
  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => setClientIp(data.ip || "189.40.112.5"))
  // e depois enviado para:
  mockStore.acceptPolicy(newEmployee.id, clientIp);
  ```
- **Como poderia ser explorada:**
  O IP do colaborador (que é usado no Dossiê e Certificado para comprovar a veracidade da capacitação perante o TCU e fiscais de contratos públicos) é coletado no frontend do navegador e pode ser alterado através do DevTools ou de um proxy local para qualquer endereço IP arbitrário (ex: IP do órgão público ou IP falso).
- **Impacto:**
  Invalidação probatória do Dossiê de Integridade perante órgãos fiscalizadores em caso de perícia judicial.
- **Correção recomendada:**
  O IP e o User-Agent devem ser capturados exclusivamente no servidor através dos headers `x-forwarded-for` ou `request.ip` em uma Server Action ou Route Handler.

---

#### VULN-HIGH-05: Brute Force de Protocolos e Chaves do Canal de Denúncias
- **Severidade:** ALTA
- **Arquivo:** `src/app/actions/whistleblower.ts`, `src/app/canal/[slug]/acompanhar/page.tsx`
- **Linha:** Linhas 106-167 (`actions/whistleblower.ts`)
- **Componente afetado:** Rota de Acompanhamento de Denúncias
- **Vulnerabilidade:** *Unrestricted Credential Guessing / Lack of Account Lockout* (CWE-307)
- **Como poderia ser explorada:**
  O endpoint `trackWhistleblowerReportAction` não possui bloqueio por tentativas incorretas nem captcha. Um atacante pode testar combinações de protocolos (`DEN-2026-XXXXXX`) e chaves automatizadamente até encontrar manifestações válidas.
- **Impacto:**
  Quebra do anonimato e acesso ilegítimo a denúncias internas.
- **Correção recomendada:**
  Adicionar proteção contra força bruta (bloqueio temporário por IP após 5 tentativas inválidas consecutivas) e integração com Turnstile/reCAPTCHA.

---

#### VULN-HIGH-06: Enumeração e Coleta em Massa de Dados Cadastrais via Endpoint de CNPJ
- **Severidade:** ALTA
- **Arquivo:** `src/app/api/cnpj/[cnpj]/route.ts`
- **Linha:** Linhas 4-24
- **Componente afetado:** Rota `/api/cnpj/[cnpj]`
- **Vulnerabilidade:** *Data Scraping & Proxy Abuse* (CWE-200)
- **Como poderia ser explorada:**
  O endpoint atua como um proxy aberto para a BrasilAPI com cabeçalho de navegador fixado. Qualquer pessoa na internet pode usar essa API pública do LicitCompliance para fazer scraping automatizado de empresas brasileiras sem restrições.
- **Impacto:**
  Uso indevido da infraestrutura e risco de banimento de IP da Vercel pela BrasilAPI.
- **Correção recomendada:**
  Exigir autenticação ou token CSRF/sessão para utilizar o endpoint de enriquecimento cadastral.

---

#### VULN-HIGH-07: Possibilidade de Injeção de Dados e Parâmetros Não Sanitizados no Onboarding
- **Severidade:** ALTA
- **Arquivo:** `src/app/cadastro/page.tsx`
- **Linha:** Linhas 160-192
- **Componente afetado:** Formulário de Cadastro da Empresa
- **Vulnerabilidade:** *Mass Assignment / Missing Server-Side Validation* (CWE-915, CWE-20)
- **Como poderia ser explorada:**
  O formulário envia o objeto `formData` diretamente para a função `updateCompany` sem passar por validação de esquema de dados (ex: biblioteca Zod) no backend. Parâmetros como `company_id`, `status` ou arrays de sócios podem ser injetados com conteúdos arbitrários.
- **Impacto:**
  Corrupção da base de dados e inserção de estados cadastrais inconsistentes.
- **Correção recomendada:**
  Criar um esquema estrito com Zod no backend e validar todo o payload antes da persistência.

---

#### VULN-HIGH-08: Falha na Proteção de Arquivos de Evidência no Supabase Storage
- **Severidade:** ALTA
- **Arquivo:** `supabase/schema.sql`, `src/app/canal/[slug]/page.tsx`
- **Linha:** Linha 120 (`schema.sql`), Linhas 86-88 (`canal/[slug]/page.tsx`)
- **Componente afetado:** Bucket de Storage `whistleblower-evidence`
- **Vulnerabilidade:** *Insecure Storage Access Control* (CWE-732)
- **Como poderia ser explorada:**
  O bucket `whistleblower-evidence` está comentado no script SQL. Caso seja criado como `public: true`, qualquer pessoa que descubra a URL direta do anexo (ou através de links compartilhados) terá acesso público a fotos, áudios e documentos confidenciais de denúncias sem autenticação.
- **Impacto:**
  Vazamento grave de provas materiais de denúncias e quebra de sigilo legal.
- **Correção recomendada:**
  O bucket DEVE ser estritamente privado (`public: false`) e os downloads só devem ser permitidos através de URLs assinadas temporárias (`createSignedUrl`) geradas exclusivamente após validação do gestor autenticado.

---

#### VULN-HIGH-09: Bypass do Fluxo de Treinamento e Conclusão Arbitrária de Capacitação
- **Severidade:** ALTA
- **Arquivo:** `src/app/treinar/[slug]/page.tsx`, `src/app/c/[accessToken]/page.tsx`
- **Linha:** Linhas 80-95 (`c/[accessToken]/page.tsx`)
- **Componente afetado:** Motor de Quiz e Certificação
- **Vulnerabilidade:** *Client-Side Trust in Business Logic* (CWE-602)
- **Como poderia ser explorada:**
  A nota do teste de treinamento (`100%`) e a aprovação do funcionário são calculadas no JavaScript do navegador e enviadas diretamente para o método `completeTraining(employeeId, trainingId, 100)`. Um usuário pode abrir o console do DevTools e executar a chamada diretamente sem ler nenhum conteúdo e sem responder a nenhuma pergunta.
- **Impacto:**
  Emissão fraudulenta de certificados oficiais de capacitação utilizados para atendimento de cláusulas de habilitação em licitações públicas (Art. 25 da Lei 14.133/2021).
- **Correção recomendada:**
  O envio das respostas do quiz deve ser processado no backend, onde o servidor compara as respostas com o gabarito oficial e calcula a nota real antes de gerar o certificado.

---

### 🟡 VULNERABILIDADES MÉDIAS

#### VULN-MED-01: Risco Potencial de Cross-Site Scripting (XSS) no Renderizador de Código de Conduta
- **Severidade:** MÉDIA
- **Arquivo:** `src/app/dashboard/politicas/page.tsx`
- **Linha:** Linhas 150-220
- **Componente afetado:** Visualizador de Markdown do Código de Conduta
- **Vulnerabilidade:** *Potential Cross-Site Scripting (XSS)* (CWE-79)
- **Como poderia ser explorada:**
  O conteúdo do Código de Conduta é editável em texto livre (Markdown). Caso um gestor ou invasor insira tags HTML como `<img src=x onerror=alert(document.cookie)>` ou tags `<script>`, dependendo de como o markdown é renderizado para os colaboradores ou no portal público, pode ocorrer execução arbitrária de scripts no navegador do visitante.
- **Impacto:**
  Execução de scripts no contexto do navegador do usuário, roubo de tokens de sessão.
- **Correção recomendada:**
  Utilizar biblioteca de sanitização HTML rigorosa como `DOMPurify` ou `sanitize-html` antes de renderizar qualquer conteúdo de markdown.

---

#### VULN-MED-02: Configuração de Next.js Images com Hostname Universal Permite SSRF Indireto
- **Severidade:** MÉDIA
- **Arquivo:** `next.config.ts`
- **Linha:** Linhas 4-10
- **Código vulnerável:**
  ```typescript
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  }
  ```
- **Vulnerabilidade:** *Overly Permissive Image Optimization Pattern* (CWE-918)
- **Como poderia ser explorada:**
  Configurar `hostname: "**"` faz com que o serviço otimizador de imagens do Next.js aceite qualquer domínio na web para redimensionamento e cache. Um invasor pode usar o endpoint `/_next/image?url=https://alvo-interno...` para usar o servidor da aplicação como proxy para varredura ou ataque de negação de serviço contra servidores de terceiros.
- **Impacto:**
  Uso não autorizado do otimizador de imagens como proxy e risco de SSRF.
- **Correção recomendada:**
  Restringir `remotePatterns` apenas aos domínios estritamente necessários (ex: `images.unsplash.com` e o domínio do storage do Supabase).

---

#### VULN-MED-03: Geração de Hashes e Chaves Usando Math.random() ao Invés de CSPRNG
- **Severidade:** MÉDIA
- **Arquivo:** `src/lib/utils.ts`
- **Linha:** Linhas 44-67
- **Componente afetado:** Funções `generateHash`, `generateProtocol`, `generateAccessKey`
- **Vulnerabilidade:** *Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)* (CWE-338)
- **Código vulnerável:**
  ```typescript
  // Math.random() usado em segredos:
  export function generateAccessKey(): string {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#@$%*";
    let key = "";
    for (let i = 0; i < 7; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }
  ```
- **Como poderia ser explorada:**
  A chave de acesso à denúncia possui apenas 7 caracteres e é gerada via `Math.random()`, cujos estados internos podem ser previstos se o atacante coletar algumas amostras consecutivas geradas pelo mesmo processo Node.js.
- **Impacto:**
  Previsibilidade de chaves de acesso a denúncias sigilosas.
- **Correção recomendada:**
  Substituir por `crypto.randomInt` da API padrão do Node.js:
  ```typescript
  import { randomInt } from "crypto";
  // Usar randomInt(0, chars.length)
  ```

---

#### VULN-MED-04: Exposição Completa do QSA e CPFs de Sócios na API de Due Diligence
- **Severidade:** MÉDIA
- **Arquivo:** `src/app/api/due-diligence/route.ts`, `src/lib/due-diligence-service.ts`
- **Linha:** Linhas 51-58 (`due-diligence-service.ts`)
- **Componente afetado:** Resposta JSON de Due Diligence
- **Vulnerabilidade:** *Excessive Data Exposure in API Response* (CWE-213)
- **Como poderia ser explorada:**
  A resposta da API de Due Diligence devolve objetos com detalhes completos dos sócios retornados pela BrasilAPI e CGU. Embora alguns dados sejam públicos na Receita, CPFs desmascarados ou dados pessoais não essenciais de terceiros trafegam abertamente sem autenticação.
- **Impacto:**
  Possível inconformidade com boas práticas da LGPD referente à minimização de dados.
- **Correção recomendada:**
  Aplicar máscara em todos os CPFs de sócios (`***.123.456-**`) antes de retornar a resposta da API.

---

#### VULN-MED-05: Cache de Resposta de APIs de Terceiros sem Invalidação por Tenant
- **Severidade:** MÉDIA
- **Arquivo:** `src/lib/cnpj-service.ts`, `src/lib/due-diligence-service.ts`
- **Linha:** Linha 59 (`cnpj-service.ts`), Linha 42 (`due-diligence-service.ts`)
- **Código:**
  ```typescript
  next: { revalidate: 3600 }
  ```
- **Vulnerabilidade:** *Shared Cache Poisoning / Stale Sensitive Data* (CWE-349)
- **Como poderia ser explorada:**
  O Next.js faz cache no servidor durante 1 hora com `revalidate: 3600`. Se uma empresa for cancelada, falir ou sofrer sanção no CEIS/CNEP imediatamente após a consulta, a aplicação continuará exibindo que a empresa está regular durante o período de cache.
- **Impacto:**
  Geração de Dossiê ou relatório de Due Diligence falso positivo atestando conformidade para empresa sancionada.
- **Correção recomendada:**
  Adicionar mecanismo de *force-refresh* para auditorias definitivas e evitar cache longo em consultas de sanções judiciais.

---

#### VULN-MED-06: Ausência de Validação de Domínio no Gerador de PDFs e Links de Validação
- **Severidade:** MÉDIA
- **Arquivo:** `src/lib/pdf-generator.ts`, `src/lib/due-diligence-service.ts`
- **Linha:** Linhas 19-20 (`pdf-generator.ts`), Linhas 205-206 (`due-diligence-service.ts`)
- **Componente afetado:** Geração de Dossiê e Certificados em PDF
- **Código vulnerável:**
  ```typescript
  const siteUrl = originUrl || (typeof window !== "undefined" ? window.location.origin : "https://licitcompliance.com.br");
  const validationUrl = `${siteUrl}/validar/${validationCode}`;
  ```
- **Como poderia ser explorada:**
  Se o parâmetro `originUrl` for alimentado a partir de um cabeçalho HTTP manipulável pelo cliente (como `Host` ou `X-Forwarded-Host`), o QR Code gerado no documento PDF oficial pode apontar para um site malicioso de phishing clonando a página de validação.
- **Impacto:**
  Falsificação de evidências probatórias e phishing contra pregoeiros públicos.
- **Correção recomendada:**
  Fixar a URL base em variável de ambiente do servidor (`process.env.NEXT_PUBLIC_APP_URL`) e nunca confiar na origem do cliente.

---

#### VULN-MED-07: Inclusão em Lote de Funcionários com Delimitador Frágil (CSV Injection)
- **Severidade:** MÉDIA
- **Arquivo:** `src/app/dashboard/colaboradores/page.tsx`
- **Linha:** Linhas 64-81
- **Componente afetado:** Importação em lote de colaboradores
- **Vulnerabilidade:** *Improper Input Handling / Formula Injection* (CWE-1236)
- **Como poderia ser explorada:**
  A importação aceita texto separado por ponto e vírgula sem validar caracteres especiais ou sanitizar entradas. Se os dados forem exportados futuramente para relatórios em Excel/CSV, fórmulas maliciosas iniciadas com `=`, `+`, `-` ou `@` podem ser executadas.
- **Impacto:**
  Execução de comandos em planilhas ao exportar relatórios de colaboradores.
- **Correção recomendada:**
  Sanitizar campos de texto removendo caracteres iniciadores de fórmulas de planilhas.

---

#### VULN-MED-08: Rota `/validar/[codigo]` Retorna Sucesso Falso para Dossiês Inexistentes
- **Severidade:** MÉDIA
- **Arquivo:** `src/app/validar/[codigo]/page.tsx`
- **Linha:** Linhas 13-18
- **Código vulnerável:**
  ```typescript
  const isDossier = code.toUpperCase().startsWith("DOSSIE");
  const isValid = isDossier || !!certResult;
  ```
- **Como poderia ser explorada:**
  Qualquer código digitado que comece com a palavra "DOSSIE" (ex: `/validar/DOSSIE-FAKE-12345`) é considerado automaticamente **VÁLIDO E AUTÊNTICO**, exibindo o selo verde de validação oficial!
- **Impacto:**
  Qualquer terceiro pode criar um código falso de dossiê que a página do sistema confirmará falsamente como autêntico perante agentes de contratação e auditores.
- **Correção recomendada:**
  Validar a existência real do registro de dossiê e seu hash no banco de dados antes de exibir o selo de autenticidade.

---

### 🟢 VULNERABILIDADES BAIXAS

#### VULN-LOW-01: Cabeçalhos HTTP de Segurança Ausentes no Next.js
- **Severidade:** BAIXA
- **Arquivo:** `next.config.ts`
- **Linha:** Linhas 3-12
- **Vulnerabilidade:** *Missing Security Headers* (CWE-693)
- **Impacto:** Ausência de `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy`.
- **Correção recomendada:** Configurar os cabeçalhos de segurança no `next.config.ts`.

#### VULN-LOW-02: Exposição de Informações de Erros Internos nas Respostas da API
- **Severidade:** BAIXA
- **Arquivo:** `src/app/api/cnpj/[cnpj]/route.ts`, `src/app/actions/whistleblower.ts`
- **Linha:** Linhas 14-23 (`api/cnpj`), Linhas 101, 164 (`whistleblower.ts`)
- **Vulnerabilidade:** *Information Exposure Through Error Messages* (CWE-209)
- **Impacto:** Mensagens de erro de exceções e banco de dados são devolvidas nas respostas HTTP, expondo detalhes da arquitetura.
- **Correção recomendada:** Devolver mensagens genéricas e sanitizadas para o cliente.

#### VULN-LOW-03: Falta de Limpeza Automática de Logs em Console
- **Severidade:** BAIXA
- **Arquivo:** `src/lib/cnpj-service.ts`, `src/lib/due-diligence-service.ts`
- **Linha:** Várias linhas com `console.error` e `console.warn`
- **Vulnerabilidade:** *Sensitive Information in Operational Logs* (CWE-532)
- **Impacto:** Mensagens de erro com parâmetros de busca e status de APIs gravadas nos logs da Vercel sem mascaramento.
- **Correção recomendada:** Utilizar um logger estruturado com redaction de dados pessoais.

#### VULN-LOW-04: Exposição do Repositório GitHub como Público
- **Severidade:** BAIXA / OPERACIONAL
- **Componente:** GitHub Repository (`erictauzzar-a11y/licitcompliance`)
- **Vulnerabilidade:** Repositório de código da empresa atualmente visível publicamente na internet.
- **Correção recomendada:** Alterar a visibilidade do repositório para **Private** no GitHub (`gh repo edit --visibility private`).

#### VULN-LOW-05: Dependência de Scripts Externos Sem Subresource Integrity (SRI)
- **Severidade:** BAIXA
- **Componente:** Bibliotecas importadas no bundle
- **Correção recomendada:** Fixar versões no `package.json` sem `^` livre em dependências de segurança.

---

## 4. PLANO DE AÇÃO IMEDIATO: O QUE CORRIGIR ANTES DE IR PARA PRODUÇÃO

Para que a plataforma possa ser disponibilizada comercialmente com segurança para empresas e órgãos públicos, as seguintes medidas são **IMPRESCINDÍVEIS**:

1. **[URGENTE] Implementar Autenticação e Proteção de Rotas com Middleware:**
   - Proibir qualquer acesso anônimo a `/dashboard/*`.
   - Implementar login obrigatório via Supabase Auth ou cookies de sessão HTTP-Only protegidos.

2. **[URGENTE] Corrigir Imediatamente o RLS no Supabase (`schema.sql`):**
   - Eliminar a política que permite `auth.role() = 'anon'` ler denúncias na tabela `whistleblower_reports`.
   - Restringir o acesso a `companies` e `policies` para não vazar dados de usuários e telefones.

3. **[URGENTE] Proteger as Server Actions:**
   - Validar a sessão do usuário e a titularidade (`company_id`) em `updateReportResolutionAction`.
   - Migrar as operações de adição de colaboradores e edição de políticas para Server Actions autenticadas.

4. **[URGENTE] Sanear o Bucket de Armazenamento:**
   - Garantir que o bucket `whistleblower-evidence` seja privado, bloqueando acesso direto por link público.
   - Validar extensão, tamanho e MIME-type de arquivos no canal de denúncias.

5. **[ALTA PRIORIDADE] Implementar Rate Limiting:**
   - Proteger as rotas de consulta de CNPJ, Due Diligence e acompanhamento de denúncia contra força bruta e DoS.

6. **[ALTA PRIORIDADE] Corrigir Validação de Dossiê:**
   - Exigir checagem real do código/hash do Dossiê no banco de dados na rota `/validar/[codigo]`.
