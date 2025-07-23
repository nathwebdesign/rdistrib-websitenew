-- Add password field to account_requests table
ALTER TABLE account_requests 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update the existing insert policy to allow the password field
DROP POLICY IF EXISTS "Anyone can insert account requests" ON account_requests;

CREATE POLICY "Anyone can insert account requests" ON account_requests
  FOR INSERT
  WITH CHECK (true);