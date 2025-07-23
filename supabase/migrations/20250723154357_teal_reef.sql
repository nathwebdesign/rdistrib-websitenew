/*
  # Système de comptes utilisateurs avec validation administrateur

  1. Nouvelles Tables
    - `user_profiles` - Profils utilisateurs étendus
    - `account_requests` - Demandes de création de compte
    - `admin_users` - Utilisateurs administrateurs
    - `email_notifications` - Log des emails envoyés

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour utilisateurs authentifiés et administrateurs
    - Triggers pour notifications automatiques

  3. Fonctionnalités
    - Workflow d'approbation des comptes
    - Notifications email automatiques
    - Gestion des rôles (user, admin)
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  contact_person text NOT NULL,
  phone text,
  address text,
  postal_code text,
  city text,
  siret text,
  account_status text DEFAULT 'pending' CHECK (account_status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des demandes de création de compte
CREATE TABLE IF NOT EXISTS account_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  company_name text,
  contact_person text NOT NULL,
  phone text,
  address text,
  postal_code text,
  city text,
  siret text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  processed_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '{"manage_users": true, "view_analytics": true}',
  created_at timestamptz DEFAULT now()
);

-- Table des notifications email
CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  template_name text NOT NULL,
  template_data jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Politiques pour account_requests
CREATE POLICY "Anyone can create account request"
  ON account_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all requests"
  ON account_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update requests"
  ON account_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Politiques pour admin_users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Politiques pour email_notifications
CREATE POLICY "Admins can view email notifications"
  ON email_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Fonction pour créer un profil utilisateur après inscription
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, contact_person, account_status)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'contact_person', 'Utilisateur'), 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Fonction pour envoyer une notification email
CREATE OR REPLACE FUNCTION send_email_notification(
  p_recipient_email text,
  p_subject text,
  p_template_name text,
  p_template_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO email_notifications (recipient_email, subject, template_name, template_data)
  VALUES (p_recipient_email, p_subject, p_template_name, p_template_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour approuver un compte
CREATE OR REPLACE FUNCTION approve_account_request(
  p_request_id uuid,
  p_admin_id uuid
)
RETURNS boolean AS $$
DECLARE
  request_record account_requests;
  new_user_id uuid;
BEGIN
  -- Récupérer la demande
  SELECT * INTO request_record
  FROM account_requests
  WHERE id = p_request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Créer l'utilisateur dans auth.users (simulation - en réalité fait via Supabase Auth)
  -- Mettre à jour le statut de la demande
  UPDATE account_requests
  SET 
    status = 'approved',
    processed_by = p_admin_id,
    processed_at = now()
  WHERE id = p_request_id;
  
  -- Envoyer email de confirmation
  PERFORM send_email_notification(
    request_record.email,
    'Votre compte R DISTRIB SOLUTIONS a été approuvé',
    'account_approved',
    jsonb_build_object(
      'contact_person', request_record.contact_person,
      'company_name', request_record.company_name
    )
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour rejeter un compte
CREATE OR REPLACE FUNCTION reject_account_request(
  p_request_id uuid,
  p_admin_id uuid,
  p_reason text
)
RETURNS boolean AS $$
DECLARE
  request_record account_requests;
BEGIN
  -- Récupérer la demande
  SELECT * INTO request_record
  FROM account_requests
  WHERE id = p_request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mettre à jour le statut de la demande
  UPDATE account_requests
  SET 
    status = 'rejected',
    processed_by = p_admin_id,
    processed_at = now(),
    rejection_reason = p_reason
  WHERE id = p_request_id;
  
  -- Envoyer email de rejet
  PERFORM send_email_notification(
    request_record.email,
    'Votre demande de compte R DISTRIB SOLUTIONS',
    'account_rejected',
    jsonb_build_object(
      'contact_person', request_record.contact_person,
      'company_name', request_record.company_name,
      'reason', p_reason
    )
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour notifier les admins des nouvelles demandes
CREATE OR REPLACE FUNCTION notify_admins_new_request()
RETURNS TRIGGER AS $$
DECLARE
  admin_email text;
BEGIN
  -- Envoyer notification à tous les admins
  FOR admin_email IN 
    SELECT au.email 
    FROM admin_users au
    JOIN auth.users u ON au.user_id = u.id
  LOOP
    PERFORM send_email_notification(
      admin_email,
      'Nouvelle demande de compte - R DISTRIB SOLUTIONS',
      'admin_new_request',
      jsonb_build_object(
        'contact_person', NEW.contact_person,
        'company_name', NEW.company_name,
        'email', NEW.email,
        'request_id', NEW.id
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_account_request
  AFTER INSERT ON account_requests
  FOR EACH ROW EXECUTE FUNCTION notify_admins_new_request();

-- Insérer un admin par défaut (à modifier avec un vrai email)
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"manage_users": true, "view_analytics": true, "manage_admins": true}'
FROM auth.users 
WHERE email = 'admin@rdistrib-solutions.fr'
ON CONFLICT (user_id) DO NOTHING;