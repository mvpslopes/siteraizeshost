/*
  # Raízes Eventos - Sistema de Gerenciamento de Eventos

  ## Visão Geral
  Este schema cria a estrutura completa para o sistema da Raízes Eventos, incluindo:
  - Gerenciamento de eventos agropecuários
  - Sistema de avaliação de viabilidade
  - Controle de usuários e permissões
  - Galeria de mídia

  ## 1. Novas Tabelas

  ### `user_profiles`
  Perfis de usuários do sistema interno
  - `id` (uuid, chave primária) - ID do usuário (vinculado ao auth.users)
  - `email` (text) - Email do usuário
  - `full_name` (text) - Nome completo
  - `role` (text) - Papel (admin, colaborador, avaliador)
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ### `events`
  Eventos organizados pela Raízes
  - `id` (uuid, chave primária) - Identificador único
  - `name` (text) - Nome do evento
  - `type` (text) - Tipo (exposicao, feira, leilao, cavalgada)
  - `description` (text) - Descrição detalhada
  - `location` (text) - Local do evento
  - `event_date` (timestamptz) - Data e horário do evento
  - `responsible_name` (text) - Nome do responsável
  - `responsible_contact` (text) - Contato do responsável
  - `image_url` (text) - URL da imagem principal
  - `observations` (text) - Observações adicionais
  - `status` (text) - Status (rascunho, publicado, concluido, cancelado)
  - `created_by` (uuid) - Usuário que criou
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ### `viability_assessments`
  Avaliações de viabilidade de eventos
  - `id` (uuid, chave primária) - Identificador único
  - `event_name` (text) - Nome do evento proposto
  - `location_adequate` (boolean) - Local adequado
  - `estimated_audience` (integer) - Estimativa de público
  - `operational_costs` (numeric) - Custos operacionais estimados
  - `estimated_revenue` (numeric) - Receita estimada
  - `local_partnerships` (boolean) - Parcerias locais disponíveis
  - `environmental_impact_score` (integer) - Impacto ambiental (0-10)
  - `location_score` (integer) - Pontuação do local (0-10)
  - `audience_score` (integer) - Pontuação do público (0-10)
  - `financial_score` (integer) - Pontuação financeira (0-10)
  - `partnership_score` (integer) - Pontuação de parcerias (0-10)
  - `total_score` (numeric) - Pontuação total
  - `viability_level` (text) - Nível de viabilidade (baixa, media, alta)
  - `notes` (text) - Observações
  - `assessed_by` (uuid) - Usuário avaliador
  - `created_at` (timestamptz) - Data de criação

  ### `gallery_media`
  Galeria de fotos e vídeos
  - `id` (uuid, chave primária) - Identificador único
  - `event_id` (uuid) - Evento relacionado (opcional)
  - `media_type` (text) - Tipo (foto, video)
  - `media_url` (text) - URL da mídia
  - `caption` (text) - Legenda
  - `display_order` (integer) - Ordem de exibição
  - `created_at` (timestamptz) - Data de criação

  ### `contact_messages`
  Mensagens do formulário de contato
  - `id` (uuid, chave primária) - Identificador único
  - `name` (text) - Nome do remetente
  - `email` (text) - Email do remetente
  - `message` (text) - Mensagem
  - `status` (text) - Status (novo, lido, respondido)
  - `created_at` (timestamptz) - Data de criação

  ## 2. Segurança (RLS)
  
  Todas as tabelas têm RLS habilitado com políticas restritivas:
  - Tabelas públicas: `events` (apenas SELECT de eventos publicados), `gallery_media`
  - Tabelas protegidas: `user_profiles`, `viability_assessments`, `contact_messages`
  - Administradores têm acesso completo
  - Colaboradores e avaliadores têm permissões específicas

  ## 3. Notas Importantes
  
  - Sistema de pontuação automática para viabilidade
  - Controle de permissões por role (admin, colaborador, avaliador)
  - Eventos têm estados de publicação
  - Galeria pode ser vinculada a eventos específicos
*/

-- Criação das tabelas

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'colaborador' CHECK (role IN ('admin', 'colaborador', 'avaliador')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('exposicao', 'feira', 'leilao', 'cavalgada')),
  description text DEFAULT '',
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  responsible_name text NOT NULL,
  responsible_contact text NOT NULL,
  image_url text DEFAULT '',
  observations text DEFAULT '',
  status text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'concluido', 'cancelado')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de avaliações de viabilidade
CREATE TABLE IF NOT EXISTS viability_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  location_adequate boolean NOT NULL DEFAULT false,
  estimated_audience integer NOT NULL DEFAULT 0,
  operational_costs numeric(10,2) NOT NULL DEFAULT 0,
  estimated_revenue numeric(10,2) NOT NULL DEFAULT 0,
  local_partnerships boolean NOT NULL DEFAULT false,
  environmental_impact_score integer NOT NULL DEFAULT 5 CHECK (environmental_impact_score >= 0 AND environmental_impact_score <= 10),
  location_score integer NOT NULL DEFAULT 0 CHECK (location_score >= 0 AND location_score <= 10),
  audience_score integer NOT NULL DEFAULT 0 CHECK (audience_score >= 0 AND audience_score <= 10),
  financial_score integer NOT NULL DEFAULT 0 CHECK (financial_score >= 0 AND financial_score <= 10),
  partnership_score integer NOT NULL DEFAULT 0 CHECK (partnership_score >= 0 AND partnership_score <= 10),
  total_score numeric(4,2) NOT NULL DEFAULT 0,
  viability_level text NOT NULL DEFAULT 'media' CHECK (viability_level IN ('baixa', 'media', 'alta')),
  notes text DEFAULT '',
  assessed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de galeria de mídia
CREATE TABLE IF NOT EXISTS gallery_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  media_type text NOT NULL CHECK (media_type IN ('foto', 'video')),
  media_url text NOT NULL,
  caption text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'lido', 'respondido')),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE viability_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para events
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (status = 'publicado');

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update all events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para viability_assessments
CREATE POLICY "Authenticated users can view assessments"
  ON viability_assessments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create assessments"
  ON viability_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = assessed_by);

CREATE POLICY "Users can update own assessments"
  ON viability_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = assessed_by)
  WITH CHECK (auth.uid() = assessed_by);

CREATE POLICY "Admins can update all assessments"
  ON viability_assessments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para gallery_media
CREATE POLICY "Public can view gallery"
  ON gallery_media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create media"
  ON gallery_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
  ON gallery_media FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete media"
  ON gallery_media FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para contact_messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update message status"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_gallery_event ON gallery_media(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_media(display_order);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_viability_level ON viability_assessments(viability_level);