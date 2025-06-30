/*
  # Création des souscriptions et contrats

  1. Nouvelles tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence profiles)
      - `lead_id` (text, ID du lead Neoliane)
      - `subscription_id` (text, ID de souscription Neoliane)
      - `product_name` (text)
      - `formula_name` (text)
      - `monthly_price` (decimal)
      - `status` (enum: draft, pending, active, cancelled)
      - `date_effect` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contracts`
      - `id` (uuid, primary key)
      - `subscription_id` (uuid, référence subscriptions)
      - `contract_id` (text, ID du contrat Neoliane)
      - `gamme_id` (text)
      - `formula_id` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Les utilisateurs peuvent voir leurs propres données
*/

-- Type enum pour le statut des souscriptions
CREATE TYPE subscription_status AS ENUM ('draft', 'pending', 'active', 'cancelled');

-- Créer la table des souscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id text,
  subscription_id text,
  product_name text NOT NULL,
  formula_name text NOT NULL,
  monthly_price decimal(10,2) NOT NULL DEFAULT 0,
  status subscription_status DEFAULT 'draft',
  date_effect date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des contrats
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  contract_id text NOT NULL,
  gamme_id text NOT NULL,
  formula_id text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Politiques pour subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques pour contracts
CREATE POLICY "Users can view own contracts"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own contracts"
  ON contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own contracts"
  ON contracts
  FOR UPDATE
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Triggers pour updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_contracts_subscription_id ON contracts(subscription_id);