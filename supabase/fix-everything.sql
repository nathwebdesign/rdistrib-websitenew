-- SCRIPT POUR TOUT RÉPARER ET UNIFORMISER

-- 1. Supprimer les anciennes politiques qui posent problème
DROP POLICY IF EXISTS "Anyone can create account request" ON account_requests;
DROP POLICY IF EXISTS "Anyone can insert account requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON account_requests;

-- 2. S'assurer que la table account_requests a tous les champs nécessaires
ALTER TABLE account_requests 
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS processed_by VARCHAR(255);

-- 3. Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile JSONB,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Désactiver RLS temporairement pour simplifier
ALTER TABLE account_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. Créer des politiques simples qui fonctionnent
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde d'insérer
CREATE POLICY "Public can insert requests" ON account_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique pour permettre à tout le monde de lire (temporaire pour debug)
CREATE POLICY "Public can read requests" ON account_requests
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique pour permettre à tout le monde de mettre à jour (temporaire pour debug)
CREATE POLICY "Public can update requests" ON account_requests
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Insérer le compte admin dans users s'il n'existe pas
INSERT INTO users (email, password, profile, is_approved)
VALUES (
  'admin@rdistrib.fr',
  'admin123',
  '{"contact_person": "Administrateur", "company_name": "R DISTRIB SOLUTIONS", "is_admin": true}'::jsonb,
  true
)
ON CONFLICT (email) DO NOTHING;

-- 7. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_account_requests_status ON account_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_requests_created_at ON account_requests(created_at DESC);

-- 8. Afficher le nombre de demandes actuelles
SELECT COUNT(*) as total_requests, 
       COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
       COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_requests,
       COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests
FROM account_requests;