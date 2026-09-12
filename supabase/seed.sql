-- =========================================================================
-- LICITCOMPLIANCE - SEED DEFAULT DATA
-- Empresa de Exemplo, Políticas, Conteúdo de Treinamento e Quiz
-- =========================================================================

-- 1. INSERIR EMPRESA DEMO
INSERT INTO public.companies (id, trade_name, legal_name, cnpj, slug, logo_url)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'TransLog Brasil Soluções',
    'TransLog Brasil Transportes e Logística em Licitações Ltda',
    '12345678000195',
    'translog-brasil',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=300'
) ON CONFLICT (id) DO NOTHING;

-- 2. INSERIR POLÍTICA / CÓDIGO DE CONDUTA ATIVO
INSERT INTO public.policies (id, company_id, title, content, version, is_active)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Código de Conduta, Integridade Licitatória e Prevenção ao Assédio (Lei 14.133 / NR-1)',
    '# CÓDIGO DE ÉTICA, CONDUTA E INTEGRIDADE

## 1. COMPROMISSO COM A INTEGRIDADE EM CONTRATAÇÕES PÚBLICAS (LEI 14.133/2021)
A nossa empresa repudia veementemente qualquer forma de fraude, conluio ou pagamento de vantagens indevidas a servidores públicos ou agentes licitantes. Nossas propostas refletem custos reais e capacidade de execução rigorosa.

## 2. PREVENÇÃO E COMBATE AO ASSÉDIO E DISCRIMINAÇÃO (NR-1 / LEI 14.457/2022)
Garantimos um ambiente de trabalho digno, saudável e respeitoso. Assédio moral ou sexual, piadas constrangedoras, abusos verbais ou qualquer forma de discriminação implicam em sanções disciplinares imediatas e rescisão por justa causa.

## 3. CANAL INDEPENDENTE DE DENÚNCIAS
Disponibilizamos um canal seguro, confidencial e que assegura o anonimato a qualquer denunciante, garantindo proteção total contra retaliações.',
    '1.0',
    true
) ON CONFLICT (id) DO NOTHING;

-- 3. INSERIR TRILHAS DE TREINAMENTO (MICROLEARNING EM TEXTO)
-- Trilha 1: Integridade e Licitações Públicas (Lei 14.133)
INSERT INTO public.trainings (id, title, description, track)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'Integridade e Licitações Públicas (Lei Federal nº 14.133/2021)',
    'Diretrizes práticas de conduta para contratações públicas, proibição de vantagens indevidas e transparência com órgãos estatais.',
    'INTEGRIDADE_14133'
) ON CONFLICT (track) DO NOTHING;

-- Trilha 2: Prevenção ao Assédio e Segurança no Trabalho (NR-1 / Lei 14.457)
INSERT INTO public.trainings (id, title, description, track)
VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Prevenção ao Assédio e Segurança no Trabalho (NR-1 / Lei nº 14.457/2022)',
    'Orientações obrigatórias para preservação de ambiente digno, identificação de assédio moral e sexual, e uso de canais de apoio.',
    'NR1_ASSEDIO'
) ON CONFLICT (track) DO NOTHING;

-- CARDS TRILHA 1 (INTEGRIDADE 14.133)
INSERT INTO public.training_cards (training_id, order_index, title, content)
VALUES 
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    1,
    'Relação com Servidores Públicos',
    'É expressamente proibido a qualquer colaborador oferecer, prometer ou conceder brindes, almoços de cortesia, dinheiro, favores particulares ou vantagens de qualquer espécie a pregoeiros, membros de comissão, fiscais de contrato ou quaisquer servidores públicos. Essa prática configura crime contra a administração pública e acarreta a desclassificação imediata e inidoneidade da empresa.'
),
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    2,
    'Integridade na Execução e Propostas',
    'A empresa cumpre rigorosamente todos os termos constantes do edital, da proposta comercial e da minuta contratual. Não pactuamos divisão de lotes ou combinação de preços com empresas concorrentes. É terminantemente vedado entregar mercadorias ou prestar serviços de qualidade inferior ou em quantidades divergentes das contratadas pelo poder público.'
),
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    3,
    'Canal Seguro e Denúncia de Pressões',
    'Caso você sofra qualquer cobrança indevida, insinuação ou pedido de vantagem por parte de agentes estatais, ou perceba irregularidades internas na condução de um contrato público, reporte imediatamente através do Canal de Denúncias da empresa. O canal é confidencial, pode ser acessado de forma 100% anônima e a empresa garante proteção absoluta contra retaliações.'
) ON CONFLICT (training_id, order_index) DO NOTHING;

-- QUESTÕES DE FIXAÇÃO TRILHA 1 (INTEGRIDADE 14.133)
INSERT INTO public.training_questions (training_id, question_text, options, correct_option_index, explanation)
VALUES 
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'Durante a entrega de um material em um órgão público, o fiscal de contrato sugere que você pague um almoço ou dê um brinde para agilizar o ateste da nota fiscal. Qual a postura correta?',
    '["Pagar o almoço para evitar atraso no recebimento da empresa", "Recusar educadamente, informar que as políticas da empresa proíbem qualquer cortesia e relatar imediatamente o fato no Canal de Denúncias", "Oferecer um brinde de valor baixo para não criar atrito", "Combinar o pagamento fora do horário comercial"]'::jsonb,
    1,
    'A Lei 14.133/2021 e o programa de integridade proíbem categoricamente qualquer brinde ou vantagem a agentes públicos, devendo o fato ser reportado imediatamente.'
),
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'Um concorrente entra em contato antes de uma disputa pública sugerindo que sua empresa dispute apenas o Lote A enquanto ele fica com o Lote B. O que fazer?',
    '["Aceitar, pois isso garante que ambas as empresas saiam ganhando", "Recusar e denunciar imediatamente a proposta de conluio/cartel", "Aguardar a licitação começar para decidir", "Consultar informalmente o pregoeiro"]'::jsonb,
    1,
    'Divisão de lotes e ajuste prévio de preços constituem crime de fraude à licitação e infração gravíssima à Lei Anticorrupção.'
),
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'O que acontece se a empresa entregar materiais com especificações inferiores às licitadas?',
    '["É tolerado caso o órgão público não perceba", "Constitui descumprimento contratual grave, passível de rescisão, multa e impedimento de licitar", "Basta dar um desconto no valor da nota fiscal", "É permitido se o preço de custo tiver subido"]'::jsonb,
    1,
    'Entregar objeto com qualidade inferior frauda a licitação e acarreta punições severas tanto para a empresa quanto para os responsáveis diretos.'
);

-- CARDS TRILHA 2 (NR-1 / LEI 14.457)
INSERT INTO public.training_cards (training_id, order_index, title, content)
VALUES 
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    1,
    'O que é Assédio Moral no Trabalho',
    'Assédio moral é a exposição repetitiva de colaboradores a situações humilhantes, constrangedoras, ofensas verbais, apelidos pejorativos, isolamento proposital de colegas de equipe ou exigência de tarefas impossíveis de cumprir com prazos desumanos. A dignidade da pessoa humana prevalece sobre qualquer meta comercial.'
),
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    2,
    'O que é Assédio Sexual e Limites de Convivência',
    'Assédio sexual caracteriza-se por comentários invasivos sobre a aparência física ou corpo de colegas, piadas ou insinuações de teor sexual, toques corporais sem consentimento ou chantagem de promoção/manutenção de emprego condicionada a intimidade. Não é tolerada qualquer atitude que constranja ou desrespeite a individualidade do colaborador.'
),
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    3,
    'Segurança no Trabalho e Proteção ao Denunciante',
    'Todo trabalhador tem direito a um ambiente seguro e saudável, sendo indispensável o uso de EPIs e cumprimento de normas operacionais. O canal de denúncias da empresa é o meio formal para acolher queixas de assédio e insegurança com sigilo garantido e sem retaliação ao denunciante.'
) ON CONFLICT (training_id, order_index) DO NOTHING;

-- QUESTÕES DE FIXAÇÃO TRILHA 2 (NR-1 / LEI 14.457)
INSERT INTO public.training_questions (training_id, question_text, options, correct_option_index, explanation)
VALUES 
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Um líder repreende aos gritos e com ofensas pessoais um colaborador na frente de toda a equipe devido a um erro operacional. Como essa conduta se classifica?',
    '["Estilo firme de gestão necessário para bater metas", "Assédio moral e conduta reprovável proibida pelas normas internas da empresa", "Exercício normal do poder diretivo", "Advertência informal aceitável"]'::jsonb,
    1,
    'Humilhações públicas e ofensas verbais configuram assédio moral e violam frontalmente os preceitos da NR-1 e o Código de Conduta.'
),
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Um colega de trabalho insiste em enviar mensagens inadequadas com conotações íntimas e comentários sobre o corpo de outra pessoa após ela já ter pedido para parar. O que isso configura?',
    '["Apenas brincadeira ou elogio inofensivo", "Falta de senso de humor da vítima", "Assédio sexual e violação aos direitos fundamentais no trabalho", "Problema particular sem relevância para a empresa"]'::jsonb,
    2,
    'Insinuações íntimas não consentidas e comentários indesejados constituem assédio sexual, passíveis de apuração e demissão por justa causa.'
),
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Se você presenciar ou for vítima de uma situação de assédio moral ou sexual na empresa, o que deve fazer?',
    '["Guardar silêncio por medo de perder o emprego", "Reagir com agressão física ao assediador", "Utilizar o Canal de Denúncias oficial da empresa (de forma anônima ou identificada) relatando o ocorrido", "Publicar ofensas em redes sociais particulares"]'::jsonb,
    2,
    'O Canal de Denúncias assegura sigilo absoluto, preservação da identidade do denunciante e condução imparcial pela comissão de ética.'
);

-- 4. COLABORADORES DE DEMO
INSERT INTO public.employees (id, company_id, full_name, cpf, role, phone, email, access_token, policy_accepted_at, policy_acceptance_ip)
VALUES 
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Carlos Eduardo da Silva',
    '12345678901',
    'Motorista de Cargas Especiais',
    '11988887777',
    'carlos.silva@translog.com.br',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
    timezone('utc'::text, now() - interval '2 days'),
    '187.54.210.12'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Mariana Ribeiro Gomes',
    '23456789012',
    'Analista de Licitações e Contratos',
    '11977776666',
    'mariana.gomes@translog.com.br',
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
    timezone('utc'::text, now() - interval '1 day'),
    '177.102.88.45'
),
(
    '77eebc99-9c0b-4ef8-bb6d-6bb9bd380077',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Rodrigo Mendes Rocha',
    '34567890123',
    'Encarregado Operacional de Logística',
    '11966665555',
    'rodrigo.rocha@translog.com.br',
    '77eebc99-9c0b-4ef8-bb6d-6bb9bd380077',
    null,
    null
) ON CONFLICT (id) DO NOTHING;

-- 5. CERTIFICADOS REGISTRADOS PARA DEMO
INSERT INTO public.employee_trainings (employee_id, training_id, score, completed_at, certificate_code, ip_address)
VALUES 
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    100,
    timezone('utc'::text, now() - interval '2 days'),
    'CERT-14133-2026-CS894',
    '187.54.210.12'
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    100,
    timezone('utc'::text, now() - interval '2 days'),
    'CERT-NR1-2026-CS895',
    '187.54.210.12'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    100,
    timezone('utc'::text, now() - interval '1 day'),
    'CERT-14133-2026-MR302',
    '177.102.88.45'
) ON CONFLICT (employee_id, training_id) DO NOTHING;

-- 6. DENÚNCIAS REGISTRADAS PARA DEMO
INSERT INTO public.whistleblower_reports (
    id,
    company_id,
    protocol,
    access_key,
    is_anonymous,
    reporter_name,
    reporter_contact,
    category,
    description,
    evidence_urls,
    status,
    resolution_notes,
    created_at,
    updated_at
)
VALUES (
    '88eebc99-9c0b-4ef8-bb6d-6bb9bd380088',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'DEN-2026-4891',
    'SEC894',
    true,
    null,
    null,
    'ASSEDIO_MORAL_SEXUAL',
    'Relato de cobranças com tom de constrangimento e xingamentos recorrentes em reunião de equipe no turno da noite por parte de encarregado.',
    '[]'::jsonb,
    'EM_ANALISE',
    'Comissão instaurou procedimento sigiloso de escuta individual com testemunhas.',
    timezone('utc'::text, now() - interval '3 days'),
    timezone('utc'::text, now() - interval '1 day')
) ON CONFLICT (id) DO NOTHING;
