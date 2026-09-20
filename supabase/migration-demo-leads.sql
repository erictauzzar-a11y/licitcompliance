-- =========================================================================
-- MIGRATION: TABELA DEMO_LEADS (SOLICITAÇÕES DE ACESSO À VERSÃO DEMO)
-- TechCompliance - Captação de Leads B2B para Demonstração
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Habilitar Row Level Security (RLS)
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- Política de leitura restrita a administradores autenticados
CREATE POLICY "Admins leem leads de demo" ON demo_leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Inserções são realizadas com service_role via backend/Server Action
