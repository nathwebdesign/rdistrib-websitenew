-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Admins can view all account requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can update account requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all quotation requests" ON quotation_requests;
DROP POLICY IF EXISTS "Anyone can insert account requests" ON account_requests;
DROP POLICY IF EXISTS "Public read account requests" ON account_requests;
DROP POLICY IF EXISTS "Service role can insert quotation requests" ON quotation_requests;
DROP POLICY IF EXISTS "Users can view own quotation requests" ON quotation_requests;
DROP POLICY IF EXISTS "Read admin users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can insert quotation requests" ON quotation_requests;

-- Recréer les politiques simples sans récursion

-- 1. account_requests - permettre l'insertion publique
CREATE POLICY "Anyone can insert account requests" ON account_requests
  FOR INSERT
  WITH CHECK (true);

-- 2. account_requests - permettre la lecture publique temporairement
CREATE POLICY "Public read account requests" ON account_requests
  FOR SELECT
  USING (true);

-- 3. account_requests - permettre la mise à jour publique temporairement
CREATE POLICY "Public update account requests" ON account_requests
  FOR UPDATE
  USING (true);

-- 4. quotation_requests - permettre l'insertion publique
CREATE POLICY "Anyone can insert quotation requests" ON quotation_requests
  FOR INSERT
  WITH CHECK (true);

-- 5. quotation_requests - permettre la lecture des siennes
CREATE POLICY "Users can view own quotation requests" ON quotation_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- 6. admin_users - permettre la lecture simple
CREATE POLICY "Users read own admin status" ON admin_users
  FOR SELECT
  USING (auth.uid() = user_id);