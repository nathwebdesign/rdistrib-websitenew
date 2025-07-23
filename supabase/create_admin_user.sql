-- Remplacez 'votre-email@example.com' par votre email
-- et 'votre-user-id' par l'ID de votre utilisateur Supabase

-- Pour trouver votre user ID :
-- 1. Allez dans Authentication > Users dans Supabase
-- 2. Trouvez votre utilisateur et copiez son ID

-- Exemple pour créer un admin
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'REMPLACEZ-PAR-VOTRE-USER-ID', -- Copiez l'ID depuis le dashboard Supabase
  'super_admin',
  '{"manage_users": true, "manage_quotations": true, "manage_settings": true}'::jsonb
);

-- Pour voir tous les utilisateurs et leurs IDs :
SELECT id, email FROM auth.users;