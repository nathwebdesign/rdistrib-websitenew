-- Create users table for approved accounts
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile JSONB,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add columns to account_requests for tracking
ALTER TABLE account_requests 
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS processed_by VARCHAR(255);

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role can manage users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);