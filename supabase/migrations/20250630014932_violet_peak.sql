/*
  # Création des documents

  1. Nouvelles tables
    - `documents`
      - `id` (uuid, primary key)
      - `subscription_id` (uuid, référence subscriptions)
      - `type` (text, type de document: BA, SEPA, MANDAT_RESILIATION)
      - `filename` (text)
      - `content` (text, base64)
      - `uploaded_at` (timestamp)

    - `api_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence profiles)
      - `endpoint` (text)
      - `method` (text)
      - `status_code` (integer)
      - `response_time` (integer)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Les utilisateurs peuvent voir leurs propres documents
*/

-- Créer la table des documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('BA', 'SEPA', 'MANDAT_RESILIATION', 'PREFILLED')),
  filename text NOT NULL,
  content text, -- Base64 encoded content
  file_size integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

-- Créer la table des logs API (pour monitoring)
CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer,
  response_time integer, -- en millisecondes
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour documents
CREATE POLICY "Users can view own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Politiques pour api_logs
CREATE POLICY "Users can view own api logs"
  ON api_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own api logs"
  ON api_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Index pour les performances
CREATE INDEX idx_documents_subscription_id ON documents(subscription_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);