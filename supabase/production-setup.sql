-- CONFIGURATION PRODUCTION COMPLÈTE

-- 1. Nettoyer les tables existantes
DROP TABLE IF EXISTS account_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Créer la table account_requests
CREATE TABLE account_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  postal_code VARCHAR(20),
  city VARCHAR(100),
  siret VARCHAR(50),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Créer la table users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile JSONB,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Activer RLS
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Politiques pour account_requests
-- Tout le monde peut créer une demande
CREATE POLICY "allow_insert_requests" ON account_requests
  FOR INSERT
  WITH CHECK (true);

-- Tout le monde peut voir toutes les demandes (pour l'instant)
CREATE POLICY "allow_select_requests" ON account_requests
  FOR SELECT
  USING (true);

-- Tout le monde peut mettre à jour (pour l'instant)
CREATE POLICY "allow_update_requests" ON account_requests
  FOR UPDATE
  USING (true);

-- 6. Politiques pour users
CREATE POLICY "allow_all_users" ON users
  FOR ALL
  USING (true);

-- 7. Insérer le compte admin
INSERT INTO users (email, password, profile)
VALUES (
  'admin@rdistrib.fr',
  'admin123',
  '{"contact_person": "Administrateur", "company_name": "R DISTRIB SOLUTIONS"}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- 8. Index pour les performances
CREATE INDEX idx_account_requests_email ON account_requests(email);
CREATE INDEX idx_account_requests_status ON account_requests(status);
CREATE INDEX idx_users_email ON users(email);