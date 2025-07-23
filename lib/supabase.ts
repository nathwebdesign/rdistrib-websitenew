import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface UserProfile {
  id: string
  user_id: string
  company_name?: string
  contact_person: string
  phone?: string
  address?: string
  postal_code?: string
  city?: string
  siret?: string
  account_status: 'pending' | 'approved' | 'rejected' | 'suspended'
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface AccountRequest {
  id: string
  email: string
  company_name?: string
  contact_person: string
  phone?: string
  address?: string
  postal_code?: string
  city?: string
  siret?: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  processed_by?: string
  processed_at?: string
  rejection_reason?: string
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  permissions: Record<string, boolean>
  created_at: string
}

export interface EmailNotification {
  id: string
  recipient_email: string
  subject: string
  template_name: string
  template_data: Record<string, any>
  status: 'pending' | 'sent' | 'failed'
  sent_at?: string
  error_message?: string
  created_at: string
}