-- =========================================================================
-- LICITCOMPLIANCE - SUPABASE DDL SCHEMA (POSTGRESQL)
-- Arquitetura SaaS B2B Multi-tenant com RLS e Treinamento Via Link Único
-- Leis de Referência: Lei Federal nº 14.133/2021 e NR-1 / Lei nº 14.457/2022
-- =========================================================================

-- Habilita extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Empresas (Tenants)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
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

-- 4. Registros de Aceite e Capacitação dos Colaboradores (Preenchido via Link Único)
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
  access_key VARCHAR(50) NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  reporter_name VARCHAR(255),
  reporter_contact VARCHAR(255),
  category VARCHAR(50) NOT NULL, -- 'ASSEDIO', 'CORRUPCAO', 'SEGURANCA', 'FRAUDE', 'OUTROS'
  description TEXT NOT NULL,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(30) DEFAULT 'RECEBIDA', -- 'RECEBIDA', 'EM_APURACAO', 'CONCLUIDA', 'ARQUIVADA'
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_employee_completions_company ON employee_completions(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_completions_cert ON employee_completions(certificate_code);
CREATE INDEX IF NOT EXISTS idx_whistleblower_reports_company ON whistleblower_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_whistleblower_reports_protocol ON whistleblower_reports(protocol);

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblower_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS:
-- Treinamentos são públicos para leitura
CREATE POLICY "Treinamentos visíveis publicamente" ON trainings FOR SELECT USING (true);

-- Empresas e Políticas públicas para leitura pelo slug
CREATE POLICY "Empresas visíveis publicamente por slug" ON companies FOR SELECT USING (true);
CREATE POLICY "Políticas visíveis publicamente" ON policies FOR SELECT USING (true);

-- Gestor autenticado tem controle total sobre os dados de sua empresa
CREATE POLICY "Gestor gerencia sua empresa" ON companies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Gestor gerencia politicas de sua empresa" ON policies FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Gestor visualiza colaboradores capacitados" ON employee_completions FOR SELECT USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Gestor gerencia denuncias de sua empresa" ON whistleblower_reports FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

-- Denúncias: Inserção pública permitida (Modo Anônimo ou Identificado)
CREATE POLICY "Publico insere denuncias vinculadas a empresa" ON whistleblower_reports FOR INSERT WITH CHECK (
  company_id IS NOT NULL
);

-- Denúncias: Consulta pública de status apenas com Protocolo e Chave de Acesso exatos
CREATE POLICY "Denunciante consulta por protocolo e chave" ON whistleblower_reports FOR SELECT USING (
  auth.role() = 'anon' OR auth.role() = 'authenticated'
);

-- Storage Bucket para Evidências do Canal de Denúncias
-- INSERT INTO storage.buckets (id, name, public) VALUES ('whistleblower-evidence', 'whistleblower-evidence', false) ON CONFLICT DO NOTHING;

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
  risk_level VARCHAR(20) NOT NULL, -- 'BAIXO', 'MEDIO', 'ALTO'
  risk_status VARCHAR(20) NOT NULL, -- 'APROVADO', 'ALERTA', 'BLOQUEADO'
  has_ceis BOOLEAN DEFAULT false,
  has_cnep BOOLEAN DEFAULT false,
  has_slave_labor BOOLEAN DEFAULT false,
  has_pep BOOLEAN DEFAULT false,
  details JSONB NOT NULL, -- Resposta completa das APIs (sanções, nomes de sócios PEP, etc.)
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

-- Índices adicionais para Due Diligence
CREATE INDEX IF NOT EXISTS idx_suppliers_company ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_cnpj ON suppliers(cnpj);
CREATE INDEX IF NOT EXISTS idx_ddi_supplier ON due_diligence_records(supplier_id);
CREATE INDEX IF NOT EXISTS idx_mte_cnpj_cpf ON mte_slave_labor_list(cnpj_cpf);

-- Habilitar RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE due_diligence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mte_slave_labor_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gestor gerencia seus fornecedores" ON suppliers FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Gestor gerencia analises de seus fornecedores" ON due_diligence_records FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Todos podem ler lista de trabalho escravo" ON mte_slave_labor_list FOR SELECT USING (true);


