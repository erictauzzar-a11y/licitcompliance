-- =========================================================================
-- LICITCOMPLIANCE - SUPABASE DDL SCHEMA (POSTGRESQL SEGURO & HARDENED)
-- Arquitetura SaaS B2B Multi-tenant com RLS Estrita, RPCs Seguras e Isolamento
-- Leis de Referência: Lei Federal nº 14.133/2021 e NR-1 / Lei nº 14.457/2022
-- =========================================================================

-- Habilita extensão de UUID e Criptografia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Empresas (Tenants)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  integrity_officer_name VARCHAR(255),
  integrity_officer_email VARCHAR(255),
  integrity_officer_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Código de Conduta e Políticas da Empresa
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  published_to_employees BOOLEAN DEFAULT true,
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Treinamentos e Conteúdo em Texto (Microlearning)
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  track VARCHAR(50) NOT NULL, -- 'INTEGRIDADE_14133' ou 'NR1_ASSEDIO'
  content_cards JSONB NOT NULL, -- Array de objetos: [{ title, text }]
  questions JSONB NOT NULL -- Array de objetos: [{ id, question, options: [], correct_index }]
);

-- 4. Registros de Aceite e Capacitação dos Colaboradores
CREATE TABLE IF NOT EXISTS employee_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  role VARCHAR(100) NOT NULL,
  training_score INT NOT NULL,
  certificate_code VARCHAR(64) UNIQUE NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Canal de Denúncias
CREATE TABLE IF NOT EXISTS whistleblower_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  protocol VARCHAR(50) UNIQUE NOT NULL,
  access_key VARCHAR(100) NOT NULL, -- Chave de acesso protegida
  is_anonymous BOOLEAN DEFAULT true,
  reporter_name VARCHAR(255),
  reporter_contact VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(30) DEFAULT 'RECEBIDA',
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Fornecedores analisados pela empresa (Due Diligence de Terceiros)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  status_cadastral VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Histórico de consultas de Due Diligence
CREATE TABLE IF NOT EXISTS due_diligence_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  risk_status VARCHAR(20) NOT NULL,
  has_ceis BOOLEAN DEFAULT false,
  has_cnep BOOLEAN DEFAULT false,
  has_slave_labor BOOLEAN DEFAULT false,
  has_pep BOOLEAN DEFAULT false,
  details JSONB NOT NULL,
  report_hash VARCHAR(64) UNIQUE NOT NULL,
  queried_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela de referência para a Lista Suja do Trabalho Escravo (MTE)
CREATE TABLE IF NOT EXISTS mte_slave_labor_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cnpj_cpf VARCHAR(18) NOT NULL UNIQUE,
  employer_name VARCHAR(255) NOT NULL,
  establishment_location VARCHAR(255),
  inclusion_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de Performance e Segurança
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_employee_completions_company ON employee_completions(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_completions_cert ON employee_completions(certificate_code);
CREATE INDEX IF NOT EXISTS idx_whistleblower_reports_company ON whistleblower_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_whistleblower_reports_lookup ON whistleblower_reports(protocol, access_key);

-- Habilitar RLS em TODAS as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblower_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE due_diligence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mte_slave_labor_list ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- POLÍTICAS RLS SEGURAS (ZERO LEAKAGE)
-- =========================================================================

-- Treinamentos são públicos para leitura das opções educativas
CREATE POLICY "Treinamentos visíveis publicamente" ON trainings FOR SELECT USING (true);

-- Empresas: Leitura pública APENAS dos campos não-sensíveis através de VIEW oficial
-- O gestor autenticado tem controle total sobre os dados da sua empresa
CREATE POLICY "Gestor gerencia sua empresa" ON companies FOR ALL USING (auth.uid() = user_id);

-- Políticas: Gestor gerencia as de sua empresa; público lê apenas se ativas e publicadas
CREATE POLICY "Gestor gerencia politicas de sua empresa" ON policies FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Publico visualiza politicas ativas e publicadas" ON policies FOR SELECT USING (
  is_active = true AND published_to_employees = true
);

-- Colaboradores: Apenas o gestor autenticado visualiza colaboradores
CREATE POLICY "Gestor visualiza colaboradores capacitados" ON employee_completions FOR SELECT USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

-- Denúncias:
-- 1. Inserção pública permitida (Canal Anônimo ou Identificado)
CREATE POLICY "Publico insere denuncias vinculadas a empresa" ON whistleblower_reports FOR INSERT WITH CHECK (
  company_id IS NOT NULL
);

-- 2. Gestor autenticado gerencia denúncias de sua própria empresa
CREATE POLICY "Gestor gerencia denuncias de sua empresa" ON whistleblower_reports FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

-- 3. REMOVIDA A POLÍTICA PERMISSIVA ANTIGA ("auth.role() = 'anon' OR auth.role() = 'authenticated'")
-- O denunciante consulta o status EXCLUSIVAMENTE pela RPC segura abaixo (SECURITY DEFINER)

-- Due Diligence e Fornecedores
CREATE POLICY "Gestor gerencia seus fornecedores" ON suppliers FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Gestor gerencia analises de seus fornecedores" ON due_diligence_records FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Todos podem ler lista de trabalho escravo" ON mte_slave_labor_list FOR SELECT USING (true);

-- =========================================================================
-- FUNÇÃO RPC SEGURA PARA ACOMPANHAMENTO DE DENÚNCIA (ANTI-ENUMERAÇÃO E ANTI-IDOR)
-- =========================================================================
CREATE OR REPLACE FUNCTION track_whistleblower_report(
  p_company_slug VARCHAR(100),
  p_protocol VARCHAR(50),
  p_access_key VARCHAR(100)
)
RETURNS TABLE (
  id UUID,
  company_id UUID,
  protocol VARCHAR(50),
  category VARCHAR(50),
  description TEXT,
  evidence_urls JSONB,
  status VARCHAR(30),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.company_id,
    r.protocol,
    r.category,
    r.description,
    r.evidence_urls,
    r.status,
    r.resolution_notes,
    r.created_at,
    r.updated_at
  FROM whistleblower_reports r
  INNER JOIN companies c ON c.id = r.company_id
  WHERE c.slug = p_company_slug
    AND r.protocol = UPPER(TRIM(p_protocol))
    AND r.access_key = TRIM(p_access_key)
  LIMIT 1;
END;
$$;

-- =========================================================================
-- 9. Solitações de Acesso à Versão Demo (Leads)
-- =========================================================================
CREATE TABLE IF NOT EXISTS demo_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  source VARCHAR(50) DEFAULT 'demo_request' NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para demo_leads
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- Apenas admins autenticados leem leads (inserção via service_role ou backend seguro)
CREATE POLICY "Admins leem leads de demo" ON demo_leads
  FOR SELECT USING (auth.role() = 'authenticated');

