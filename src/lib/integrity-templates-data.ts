// ============================================================================
// TECHCOMPLIANCE - CATÁLOGO GLOBAL DE MODELOS DA BIBLIOTECA DE INTEGRIDADE
// Contém os 20 modelos completos e estruturados, com fundamentação técnica e
// jurídica de acordo com a Lei 14.133/2021, Lei 12.846/2013, Dec. 11.129/2022 e NR-1.
// ============================================================================

import { IntegrityTemplate } from "@/types";

export const INTEGRITY_CATEGORIES_CONFIG = [
  { id: "ESSENCIAIS", label: "Essenciais", description: "Documentos basilares do Programa de Integridade" },
  { id: "ETICA_CONDUTA", label: "Ética e Conduta", description: "Padrões de relacionamento, assédio e cortesias" },
  { id: "ANTICORRUPCAO", label: "Anticorrupção", description: "Conformidade com a Lei da Empresa Limpa" },
  { id: "CONFLITOS_INTERESSE", label: "Conflitos de Interesse", description: "Mapeamento e gestão de impedimentos" },
  { id: "TERCEIROS", label: "Terceiros e Suprimentos", description: "Due Diligence e conduta de fornecedores" },
  { id: "PODER_PUBLICO", label: "Poder Público e Licitações", description: "Integridade concorrencial e contratações públicas" },
  { id: "PESSOAS_AMBIENTE", label: "Pessoas e Ambiente de Trabalho", description: "Canal de denúncias, não retaliação e adesão" },
  { id: "GOVERNANCA_RISCOS", label: "Governança e Riscos", description: "Comitês, apurações e matrizes de risco" },
  { id: "DADOS_SEGURANCA", label: "Dados e Segurança", description: "Privacidade, LGPD e ativos corporativos" }
] as const;

export const INTEGRITY_TEMPLATES: IntegrityTemplate[] = [
  {
    "id": "mod-01-codigo-etica",
    "category": "ESSENCIAIS",
    "order": 1,
    "title": "Código de Ética e Conduta",
    "subtitle": "Pilar fundamental do Programa de Integridade e diretrizes de conduta corporativa",
    "description": "Documento basilar da governança corporativa que estabelece os valores, os princípios inegociáveis, as condutas esperadas e os padrões éticos exigidos de todos os colaboradores, sócios, diretores e prepostos da organização.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 25, § 4º da Lei nº 14.133/2021; Art. 57, inciso II do Decreto nº 11.129/2022; Art. 7º, inciso VIII da Lei nº 12.846/2013.",
    "recommended_for": "Obrigatório para todas as empresas contratantes com o poder público e essencial para qualquer porte empresarial.",
    "governance_fields": [
      {
        "field": "[COMITE_ETICA_NOME]",
        "label": "Nome do Órgão de Ética",
        "description": "Designação do Comitê ou responsável pela condução dos temas de ética",
        "default_value": "Comitê de Ética e Integridade"
      },
      {
        "field": "[CANAL_DENUNCIA_URL]",
        "label": "Canal de Denúncias da Empresa",
        "description": "Endereço ou canal de reporte seguro da empresa",
        "default_value": "Canal de Integridade TechCompliance"
      }
    ],
    "default_content": "# CÓDIGO DE ÉTICA, CONDUTA E INTEGRIDADE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data de Aprovação:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### CAPÍTULO I — FINALIDADE, ESCOPO E PRINCÍPIOS FUNDAMENTAIS\n\n**Artigo 1º — Finalidade e Escopo:**  \nEste Código de Ética e Conduta estabelece as diretrizes axiológicas, as regras de postura profissional e os compromissos éticos indeclináveis que regem todas as operações, decisões e relacionamentos mantidos pela **[RAZÃO SOCIAL]** no exercício de suas atividades econômicas, industriais ou comerciais, com especial ênfase nas contratações públicas e privadas.\n\n**Artigo 2º — Abrangência Subjetiva:**  \nAs disposições deste instrumento vinculam, sem exceção:\nI - Sócios, acionistas controladores, administradores, diretores e conselheiros;\nII - Colaboradores celetistas, estagiários, menores aprendizes e voluntários;\nIII - Prepostos, representantes comerciais, consultores, mandatários e prestadores de serviços que atuem em nome, no interesse ou em benefício da **[RAZÃO SOCIAL]**.\n\n**Artigo 3º — Princípios Reitores:**  \nTodas as atividades da organização são orientadas pelos seguintes princípios norteadores:\n1. **Legalidade Estrita:** Submissão irrestrita à ordem constitucional, leis federais, estaduais e municipais vigentes;\n2. **Probidade e Moralidade:** Condução honesta, sincera, íntegra e leal em todas as manifestações corporativas;\n3. **Lealdade Concorrencial e Boa-Fé:** Repúdio a qualquer artifício que falseie o mercado ou prejudique certames licitatórios;\n4. **Transparência e Previsibilidade:** Clareza na prestação de contas, informações contábeis e execução de contratos;\n5. **Dignidade e Respeito Humano:** Promoção de um ambiente seguro, inclusivo, equânime e livre de qualquer forma de violência ou discriminação.\n\n---\n\n### CAPÍTULO II — COMPROMISSO DA ALTA ADMINISTRAÇÃO E GOVERNANÇA\n\n**Artigo 4º — Declaração da Liderança (\"Tone at the Top\"):**  \nA Alta Administração da **[RAZÃO SOCIAL]**, representada por seus administradores e por **[RESPONSÁVEL]**, expressa seu repúdio categórico e inegociável a qualquer modalidade de corrupção, fraude, favorecimento indevido, suborno e desrespeito às normas concorrenciais e trabalhistas. A diretoria assume o compromisso de conferir suporte financeiro, funcional e institucional aos mecanismos de conformidade.\n\n**Artigo 5º — [COMITE_ETICA_NOME]:**  \nCompete ao **[COMITE_ETICA_NOME]** ou ao Encarregado de Integridade zelar pela divulgação deste Código, responder a dúvidas operacionais, deliberar sobre casos omissos e coordenar os procedimentos disciplinares cabíveis.\n\n---\n\n### CAPÍTULO III — CONDUTAS ESPERADAS NO EXERCÍCIO PROFISSIONAL\n\n**Artigo 6º — São deveres de todos os integrantes da [RAZÃO SOCIAL]:**  \nI - Conhecer, observar e cumprir integralmente este Código e as políticas internas correlatas;  \nII - Agir com diligência, zelo técnico, boa-fé e economia de recursos no desempenho de suas atribuições;  \nIII - Tratar com urbanidade, presteza e respeito colegas de trabalho, clientes, fornecedores, concorrentes e agentes públicos;  \nIV - Zelar pelo patrimônio físico, intelectual, tecnológico e reputacional da empresa;  \nV - Reportar prontamente, por meio dos canais oficiais, qualquer suspeita ou constatação de infração às normas vigentes.\n\n---\n\n### CAPÍTULO IV — CONDUTAS EXPRESSAMENTE VEDADAS\n\n**Artigo 7º — É terminantemente proibido a qualquer pessoa sujeita a este Código:**  \nI - Prometer, oferecer, dar ou autorizar, direta ou indiretamente, vantagem indevida a agente público ou a terceiro a ele vinculado (Lei nº 12.846/2013, Art. 5º);  \nII - Combinar lances, ajustar preços, compartilhar propostas comerciais ou dividir lotes em procedimentos de licitação pública ou cotações privadas (Lei nº 14.133/2021);  \nIII - Praticar, tolerar ou condescender com assédio moral, assédio sexual, injúria racial ou qualquer discriminação fundada em raça, gênero, orientação sexual, credo religioso, deficiência ou idade (Lei nº 14.457/2022);  \nIV - Utilizar a função, cargo ou informações privilegiadas obtidas na empresa para obter proveito pessoal ou em favor de familiares e conhecidos;  \nV - Falsificar, adulterar, omitir ou mascarar dados em demonstrações contábeis, notas fiscais, contratos e atestados de capacidade técnica.\n\n---\n\n### CAPÍTULO V — RELACIONAMENTO COM A ADMINISTRAÇÃO PÚBLICA\n\n**Artigo 8º — Rigor em Contratos Públicos:**  \nNo âmbito de licitações regidas pela Lei nº 14.133/2021 ou correlatas, a **[RAZÃO SOCIAL]** e seus representantes conduzirão todos os contatos com servidores, pregoeiros e fiscais de contrato de forma formal, documentada e com transparência, cumprindo fielmente os encargos assumidos e repelindo exigências indevidas.\n\n---\n\n### CAPÍTULO VI — CANAL DE DENÚNCIAS E PROTEÇÃO CONTRA RETALIAÇÃO\n\n**Artigo 9º — [CANAL_DENUNCIA_URL]:**  \nA organização disponibiliza canal formal de manifestações, assegurando a possibilidade de anonimato, confidencialidade no tratamento da matéria e independência investigativa.\n\n**Artigo 10º — Cláusula Pétrea de Não Retaliação:**  \nÉ expressamente vedada qualquer medida disciplinar, repreensão, demissão injustificada, alteração prejudicial de função ou discriminação funcional contra colaboradores que realizem denúncias ou colaborem com investigações de boa-fé. A tentativa de retaliação constitui falta grave passível de demissão por justa causa.\n\n---\n\n### CAPÍTULO VII — REGIME DISCIPLINAR E CONSEQUÊNCIAS DO DESCUMPRIMENTO\n\n**Artigo 11º — Sanções Aplicáveis:**  \nA infração comprovada aos preceitos deste Código ensejará as seguintes medidas disciplinares, proporcionais à gravidade e reincidência do ato, sem prejuízo das providências cíveis e criminais:\na) Advertência verbal com registro reservado;\nb) Advertência escrita;\nc) Suspensão disciplinar;\nd) Rescisão do contrato de trabalho por justa causa (Art. 482 da CLT) ou rescisão contratual motivada para terceiros.\n\n---\n\n### CAPÍTULO VIII — DISPOSIÇÕES FINAIS E CONTROLE DE REVISÃO\n\n**Artigo 12º — Revisão e Vigência:**  \nEste documento entra em vigor imediatamente após sua formalização e será objeto de revisão periódica com periodicidade recomendada não superior a 24 (vinte e quatro) meses, ou antes caso sobrevenham alterações legislativas relevantes."
  },
  {
    "id": "mod-02-politica-geral-integridade",
    "category": "ESSENCIAIS",
    "order": 2,
    "title": "Política Geral de Integridade e Conformidade",
    "subtitle": "Estrutura macro de governança, papéis e gestão do programa de conformidade",
    "description": "Estabelece a arquitetura global do Programa de Integridade, as responsabilidades de liderança, mecanismos de controle interno, rotinas de monitoramento e auditoria periódica de riscos.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 56 e 57 do Decreto nº 11.129/2022; Art. 25, § 4º da Lei nº 14.133/2021.",
    "recommended_for": "Empresas com programas estruturados de compliance ou que visam participar de certames de grande vulto.",
    "governance_fields": [
      {
        "field": "[GESTOR_COMPLIANCE_CARGO]",
        "label": "Cargo do Gestor do Programa",
        "description": "Designação do cargo ou função responsável pelo compliance",
        "default_value": "Responsável pelo Programa de Integridade"
      },
      {
        "field": "[PERIODICIDADE_AUDITORIA]",
        "label": "Periodicidade da Auditoria Interna",
        "description": "Frequência das revisões e auditorias internas do programa",
        "default_value": "anual"
      }
    ],
    "default_content": "# POLÍTICA GERAL DE INTEGRIDADE E CONFORMIDADE (COMPLIANCE)\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO E DIRETRIZES GERAIS\nA presente Política Geral de Integridade e Conformidade consolida as bases operacionais, estruturais e de governança do Programa de Integridade da **[RAZÃO SOCIAL]**, em estrita observância aos parâmetros fixados pelo Decreto Federal nº 11.129/2022 e pela Lei Federal nº 14.133/2021.\n\n### 2. PILARES DE SUSTENTAÇÃO DO PROGRAMA\nO Programa de Integridade da organização estrutura-se sobre cinco pilares interligados:\n1. **Comprometimento da Alta Administração:** Liderança ativa pelo exemplo e provisão de recursos necessários à consecução dos objetivos de conformidade;\n2. **Avaliação Contínua de Riscos:** Identificação, mensuração e mitigação de vulnerabilidades operacionais e jurídicas;\n3. **Normas e Políticas Escritas:** Publicidade de regras transparentes e condutas vedadas a todos os stakeholders;\n4. **Comunicação e Capacitação Periódica:** Difusão prática de conhecimento para prevenção de condutas ilícitas;\n5. **Monitoramento, Investigação e Resposta:** Canais de reporte, auditorias rotineiras e aplicação isonômica de sanções.\n\n### 3. ESTRUTURA ORGANIZACIONAL E ATRIBUIÇÕES\n* **Alta Administração:** Responsável final pela aprovação de diretrizes orçamentárias e pelo respaldo institucional ao programa.\n* **[GESTOR_COMPLIANCE_CARGO]:** Atua com autonomia técnica para orientar colaboradores, supervisionar averiguações, emitir pareceres e monitorar controles internos.\n* **Gestores e Lideranças:** Devem agir como multiplicadores éticos, fiscalizando a conformidade em seus respectivos setores funcionais.\n\n### 4. ROTINAS DE CONTROLE INTERNO E AUDITORIA\nA empresa institui rotinas de conferência contábil, aprovações duplas para movimentações financeiras de alto valor e auditorias com periodicidade **[PERIODICIDADE_AUDITORIA]** para assegurar a idoneidade de contratações e pagamentos.\n\n### 5. MONITORAMENTO E AVALIAÇÃO DE EFICÁCIA\nA organização manterá indicadores de adesão a treinamentos, volume e resolução de denúncias e registros de Due Diligence para fins de demonstração probatória a órgãos de controle externos."
  },
  {
    "id": "mod-03-prevencao-assedio",
    "category": "ETICA_CONDUTA",
    "order": 3,
    "title": "Política de Prevenção e Combate ao Assédio e Discriminação",
    "subtitle": "Diretrizes de proteção ao trabalhador conforme Lei nº 14.457/2022 e NR-1",
    "description": "Normativa obrigatória que define assédio moral, assédio sexual e discriminação, fixando mecanismos preventivos, rotinas de acolhimento, procedimentos de apuração e canais de apoio à vítima.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Lei Federal nº 14.457/2022 (Programa Emprega + Mulher); Portaria MTP nº 4.219/2022; Norma Regulamentadora nº 1 (NR-1) do Ministério do Trabalho e Emprego.",
    "recommended_for": "Obrigatório para empresas com Comissão Interna de Prevenção de Acidentes e Assédio (CIPA/CIPAA) e altamente recomendada para todas as pessoas jurídicas.",
    "governance_fields": [
      {
        "field": "[COMISSAO_APURACAO_ASSÉDIO]",
        "label": "Comissão Responsável",
        "description": "Designação da comissão ou comitê que conduzirá o acolhimento e a averiguação",
        "default_value": "Comissão de Acolhimento e Ética da CIPAA"
      },
      {
        "field": "[PRAZO_RESPOSTA_ACOLHIMENTO]",
        "label": "Prazo para Acolhimento Inicial",
        "description": "Tempo previsto para contato inicial seguro com a vítima",
        "default_value": "48 (quarenta e oito) horas úteis"
      }
    ],
    "default_content": "# POLÍTICA DE PREVENÇÃO E COMBATE AO ASSÉDIO E À DISCRIMINAÇÃO NO TRABALHO\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO E FUNDAMENTO LEGAL\nEsta Política tem por finalidade assegurar um meio ambiente de trabalho hígido, respeitoso, seguro e livre de violência psicológica, assédio moral, assédio sexual e de qualquer manifestação preconceituosa, em cumprimento à Lei Federal nº 14.457/2022 e às diretrizes da NR-1.\n\n### 2. CONCEITOS E CARACTERIZAÇÕES\n* **Assédio Moral:** Exposição repetitiva e prolongada do trabalhador a situações humilhantes, constrangedoras, insultos públicos, desqualificação imotivada ou isolamento funcional no ambiente de trabalho.\n* **Assédio Sexual:** Conduta de cunho sexual não consentida, manifestada por investidas físicas, comentários de conotação erótica, insinuações, propostas constrangedoras ou chantagem ligada à manutenção ou progressão no emprego (Art. 216-A do Código Penal).\n* **Discriminação:** Tratamento desfavorável ou exclusão em decorrência de raça, cor, etnia, gênero, orientação sexual, religião, condição física ou idade.\n\n### 3. CONDUTAS PROIBIDAS\nFica expressamente vedada a prática ou conivência com:\nI - Comentários ofensivos sobre o corpo, aparência ou vida íntima de terceiros;\nII - Piadas desrespeitosas de teor racista, machista, LGBTfóbico ou capacitista;\nIII - Ameaças expressas ou veladas à estabilidade profissional caso favores não sejam concedidos;\nIV - Sobrecarga seletiva de trabalho com intuito de induzir pedido de demissão ou sofrimento psíquico.\n\n### 4. FLUXO DE ACOLHIMENTO E INVESTIGAÇÃO\n1. **Canal de Reporte:** A vítima ou testemunha pode relatar a conduta por meio do Canal de Denúncias da empresa de forma anônima ou nominal;\n2. **Acolhimento Inicial:** A **[COMISSAO_APURACAO_ASSÉDIO]** entrará em contato com a pessoa afetada em até **[PRAZO_RESPOSTA_ACOLHIMENTO]**, preservando o sigilo da identidade;\n3. **Apuração Imparcial:** Serão colhidos depoimentos e elementos de prova sem exposição pública das partes envolvidas;\n4. **Decisão e Medidas de Proteção:** Havendo indícios de veracidade, poderão ser adotadas medidas imediatas de afastamento funcional ou remanejamento de postos para cessar a situação de risco.\n\n### 5. GARANTIA DE NÃO RETALIAÇÃO E MEDIDAS DISCIPLINARES\nA empresa reitera tolerância zero a qualquer ato de retaliação ao denunciante ou colaboradores ouvidos no procedimento. Os responsáveis por práticas de assédio sofrerão sanções imediatas, que poderão culminar na demissão por justa causa (Art. 482 da CLT)."
  },
  {
    "id": "mod-04-brindes-presentes",
    "category": "ETICA_CONDUTA",
    "order": 4,
    "title": "Política de Brindes, Presentes, Hospitalidades e Entretenimento",
    "subtitle": "Regras de limites éticos, governança e relacionamento com agentes públicos e parceiros",
    "description": "Normatiza os critérios e limites para aceitação e oferta de brindes, presentes e convites institucionais, distinguindo o relacionamento com agentes públicos das práticas corporativas usuais entre entes privados.",
    "normative_nature": "DIRETRIZ_RECOMENDADA",
    "legal_basis": "Decreto Federal nº 10.889/2021; Art. 5º da Lei nº 12.846/2013; Resoluções da Comissão de Ética Pública (CEP/PR).",
    "recommended_for": "Empresas com contato com fornecedores e que interajam com servidores de qualquer esfera governamental.",
    "governance_fields": [
      {
        "field": "[LIMITE_VALOR_BRINDE_PRIVADO]",
        "label": "Limite de Valor para Brinde Privado",
        "description": "Valor de referência anual para aceitação de brindes de terceiros privados (ex: R$ 100,00 a R$ 200,00)",
        "default_value": "R$ 150,00 (cento e cinquenta reais)"
      },
      {
        "field": "[ALCADA_APROVACAO_HOSPITALIDADE]",
        "label": "Alçada de Aprovação",
        "description": "Instância interna responsável pela autorização prévia de hospitalidades institucionais",
        "default_value": "Diretoria de Integridade / Compliance"
      }
    ],
    "default_content": "# POLÍTICA DE BRINDES, PRESENTES, HOSPITALIDADES E CONVITES INSTITUCIONAIS\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO E ALCANCE\nA presente Política estabelece padrões de transparência e limites materiais para a concessão ou aceitação de presentes, brindes, refeições, viagens e entretenimento corporativo por parte de integrantes da **[RAZÃO SOCIAL]**, resguardando a independência funcional e afastando suspeitas de favorecimento ilícito.\n\n### 2. DISTINÇÃO FUNDAMENTAL: AGENTES PÚBLICOS VS. SETOR PRIVADO\n* **Agentes Públicos:** É expressamente **PROIBIDO** conceder, prometer ou patrocinar qualquer presente, refeição personalizada, transporte, hospedagem ou entretenimento a servidor público, magistrado, pregoeiro ou fiscal de contrato, salvo a distribuição genérica de itens de mera propaganda institucional (cadernos, canetas, calendários sem valor comercial expressivo), em consonância com o Decreto nº 10.889/2021.\n* **Relações B2B (Setor Privado):** Permitida a troca de cortesias de praxe comercial, desde que não crie expectativa de favorecimento em cotações e respeite o limite financeiro interno.\n\n### 3. LIMITES FINANCEIROS NO SETOR PRIVADO\n* Itens promocionais distribuídos como cortesia usual de mercado até o teto referencial de **[LIMITE_VALOR_BRINDE_PRIVADO]** por entidade a cada 12 (doze) meses podem ser aceitos pelo colaborador.\n* Valores que extrapolem essa cifra devem ser formalmente recusados ou encaminhados à **[ALCADA_APROVACAO_HOSPITALIDADE]** para destinação comunitária, sorteio interno corporativo ou devolução cordial ao remetente.\n\n### 4. HOSPITALIDADES, VIAGENS E EVENTOS TÉCNICOS\nO custeio de diárias, passagens ou hospedagens por parceiros comerciais somente será admitido mediante justificativa de necessidade técnico-profissional comprovada e aprovação prévia expressa da **[ALCADA_APROVACAO_HOSPITALIDADE]**.\n\n### 5. REGISTRO E TRANSPARÊNCIA\nQualquer recebimento ou oferta de cortesia institucional deve ser documentado para fins de prestação de contas aos órgãos fiscalizadores internos."
  },
  {
    "id": "mod-05-anticorrupcao-poder-publico",
    "category": "ANTICORRUPCAO",
    "order": 5,
    "title": "Política Anticorrupção e Relacionamento com a Administração Pública",
    "subtitle": "Prevenção a desvios na Lei nº 12.846/2013 e integridade em contratações públicas",
    "description": "Normatização rígida com base na Lei da Empresa Limpa brasileira, vedando qualquer ato de suborno, fraude a licitações, manipulação de equilíbrio econômico-financeiro e oferecimento de vantagens espúrias a servidores.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Lei Federal nº 12.846/2013 (Lei Anticorrupção); Decreto nº 11.129/2022; Arts. 337-E a 337-P do Código Penal (Lei nº 14.133/2021).",
    "recommended_for": "Obrigatório para todas as empresas contratadas pelo poder público e recomendado para toda a cadeia de valor.",
    "governance_fields": [
      {
        "field": "[GESTOR_RELACIONAMENTO_GOV]",
        "label": "Órgão de Representação Institucional",
        "description": "Área responsável por representar a empresa junto aos entes governamentais",
        "default_value": "Diretoria Executiva / Representantes Formais Credenciados"
      }
    ],
    "default_content": "# POLÍTICA ANTICORRUPÇÃO E DE RELACIONAMENTO COM A ADMINISTRAÇÃO PÚBLICA\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO E DECLARAÇÃO DE TOLERÂNCIA ZERO\nA **[RAZÃO SOCIAL]** reitera sua política de tolerância zero contra todas as práticas corruptas e fraudulentas. Esta normativa visa cumprir com rigor as exigências da Lei Federal nº 12.846/2013 e da Lei nº 14.133/2021, assegurando que todas as operações da empresa se desenvolvam com lisura e retidão republicana.\n\n### 2. ATOS LESIVOS EXPRESSAMENTE PROIBIDOS (LEI 12.846/2013, ART. 5º)\nConstitui infração gravíssima praticar, facilitar ou incentivar:\nI - Promessa, oferta ou concessão direta ou indireta de vantagem indevida a qualquer agente público, nacional ou estrangeiro;\nII - Financiamento, custeio ou patrocínio da prática de atos ilícitos;\nIII - Utilização de pessoa física ou jurídica interposta para ocultar interesses reais ou a identidade dos beneficiários de atos contratuais;\nIV - Frustrar ou fraudar mediante ajuste, conluio ou qualquer artifício o caráter competitivo de procedimento licitatório;\nV - Impedir, perturbar ou fraudar a realização de qualquer ato de procedimento licitatório público;\nVI - Obter vantagem ou benefício indevido, de modo fraudulento, de modificações ou prorrogações de contratos celebrados com a administração pública.\n\n### 3. PROTOCOLO DE INTERAÇÃO COM AUTORIDADES E AGENTES ESTATAIS\n* **Formalidade e Registro:** Reuniões com agentes públicos devem contar preferencialmente com a presença de ao menos dois representantes corporativos ou ser realizadas em dependências públicas ou mediante pauta prévia documentada;\n* **Canais Oficiais:** A troca de ofícios, notificações e solicitações deve se dar exclusivamente por meio de e-mails corporativos, processos eletrônicos oficiais (ex: SEI) ou correspondências formais protocoladas.\n\n### 4. REGIME DE RESPONSABILIZAÇÃO OBJETIVA\nRessalta-se aos colaboradores que a Lei nº 12.846/2013 estipula a responsabilidade administrativa e civil objetiva das pessoas jurídicas pela prática de atos lesivos praticados em seu benefício, impondo multas de até 20% do faturamento bruto e decretação de inidoneidade."
  },
  {
    "id": "mod-06-pagamentos-facilitadores",
    "category": "ANTICORRUPCAO",
    "order": 6,
    "title": "Política de Pagamentos Facilitadores e Extorsão",
    "subtitle": "Vedação a taxas de facilitação (grease payments) e protocolo seguro contra concussão",
    "description": "Proíbe de forma peremptória os pagamentos destinados a acelerar atos de rotina não discricionários da administração pública, e estabelece o protocolo de conduta diante de pedidos de propina ou exigência criminosa de agentes estatais.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Arts. 316 (Concussão), 317 (Corrupção Passiva) e 333 (Corrupção Ativa) do Código Penal Brasileiro; Convenção da OCDE sobre Combate à Corrupção.",
    "recommended_for": "Empresas com rotinas alfandegárias, expedição de licenças, alvarás, vistorias e fiscalizações estatais.",
    "governance_fields": [
      {
        "field": "[CANAL_EMERGENCIA_EXTORSAO]",
        "label": "Canal de Contato Imediato",
        "description": "Contato reservado para auxílio e proteção jurídica do colaborador sob coação",
        "default_value": "Plantão da Diretoria de Integridade e Assessoria Jurídica"
      }
    ],
    "default_content": "# POLÍTICA DE PAGAMENTOS FACILITADORES E PROCEDIMENTO EM CASOS DE EXTORSÃO / CONCUSSÃO\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. CONCEITO E PROIBIÇÃO DE PAGAMENTOS FACILITADORES\n* **Pagamento Facilitador (\"Facilitation Payment\"):** Consiste em pagamentos informais ou doações de modesto valor entregues a servidores públicos visando garantir, agilizar ou descomplicar a execução de uma ação governamental rotineira (ex: emissão de licença, vistoria veicular, desembaraço aduaneiro ou liberação de alvará).\n* **Posição Institucional:** No direito brasileiro não há exceção para tais práticas. Qualquer pagamento informal a funcionário público configura crime de corrupção ativa. É **TERMINANTEMENTE PROIBIDO** efetuar qualquer pagamento facilitador em nome da **[RAZÃO SOCIAL]**.\n\n### 2. PROTOCOLO OPERACIONAL EM CASO DE EXTORSÃO OU CONCUSSÃO\nCaso um colaborador, motorista, despachante ou preposto seja confrontado com a exigência direta ou velada de propina por agente estatal:\nI - **Negativa Firme e Polida:** Informar com calma que a empresa possui Programa de Integridade auditado com regras rígidas que proíbem repasses não autorizados em lei;\nII - **Não Negociação:** Jamais pactuar ou simular aceitação da cobrança;\nIII - **Preservação de Registros:** Anotar dia, hora, local, nomes ou identificação da viatura, funcional ou circunstância do fato;\nIV - **Comunicação Imediata:** Entrar em contato incontinenti com o **[CANAL_EMERGENCIA_EXTORSAO]** para que o setor jurídico adote as salvaguardas legais e providencie a representação formal perante os órgãos correcionais ou Ministério Público competente.\n\n### 3. EXCEÇÃO EXCLUSIVA DE RISCO À VIDA OU INTEGRIDADE FÍSICA\nNa hipótese de risco iminente à integridade física do colaborador, sua vida prevalecerá sobre qualquer patrimônio financeiro. Ocorrendo a coação irresistível, o fato deve ser relatado imediatamente à organização após restabelecida a segurança pessoal para registro de notícia-crime."
  },
  {
    "id": "mod-07-conflitos-de-interesse",
    "category": "CONFLITOS_INTERESSE",
    "order": 7,
    "title": "Política de Gestão de Conflitos de Interesse",
    "subtitle": "Identificação, mitigação e transparência de vínculos impeditivos",
    "description": "Estabelece os critérios objetivos para detectar vínculos societários, comerciais, familiares ou profissionais que possam colidir com a imparcialidade das decisões na empresa ou com deveres perante órgãos licitantes.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 14 da Lei nº 14.133/2021; Art. 57, inciso III do Decreto nº 11.129/2022; Lei Federal nº 12.813/2013.",
    "recommended_for": "Empresas com participação em compras públicas, contratações terceirizadas e parcerias societárias.",
    "governance_fields": [
      {
        "field": "[COMITE_CONFLITOS_NOME]",
        "label": "Comitê/Responsável por Análise",
        "description": "Área responsável por deliberar sobre o plano de mitigação do conflito",
        "default_value": "Comitê de Integridade e Riscos"
      }
    ],
    "default_content": "# POLÍTICA DE IDENTIFICAÇÃO E GESTÃO DE CONFLITOS DE INTERESSE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. CONCEITO DE CONFLITO DE INTERESSE\nConfigura-se conflito de interesse a situação gerada pelo confronto entre interesses públicos ou corporativos da **[RAZÃO SOCIAL]** e os interesses particulares de seus integrantes ou parceiros comerciais, que possa comprometer a isenção, a fidelidade ou a objetividade técnica das decisões.\n\n### 2. HIPÓTESES TÍPICAS\nConstituem situações potenciais de conflito:\nI - Colaborador que possua participação societária ou vínculo familiar até o 3º grau com sócios de empresas fornecedoras, clientes ou concorrentes;\nII - Profissional responsável por conduzir cotações ou compras corporativas que mantenha relações de compadrio ou negócios privados com concorrentes do processo de seleção;\nIII - Relação de parentesco ou vínculo conjugal entre dirigentes da empresa e agentes públicos com poder decisório no órgão licitante em que a organização dispute contratos (vedação do Art. 14 da Lei nº 14.133/2021);\nIV - Exercício de atividade paralela de consultoria ou assessoria a empresas que concorram no mesmo ramo de mercado.\n\n### 3. DEVER DE DECLARAÇÃO ESPONTÂNEA\nO conflito de interesses em si não presume má-fé imediata, desde que seja informado de maneira transparente e antecipada. Todo integrante da empresa tem o dever indeclinável de preencher a Declaração de Conflito de Interesses no ato da admissão e tempestivamente sempre que surgir fato novo.\n\n### 4. PLANO DE MITIGAÇÃO\nRecebida a declaração, a **[COMITE_CONFLITOS_NOME]** definirá as salvaguardas operacionais necessárias, tais como o impedimento do colaborador de participar de cotações, reuniões decisórias ou de fiscalizar o contrato objeto do vínculo informado."
  },
  {
    "id": "mod-08-declaracao-conflito-interesse",
    "category": "CONFLITOS_INTERESSE",
    "order": 8,
    "title": "Declaração Individual de Conflito de Interesses",
    "subtitle": "Formulário declaratório anual de transparência funcional e societária",
    "description": "Instrumento individual a ser preenchido por colaboradores, diretores e tomadores de decisão, mapeando vínculos familiares com agentes públicos, sócios de concorrentes ou fornecedores.",
    "normative_nature": "BOA_PRATICA",
    "legal_basis": "Art. 14, inciso IV e § 1º da Lei nº 14.133/2021; Parâmetros de Avaliação de Programas de Integridade da CGU.",
    "recommended_for": "Recomendado para cargos de liderança, compradores, prepostos licitatórios e novos colaboradores.",
    "governance_fields": [
      {
        "field": "[SETOR_ARQUIVAMENTO_DECLARACOES]",
        "label": "Área Guardiã dos Registros",
        "description": "Setor responsável pelo arquivamento confidencial dos formulários",
        "default_value": "Setor de Recursos Humanos / Compliance"
      }
    ],
    "default_content": "# DECLARAÇÃO INDIVIDUAL DE CONFLITO DE INTERESSES E VÍNCULOS RELEVANTES\n\n**Empresa Empregadora:** [RAZÃO SOCIAL]  \n**CNPJ nº:** [CNPJ]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### DADOS DO DECLARANTE\n* **Nome Completo:** __________________________________________________________________\n* **Cargo / Função:** _________________________________________________________________\n* **Departamento / Setor:** ___________________________________________________________\n* **CPF nº:** ____________________________________\n\n---\n\n### QUESTIONÁRIO DE VERIFICAÇÃO ÉTICA\n\n1. **Vínculos com o Setor Público:**  \nVocê, seu cônjuge, companheiro(a) ou parente em linha reta, colateral ou por afinidade até o 3º grau exerce cargo em comissão, função de confiança, mandato eletivo ou atua em comissão de contratação em órgão público com o qual a **[RAZÃO SOCIAL]** celebra ou pretende celebrar contratos?  \n( ) NÃO  \n( ) SIM. *(Especificar nome do agente, órgão, parentesco e função: ____________________)*\n\n2. **Participação em Empresas Fornecedoras ou Concorrentes:**  \nVocê possui cotas, ações, participações societárias ou exerce administração remunerada em pessoa jurídica que preste serviços, forneça produtos ou concorra diretamente com a **[RAZÃO SOCIAL]**?  \n( ) NÃO  \n( ) SIM. *(Especificar nome da empresa e natureza do vínculo: ____________________________)*\n\n3. **Atividades Externas Concorrentes:**  \nVocê desempenha alguma atividade de consultoria, assessoria ou prestação de serviços a clientes da empresa sem prévia ciência de sua chefia?  \n( ) NÃO  \n( ) SIM. *(Especificar: _______________________________________________________________)*\n\n---\n\n### TERMO DE COMPROMISSO E VERACIDADE\nDeclaro que as informações acima prestadas são a expressão fidedigna da verdade. Comprometo-me a renovar esta declaração caso ocorra qualquer modificação superveniente em meus vínculos funcionais, familiares ou negociais.\n\nData: ____/____/202__\n\n_____________________________________________________________  \nAssinatura do Colaborador Declarante"
  },
  {
    "id": "mod-09-codigo-conduta-terceiros",
    "category": "TERCEIROS",
    "order": 9,
    "title": "Código de Conduta para Fornecedores e Terceiros",
    "subtitle": "Padrões exigidos de fornecedores, subcontratados e parceiros comerciais",
    "description": "Normatiza as obrigações éticas, trabalhistas e ambientais que parceiros comerciais, prestadores e subcontratados devem acatar ao celebrar contratos com a empresa.",
    "normative_nature": "DIRETRIZ_RECOMENDADA",
    "legal_basis": "Art. 57, inciso XIII do Decreto nº 11.129/2022; Portaria Conjunta CGU/ME; Diretrizes ESG.",
    "recommended_for": "Empresas com cadeia de suprimentos relevante ou que subcontratem parcelas de obras e serviços.",
    "governance_fields": [
      {
        "field": "[CLAUSULA_RESCISAO_INTEGRIDADE]",
        "label": "Cláusula Contratual Padrão",
        "description": "Referência à rescisão por justa causa na quebra de integridade",
        "default_value": "Cláusula de Integridade e Anticorrupção Contratual"
      }
    ],
    "default_content": "# CÓDIGO DE CONDUTA ÉTICA PARA FORNECEDORES E PARCEIROS COMERCIAIS\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. ABRANGÊNCIA E COMPROMISSO DA CADEIA DE VALOR\nA **[RAZÃO SOCIAL]** exige de todos os seus fornecedores, parceiros comerciais, prestadores de serviços e subcontratados conformidade absoluta com os preceitos éticos e legais estabelecidos neste instrumento. A assinatura de contratos com nossa organização implica adesão integral a estas normas.\n\n### 2. OBRIGAÇÕES ANTICORRUPÇÃO E CONFORMIDADE LEGAL\nO fornecedor ou parceiro obriga-se a:\nI - Cumprir integralmente as disposições da Lei nº 12.846/2013, não prometendo, oferecendo ou praticando atos de corrupção ou concessão de vantagens indevidas perante agentes públicos ou privados;\nII - Não praticar concorrência desleal, conluio ou divisão de mercado com terceiros concorrentes;\nIII - Prestar informações precisas sobre seus quadros societários e beneficiários finais sempre que requisitado nos procedimentos de Due Diligence.\n\n### 3. DIREITOS HUMANOS E NORMAS TRABALHISTAS\nÉ dever indeclinável de todo parceiro comercial:\nI - Repudiar e banir expressamente o uso de trabalho análogo à escravidão ou trabalho infantil em qualquer etapa de sua produção ou prestação de serviços (Art. 149 do Código Penal);\nII - Prover condições adequadas de saúde e segurança ocupacional, fornecendo EPIs e respeitando jornadas legais;\nIII - Assegurar ambientes isentos de assédio moral e sexual.\n\n### 4. CONSEQUÊNCIAS DO DESCUMPRIMENTO\nO cometimento comprovado de práticas corruptas, uso de mão de obra ilícita ou infração ética grave acarretará a rescisão unilateral e motivada do contrato de fornecimento, nos termos da **[CLAUSULA_RESCISAO_INTEGRIDADE]**, sem prejuízo da aplicação de penalidades contratuais e notificação aos órgãos de fiscalização."
  },
  {
    "id": "mod-10-due-diligence-terceiros",
    "category": "TERCEIROS",
    "order": 10,
    "title": "Política de Due Diligence e Contratação de Terceiros (DDI)",
    "subtitle": "Metodologia de checagem prévia em bases sancionadoras (CEIS, CNEP, PEP, Lista Suja)",
    "description": "Normatiza o processo sistemático de análise reputacional e de conformidade de fornecedores, subcontratados e prestadores de serviços antes do fechamento de contratos.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 57, inciso XIII do Decreto nº 11.129/2022; Art. 14, inciso III da Lei nº 14.133/2021.",
    "recommended_for": "Essencial para prevenir fraudes, lavagem de dinheiro e contratações com empresas sancionadas.",
    "governance_fields": [
      {
        "field": "[PERIODICIDADE_REAVALIACAO_DDI]",
        "label": "Periodicidade de Renovação DDI",
        "description": "Prazo para rechecagem cadastral dos fornecedores ativos",
        "default_value": "12 (doze) meses"
      }
    ],
    "default_content": "# POLÍTICA DE DUE DILIGENCE DE INTEGRIDADE (DDI) DE TERCEIROS E FORNECEDORES\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO DA DUE DILIGENCE\nA Due Diligence de Integridade visa identificar, mensurar e gerenciar os riscos de associação a terceiros inidôneos, prevenindo que a **[RAZÃO SOCIAL]** contrate pessoas físicas ou jurídicas envolvidas em corrupção, fraudes fiscais, lavagem de dinheiro ou trabalho degradante.\n\n### 2. BASES DE DADOS E REGISTROS DE CONSULTA OBRIGATÓRIA\nNenhuma contratação relevante ou subcontratação em contratos públicos será formalizada sem consulta prévia demonstrada nas seguintes bases:\nI - **CEIS:** Cadastro Nacional de Empresas Inidôneas e Suspensas;\nII - **CNEP:** Cadastro Nacional de Empresas Punidas (Lei Anticorrupção);\nIII - **Cadastro de Empregadores que submeteram trabalhadores a condições análogas à de escravo (\"Lista Suja\");**\nIV - **Cadastro de Pessoas Expostas Politicamente (PEP);**\nV - **Situação Cadastral na Receita Federal do Brasil (CNPJ ativo e regular).**\n\n### 3. CLASSIFICAÇÃO DE RISCO E MITIGAÇÃO\n* **Risco Baixo:** Terceiro sem apontamentos, com regularidade fiscal e objeto social compatível com o escopo;\n* **Risco Médio:** Apontamentos sem condenação definitiva ou presença de sócios com perfil politicamente exposto; requer alçada especial de aprovação e cláusulas de monitoramento;\n* **Risco Crítico / Bloqueio:** Empresas ativas com registro no CEIS/CNEP que as impeça de licitar ou contratar, ou com flagrante de trabalho escravo. A contratação é vetada.\n\n### 4. PERIODICIDADE E ARQUIVAMENTO\nOs relatórios probatórios emitidos (DDI Records) devem ser arquivados em conjunto com o dossiê da contratação e renovados a cada **[PERIODICIDADE_REAVALIACAO_DDI]** enquanto durar a relação comercial."
  },
  {
    "id": "mod-11-conduta-licitacoes-contratos",
    "category": "PODER_PUBLICO",
    "order": 11,
    "title": "Diretrizes de Conduta em Licitações e Contratos Administrativos",
    "subtitle": "Rigor concorrencial e mitigação aos crimes dos Arts. 337-E a 337-P do Código Penal",
    "description": "Manual operacional para prepostos licitatórios e equipes comerciais, fixando vedações penais relativas a frustração do caráter competitivo, cartel, fraude em lances e superfaturamento.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Lei Federal nº 14.133/2021; Arts. 337-E, 337-F, 337-H, 337-I, 337-J, 337-K, 337-L do Código Penal Brasileiro.",
    "recommended_for": "Obrigatório para empresas participantes de certames públicos, pregões e concorrências.",
    "governance_fields": [
      {
        "field": "[GESTOR_LICITACOES_CARGO]",
        "label": "Responsável pelo Setor de Licitações",
        "description": "Cargo do responsável técnico pela elaboração de propostas",
        "default_value": "Gerente de Licitações e Contratos"
      }
    ],
    "default_content": "# DIRETRIZES DE CONDUTA ÉTICA EM LICITAÇÕES PÚBLICAS E CONTRATOS ADMINISTRATIVOS\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. COMPROMISSO COM A LEGISLAÇÃO LICITATÓRIA\nA atuação da **[RAZÃO SOCIAL]** em procedimentos licitatórios pauta-se pelo atendimento integral às disposições da Lei Federal nº 14.133/2021 e pelos princípios da legalidade, impessoalidade, moralidade, publicidade, eficiência e competitividade.\n\n### 2. CONDUTAS TIPIFICADAS COMO CRIMES LICITATÓRIOS (CÓDIGO PENAL)\nTodos os integrantes e prepostos da empresa devem atentar para as proibições legais:\n* **Art. 337-E (Frustração do Caráter Competitivo):** É crime frustrar ou fraudar o caráter competitivo da licitação com o intuito de obter benefício. É expressamente vedado qualquer acordo prévio de preços ou cobertura de lances;\n* **Art. 337-F (Fraude em Licitação):** Fraudar, em prejuízo da administração, mediante artifício, certame licitatório ou contrato dele decorrente;\n* **Art. 337-I (Afasta Licitante):** Impedir, perturbar ou fraudar a participação de qualquer concorrente por meio de violência, ameaça ou oferecimento de vantagem;\n* **Art. 337-L (Fraude na Execução Contratual):** Entregar mercadoria com qualidade inferior, quantidade diminuída ou diversa da estipulada em edital e proposta homologada.\n\n### 3. PROTOCOLO OPERACIONAL DA EQUIPE COMERCIAL\nI - Toda formulação de propostas de preços deve decorrer de composição interna de custos fundamentada em planilhas técnicas reais;  \nII - Fica vedado qualquer contato com empresas competidoras sobre certames em andamento;  \nIII - Esclarecimentos e impugnações a editais serão apresentados exclusivamente pelos meios formais previstos no instrumento convocatório."
  },
  {
    "id": "mod-12-interacoes-agentes-publicos-doacoes",
    "category": "PODER_PUBLICO",
    "order": 12,
    "title": "Política de Interações com Agentes Públicos e Doações Institucionais",
    "subtitle": "Regras de transparência republicana e vedação legal a doações eleitorais corporativas",
    "description": "Normatiza os contatos com servidores, veda peremptoriamente o repasse corporativo a campanhas políticas conforme decisão do STF (ADI 4650) e disciplina doações sociais.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Decisão do STF na ADI 4650 (vedação a doações eleitorais de pessoas jurídicas); Art. 81 da Lei nº 9.504/1997; Lei nº 12.846/2013.",
    "recommended_for": "Todas as empresas, prevenindo riscos de corrupção, nepotismo ou caixa dois.",
    "governance_fields": [
      {
        "field": "[ORGAO_APROVACAO_DOACOES]",
        "label": "Instância Decisória para Apoios Sociais",
        "description": "Área responsável por autorizar doações sem fins lucrativos",
        "default_value": "Diretoria Colegiada / Presidência"
      }
    ],
    "default_content": "# POLÍTICA DE INTERAÇÕES COM AGENTES PÚBLICOS E DOAÇÕES INSTITUCIONAIS\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. VEDAÇÃO CATEGÓRICA A DOAÇÕES POLÍTICAS E ELEITORAIS\n* Em cumprimento estrito à jurisprudência pacificada pelo Supremo Tribunal Federal na ADI nº 4.650 e à legislação eleitoral em vigor, a **[RAZÃO SOCIAL]** é **TERMINANTEMENTE PROIBIDA** de realizar quaisquer doações financeiras, empréstimos de bens, cessão de veículos ou patrocínios a partidos políticos, comitês eleitorais, campanhas ou pré-candidatos a cargos públicos eletivos.\n* Nenhuma verba ou patrimônio corporativo poderá ser empregado para fins político-partidários, direta ou indiretamente.\n\n### 2. REGRAS PARA DOAÇÕES E PATROCÍNIOS SOCIOAMBIENTAIS\nA realização de doações humanitárias, apoios filantrópicos ou patrocínios a projetos culturais e desportivos subordina-se a:\nI - Análise prévia da idoneidade da entidade beneficiária (vedadas instituições ligadas a agentes públicos com poder decisório em contratos da empresa);\nII - Celebração de termo formal com prestação de contas dos recursos empregados;\nIII - Aprovação expressa e unânime por parte do **[ORGAO_APROVACAO_DOACOES]**.\n\n### 3. AUDIÊNCIAS E TRATATIVAS COM AUTORIDADES\nContatos institucionais com autoridades e fiscais do contrato devem ser sempre agendados por escrito, observando o princípio da publicidade administrativa e registrando-se em ata ou relatório resumido as pautas debatidas."
  },
  {
    "id": "mod-13-canal-denuncias-nao-retaliacao",
    "category": "PESSOAS_AMBIENTE",
    "order": 13,
    "title": "Política do Canal de Denúncias e Não Retaliação",
    "subtitle": "Estrutura do canal, garantia de anonimato, sigilo e salvaguarda do manifestante de boa-fé",
    "description": "Normativa central que regulamenta a gestão do canal de denúncias, os prazos de processamento, a garantia irrestrita de não retaliação ao denunciante de boa-fé e o sigilo de dados.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 23 da Lei Federal nº 14.457/2022; Art. 57, inciso X do Decreto nº 11.129/2022; Norma ISO 37002 (Whistleblowing Management Systems).",
    "recommended_for": "Obrigatório para empresas com CIPA e essencial para pontuação e comprovação de compliance na Lei nº 14.133/2021.",
    "governance_fields": [
      {
        "field": "[PRAZO_RESPOSTA_PROTOCOLO]",
        "label": "Prazo para Triagem e Protocolo",
        "description": "Tempo padrão para resposta inicial ao denunciante",
        "default_value": "72 (setenta e duas) horas"
      },
      {
        "field": "[COMISSAO_DENUNCIAS_NOME]",
        "label": "Instância de Triagem",
        "description": "Órgão interno responsável por receber e processar as denúncias",
        "default_value": "Comissão de Ética e Denúncias"
      }
    ],
    "default_content": "# POLÍTICA DO CANAL DE DENÚNCIAS E PROTEÇÃO CONTRA RETALIAÇÃO AO DENUNCIANTE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. PAPEL E ACESSIBILIDADE DO CANAL DE DENÚNCIAS\nA **[RAZÃO SOCIAL]** mantém canal de integridade acessível a todos os seus colaboradores internos e a terceiros (fornecedores, clientes e cidadãos), assegurando ampla divulgação de seus meios de acesso em seu sítio eletrônico e dependências físicas.\n\n### 2. PRINCÍPIOS FUNDAMENTAIS DE GESTÃO DO CANAL\n* **Opção de Anonimato:** O usuário pode optar pelo sigilo completo de sua identidade, recebendo protocolo de acompanhamento seguro sem fornecimento obrigatório de e-mail ou dados pessoais;\n* **Confidencialidade Absoluta:** O acesso às informações relatadas é restrito aos membros autorizados da **[COMISSAO_DENUNCIAS_NOME]**;\n* **Independência e Imparcialidade:** As averiguações são conduzidas com rigor técnico e presunção de boa-fé probatória;\n* **Segurança da Informação:** Os dados e anexos são mantidos sob ambiente criptografado e seguro.\n\n### 3. CLÁUSULA INEGOCIÁVEL DE NÃO RETALIAÇÃO\nA empresa garante categoricamente a proteção integral de todo colaborador que relate fato ilícito ou colabore de boa-fé com investigações. São consideradas práticas gravíssimas de retaliação:\nI - Demissão, suspensão disciplinar ou rebaixamento funcional imotivado;  \nII - Mudança de turno ou de localidade como forma de castigo velado;  \nIII - Hostilidade, isolamento social ou assédio moral no ambiente profissional.  \nA prática de retaliação ensejará imediata instauração de processo disciplinar com aplicação da penalidade máxima aplicável (demissão por justa causa).\n\n### 4. PRAZOS E RESOLUÇÃO\nA confirmação de recebimento da denúncia será prestada em até **[PRAZO_RESPOSTA_PROTOCOLO]**, informando-se o status conclusivo ao denunciante mediante o uso de seu protocolo eletrônico."
  },
  {
    "id": "mod-14-termo-ciencia-compromisso",
    "category": "PESSOAS_AMBIENTE",
    "order": 14,
    "title": "Termo de Ciência e Compromisso do Colaborador",
    "subtitle": "Adesão individualizada às normas corporativas e ao Código de Conduta",
    "description": "Instrumento individual probatório assinado pelo colaborador na admissão ou reciclagem anual, atestando recebimento, leitura e compromisso com o cumprimento do Código de Conduta.",
    "normative_nature": "BOA_PRATICA",
    "legal_basis": "Art. 57, incisos II e IX do Decreto nº 11.129/2022; Requisito de Evidenciação em Auditorias de Conformidade da Lei nº 14.133/2021.",
    "recommended_for": "Obrigatório no processo de admissão e prontuário de colaboradores de todas as categorias.",
    "governance_fields": [
      {
        "field": "[LOCAL_ARQUIVO_TERMOS]",
        "label": "Local de Arquivamento do Termo",
        "description": "Pasta física ou repositório digital de guarda do termo assinado",
        "default_value": "Prontuário Funcional do Colaborador (RH/Compliance)"
      }
    ],
    "default_content": "# TERMO DE CIÊNCIA, RECEBIMENTO E COMPROMISSO COM O PROGRAMA DE INTEGRIDADE\n\n**Empresa Empregadora:** [RAZÃO SOCIAL]  \n**CNPJ nº:** [CNPJ]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### IDENTIFICAÇÃO DO COLABORADOR\n* **Nome Completo:** __________________________________________________________________\n* **CPF nº:** ___________________________________ **Cargo:** ___________________________\n* **Data de Admissão:** ____/____/202__ **Departamento:** _____________________________\n\n---\n\n### DECLARAÇÃO FORMAL DE COMPROMISSO\nPelo presente instrumento, eu, devidamente qualificado(a) acima:\n\n1. **DECLARO** que recebi nesta data exemplar integral do **Código de Ética e Conduta** e das Políticas de Integridade da **[RAZÃO SOCIAL]**, tendo tido oportunidade de esclarecer quaisquer dúvidas quanto ao seu alcance e conteúdo;\n2. **COMPROMETO-ME** a ler, observar e praticar diariamente os padrões éticos exigidos pela organização em todas as minhas funções operacionais e contatos com o público;\n3. **RECONHEÇO** que é expressamente proibido pagar, prometer ou receber vantagens indevidas, participar de ajustes ilícitos em licitações públicas ou praticar assédio moral ou sexual;\n4. **ESTOU CIENTE** da existência do Canal de Denúncias independente da empresa e de que denúncias formuladas de boa-fé contam com garantia estrita de confidencialidade e proteção contra qualquer forma de retaliação funcional;\n5. **DECLARO-ME CIENTE** de que o descumprimento comprovado das regras do Código sujeitará o infrator às sanções disciplinares previstas em lei e no regulamento interno da empresa.\n\nLocal e Data: ________________________, _____ de _________________ de 202___.\n\n_____________________________________________________________  \nAssinatura do Colaborador"
  },
  {
    "id": "mod-15-regimento-comite-etica",
    "category": "GOVERNANCA_RISCOS",
    "order": 15,
    "title": "Regimento Interno do Comitê de Ética e Integridade",
    "subtitle": "Composição, quórum, deliberações e independência funcional do órgão",
    "description": "Normatiza as competências, funcionamento, periodicidade de reuniões, regras de impedimento e critérios decisórios do órgão colegiado de ética da organização.",
    "normative_nature": "REGRA_INTERNA",
    "legal_basis": "Boas práticas de Governança Corporativa (IBGC); Art. 57, inciso III do Decreto nº 11.129/2022.",
    "recommended_for": "Empresas com comitês formais instituídos ou que busquem estruturação profissional de governança.",
    "governance_fields": [
      {
        "field": "[NUMERO_MEMBROS_COMITE]",
        "label": "Composição Numérica do Comitê",
        "description": "Quantidade de membros titulares do comitê (ex: 3 a 5 membros)",
        "default_value": "3 (três) membros titulares"
      },
      {
        "field": "[PERIODICIDADE_REUNIOES_COMITE]",
        "label": "Periodicidade das Reuniões Ordinárias",
        "description": "Frequência de reunião ordinária",
        "default_value": "trimestral"
      }
    ],
    "default_content": "# REGIMENTO INTERNO DO COMITÊ DE ÉTICA E INTEGRIDADE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. NATUREZA E FINALIDADE\nO Comitê de Ética e Integridade da **[RAZÃO SOCIAL]** é órgão deliberativo e consultivo interno, dotado de independência técnica e funcional, subordinado diretamente à Alta Administração, com o objetivo de orientar, deliberar e fiscalizar a aplicação do Código de Conduta e das Políticas de Compliance.\n\n### 2. COMPOSIÇÃO E MANDATO\nO Comitê será integrado por **[NUMERO_MEMBROS_COMITE]**, designados pela Diretoria Executiva dentre colaboradores idôneos de setores-chave (tais como Jurídico, Recursos Humanos, Operações ou Controladoria). Os mandatos terão duração definida internamente, admitida a recondução técnica.\n\n### 3. COMPETÊNCIAS E ATRIBUIÇÕES\nCompete privativamente ao Comitê:\nI - Interpretar as normas éticas e deliberar sobre consultas de casos omissos;  \nII - Analisar e acompanhar os relatórios de averiguação de denúncias graves;  \nIII - Recomendar à Alta Administração a aplicação de penalidades disciplinares cabíveis;  \nIV - Propor revisões e atualizações periódicas nas políticas internas de integridade.\n\n### 4. FUNCIONAMENTO E DELIBERAÇÕES\nO Comitê reunir-se-á ordinariamente com periodicidade **[PERIODICIDADE_REUNIOES_COMITE]** e extraordinariamente sempre que convocado em caráter de urgência. As decisões serão tomadas pela maioria simples de votos presentes, lavrando-se ata com registro em livro ou arquivo digital protegido."
  },
  {
    "id": "mod-16-matriz-riscos-integridade",
    "category": "GOVERNANCA_RISCOS",
    "order": 16,
    "title": "Metodologia de Avaliação e Matriz de Riscos de Integridade",
    "subtitle": "Critérios de probabilidade e impacto para identificação de vulnerabilidades",
    "description": "Estabelece os critérios objetivos para identificação, mapeamento, classificação de probabilidade e impacto, e definição de planos de mitigação dos riscos de corrupção e fraudes.",
    "normative_nature": "BOA_PRATICA",
    "legal_basis": "Art. 57, inciso IV do Decreto nº 11.129/2022; Guia de Avaliação de Riscos de Integridade da CGU; ISO 31000.",
    "recommended_for": "Empresas com múltiplos contratos ou atividades com maior exposição a riscos operacionais.",
    "governance_fields": [
      {
        "field": "[PERIODICIDADE_REVISAO_RISCOS]",
        "label": "Periodicidade de Atualização da Matriz",
        "description": "Prazo para reavaliação dos riscos da empresa",
        "default_value": "anual"
      }
    ],
    "default_content": "# METODOLOGIA DE GESTÃO E MATRIZ DE RISCOS DE INTEGRIDADE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO DO GERENCIAMENTO DE RISCOS\nA presente metodologia disciplina a identificação sistemática e a prevenção de riscos de corrupção, suborno, fraude licitatória e descumprimento normativo aos quais a **[RAZÃO SOCIAL]** esteja exposta no curso de seus negócios.\n\n### 2. ETAPAS DO CICLO DE GESTÃO DE RISCOS\n1. **Identificação do Processo Crítico:** Mapeamento de interações com agentes públicos, rotinas de compras, pagamentos e elaboração de lances licitatórios;\n2. **Avaliação da Probabilidade (P):** Graduação de 1 (Raro) a 5 (Muito Frequente);\n3. **Avaliação do Impacto (I):** Mensuração financeira, regulatória e reputacional de 1 (Leve) a 5 (Catastrófico);\n4. **Cálculo do Risco Inerente ($R = P \times I$):**\n   * 1 a 6: Baixo;\n   * 7 a 14: Médio;\n   * 15 a 25: Alto / Crítico.\n5. **Definição de Ações Mitigatórias:** Controles duplos, auditoria amostral, substituição de prepostos ou treinamentos customizados.\n\n### 3. REVISÃO E DOCUMENTAÇÃO\nA Matriz de Riscos de Integridade será atualizada formalmente com periodicidade **[PERIODICIDADE_REVISAO_RISCOS]** ou sempre que houver expansão para novos ramos comerciais ou alterações societárias significativas."
  },
  {
    "id": "mod-17-manual-investigacoes-internas",
    "category": "GOVERNANCA_RISCOS",
    "order": 17,
    "title": "Manual de Procedimento para Investigações Internas",
    "subtitle": "Rito probatório imparcial, respeito ao contraditório e cadeia de custódia",
    "description": "Normatiza as etapas de recebimento, triagem, apuração probatória, sigilo, direito à ampla defesa do investigado e formalização de relatório conclusivo.",
    "normative_nature": "DIRETRIZ_RECOMENDADA",
    "legal_basis": "Art. 57, inciso XI do Decreto nº 11.129/2022; Preceitos Constitucionais do Devido Processo Legal e Ampla Defesa.",
    "recommended_for": "Empresas que realizam apurações de denúncias internamente, assegurando segurança jurídica contra litígios.",
    "governance_fields": [
      {
        "field": "[PRAZO_CONCLUSAO_INVESTIGACAO]",
        "label": "Prazo Máximo para Apuração",
        "description": "Tempo padrão de conclusão de relatório de apuração",
        "default_value": "30 (trinta) dias úteis, prorrogáveis justificadamente"
      }
    ],
    "default_content": "# MANUAL DE PROCEDIMENTO PARA INVESTIGAÇÕES INTERNAS E APURAÇÃO DE DENÚNCIAS\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. PRINCÍPIOS FUNDAMENTAIS DA INVESTIGAÇÃO INTERNA\nO procedimento de investigação de ilícitos na **[RAZÃO SOCIAL]** observará rigorosamente os princípios da verdade material, imparcialidade, presunção de inocência, proporcionalidade, sigilo das apurações e garantia do contraditório e da ampla defesa antes da deliberação de penalidades graves.\n\n### 2. FASES DO PROCEDIMENTO\n* **Fase 1 — Triagem e Juízo de Admissibilidade:** Verificação de verossimilhança inicial da denúncia e competência temática;\n* **Fase 2 — Instrução e Coleta de Evidências:** Análise documental, diligências in loco, extração técnica de registros eletrônicos com respeito à cadeia de custódia e tomada de depoimentos testemunhais gravados em termo;\n* **Fase 3 — Oitiva do Investigado:** Oportunidade indispensável para que o colaborador sob apuração apresente suas razões e elementos de contraprova;\n* **Fase 4 — Relatório Conclusivo:** Parecer motivado emitido no prazo de até **[PRAZO_CONCLUSAO_INVESTIGACAO]**, classificando a denúncia como PROCEDENTE, IMPROCEDENTE ou INCONCLUSIVA;\n* **Fase 5 — Encaminhamento Decisório:** Envio do relatório à Alta Administração para aplicação das medidas cabíveis."
  },
  {
    "id": "mod-18-programa-treinamentos-comunicacao",
    "category": "GOVERNANCA_RISCOS",
    "order": 18,
    "title": "Programa Anual de Treinamentos e Comunicação em Integridade",
    "subtitle": "Cronograma de capacitação, trilhas pedagógicas e registros de frequência",
    "description": "Estabelece o plano estruturado de capacitação de colaboradores, trilhas obrigatórias da Lei nº 14.133/2021 e NR-1, comunicação contínua e arquivo de certificados.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Art. 25, § 4º da Lei nº 14.133/2021; Art. 57, inciso V do Decreto nº 11.129/2022; NR-1 do MTP.",
    "recommended_for": "Obrigatório para empresas com exigência contratual de programa de conformidade.",
    "governance_fields": [
      {
        "field": "[FREQ_RECICLAGEM_TREINAMENTO]",
        "label": "Periodicidade de Reciclagem",
        "description": "Intervalo para realização de novos treinamentos",
        "default_value": "anual"
      }
    ],
    "default_content": "# PROGRAMA ANUAL DE TREINAMENTOS E COMUNICAÇÃO DE INTEGRIDADE\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO PEDAGÓGICO\nAssegurar que todos os integrantes da **[RAZÃO SOCIAL]** compreendam na prática suas obrigações éticas, saibam identificar situações de risco em licitações e contratos e conheçam os mecanismos de denúncia e combate ao assédio.\n\n### 2. TRILHAS FORMATIVAS OBRIGATÓRIAS\nO programa contempla obrigatoriamente duas trilhas centrais:\n* **Trilha 1 — Integridade e Lei nº 14.133/2021:** Anticorrupção, prevenção a fraudes em lances, concorrência leal e Due Diligence de terceiros;\n* **Trilha 2 — Prevenção ao Assédio Moral, Sexual e NR-1 (Lei nº 14.457/2022):** Respeito à dignidade no trabalho, acolhimento e proteção de denunciantes.\n\n### 3. METODOLOGIA E COMPROVAÇÃO DE ADESÃO\nOs treinamentos serão realizados no momento da integração do colaborador e de forma reciclada com periodicidade **[FREQ_RECICLAGEM_TREINAMENTO]**. A frequência e o aproveitamento serão comprovados por meio de listas de presença físicas ou emissão de certificados digitais rastreáveis, anexados ao dossiê de conformidade da empresa."
  },
  {
    "id": "mod-19-lgpd-privacidade",
    "category": "DADOS_SEGURANCA",
    "order": 19,
    "title": "Política de Privacidade e Proteção de Dados (LGPD)",
    "subtitle": "Tratamento de dados pessoais, bases legais e direitos dos titulares",
    "description": "Normatiza as regras internas para coleta, armazenamento, processamento e descarte de dados pessoais, atendimento aos direitos dos titulares e salvaguardas da Lei nº 13.709/2018.",
    "normative_nature": "REQUISITO_LEGAL",
    "legal_basis": "Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD); Resoluções da Autoridade Nacional de Proteção de Dados (ANPD).",
    "recommended_for": "Obrigatório para todas as pessoas jurídicas que realizem tratamento de dados de clientes, empregados ou parceiros.",
    "governance_fields": [
      {
        "field": "[ENCARREGADO_DPO_CONTATO]",
        "label": "Contato do Encarregado de Dados (DPO)",
        "description": "Canal formal para recebimento de solicitações de titulares",
        "default_value": "privacidade@empresa.com.br"
      }
    ],
    "default_content": "# POLÍTICA CORPORATIVA DE PRIVACIDADE E PROTEÇÃO DE DADOS PESSOAIS (LGPD)\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. ESCOPO E COMPROMISSO COM A PRIVACIDADE\nA **[RAZÃO SOCIAL]** atua no tratamento de dados pessoais pautando-se pelos princípios da finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção e não discriminação, em estrito cumprimento à Lei nº 13.709/2018 (LGPD).\n\n### 2. BASES LEGAIS PARA TRATAMENTO DE DADOS\nO tratamento de dados pessoais de colaboradores, clientes, fornecedores e parceiros limitar-se-á às hipóteses autorizativas legais:\nI - Cumprimento de obrigação legal ou regulatória pelo controlador;  \nII - Execução de contratos ou procedimentos preliminares contratuais;  \nIII - Exercício regular de direitos em processo judicial, administrativo ou arbitral;  \nIV - Legítimo interesse do controlador, resguardados os direitos e liberdades fundamentais do titular.\n\n### 3. DIREITOS DOS TITULARES DE DADOS\nA empresa garante aos titulares a confirmação da existência de tratamento, o acesso aos dados, a correção de dados incompletos ou inexatos, a anonimização ou eliminação de dados desnecessários, mediante solicitação formal direcionada ao canal: **[ENCARREGADO_DPO_CONTATO]**.\n\n### 4. GESTÃO DE INCIDENTES DE SEGURANÇA\nQualquer incidente de vazamento de dados ou acesso não autorizado deverá ser prontamente comunicado ao Encarregado de Dados (DPO) para apuração de impacto e notificação à ANPD e aos titulares, caso aplicável."
  },
  {
    "id": "mod-20-seguranca-informacao-ativos",
    "category": "DADOS_SEGURANCA",
    "order": 20,
    "title": "Política de Segurança da Informação e Uso de Ativos Tecnológicos",
    "subtitle": "Diretrizes de senhas, confidencialidade, uso de e-mail e ativos corporativos",
    "description": "Estabelece os deveres dos usuários quanto ao uso adequado de computadores, dispositivos móveis, senhas, e-mails corporativos, sigilo de documentos estratégicos e backup.",
    "normative_nature": "DIRETRIZ_RECOMENDADA",
    "legal_basis": "Normas da família ABNT NBR ISO/IEC 27001 e 27002; Marco Civil da Internet (Lei nº 12.965/2014).",
    "recommended_for": "Essencial para proteger segredos comerciais, dados de licitações e integridade de sistemas corporativos.",
    "governance_fields": [
      {
        "field": "[GESTOR_TI_CARGO]",
        "label": "Responsável pela Segurança da Informação",
        "description": "Setor responsável pela infraestrutura e segurança lógica",
        "default_value": "Setor de Tecnologia da Informação / Segurança Digital"
      }
    ],
    "default_content": "# POLÍTICA DE SEGURANÇA DA INFORMAÇÃO E USO DE ATIVOS DE TECNOLOGIA\n\n**Organização:** [RAZÃO SOCIAL] ([NOME FANTASIA])  \n**CNPJ nº:** [CNPJ]  \n**Aprovado por:** [RESPONSÁVEL] ([CARGO])  \n**Data:** [DATA] | **Versão:** [VERSÃO]  \n\n---\n\n> **NOTA DE RESPONSABILIDADE E AVALIAÇÃO JURÍDICA:**  \n> Este documento constitui um modelo de referência disponibilizado pela plataforma TechCompliance. A organização deve avaliar sua aplicabilidade e compatibilidade com seu setor de atuação, seu porte e sua estrutura de governança, adaptando suas disposições aos seus riscos concretos e submetendo-o à revisão formal e aprovação da Alta Administração antes de sua implementação.\n\n---\n\n### 1. OBJETIVO E DIRETRIZES GERAIS\nGarantir a confidencialidade, integridade e disponibilidade das informações e ativos computacionais da **[RAZÃO SOCIAL]**, prevenindo vazamentos, sabotagens operacionais, ataques cibernéticos ou uso indevido de recursos da empresa.\n\n### 2. DIRETRIZES DE USO DE ATIVOS CORPORATIVOS\n* **Finalidade Profissional:** Computadores, e-mails, acessos a servidores e ferramentas corporativas destinam-se exclusivamente ao desempenho de atividades funcionais da organização;\n* **Senhas e Acessos:** O compartilhamento de credenciais de acesso e senhas individuais é terminantemente vedado. O usuário é pessoalmente responsável pelas operações realizadas sob sua credencial;\n* **Proibição de Softwares Não Autorizados:** Fica proibida a instalação de aplicativos ou programas piratas ou sem licença corporativa aprovada pelo **[GESTOR_TI_CARGO]**.\n\n### 3. CONFIDENCIALIDADE E SIGILO EM LICITAÇÕES\nDocumentos estratégicos relativos a orçamentos, composições de preços em licitações e dados de fornecedores possuem caráter estritamente reservado, sendo vedada sua transmissão para e-mails particulares ou pen-drives não autorizados.\n\n### 4. MONITORAMENTO CORPORATIVO\nA infraestrutura tecnológica da empresa é monitorada para fins exclusivos de segurança digital e prevenção a fraudes, não havendo expectativa de privacidade em ferramentas fornecidas pelo empregador para o trabalho."
  }
];
