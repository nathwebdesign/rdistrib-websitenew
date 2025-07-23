-- Créer la table quotation_requests
CREATE TABLE IF NOT EXISTS quotation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  contact_name TEXT NOT NULL,
  phone TEXT,
  trajet TEXT NOT NULL,
  zone JSONB NOT NULL,
  pole TEXT,
  articles JSONB NOT NULL,
  transport JSONB NOT NULL,
  pricing JSONB NOT NULL,
  selected_delivery TEXT NOT NULL,
  options JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur user_id pour améliorer les performances
CREATE INDEX idx_quotation_requests_user_id ON quotation_requests(user_id);

-- Créer un index sur created_at pour le tri
CREATE INDEX idx_quotation_requests_created_at ON quotation_requests(created_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres demandes
CREATE POLICY "Users can view own quotation requests" ON quotation_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique pour permettre aux admins de voir toutes les demandes
CREATE POLICY "Admins can view all quotation requests" ON quotation_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Politique pour permettre l'insertion avec service role
CREATE POLICY "Service role can insert quotation requests" ON quotation_requests
  FOR INSERT
  WITH CHECK (true);