import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'
import type { UserProfile, AccountRequest } from './supabase'

// Créer un client public pour les opérations non authentifiées
const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
)

// Créer une demande de compte
export async function createAccountRequest(data: {
  email: string
  company_name?: string
  contact_person: string
  phone?: string
  address?: string
  postal_code?: string
  city?: string
  siret?: string
  message?: string
}) {
  const { data: request, error } = await publicSupabase
    .from('account_requests')
    .insert([data])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Un compte avec cet email existe déjà')
    }
    throw new Error(`Erreur lors de la création de la demande: ${error.message}`)
  }

  return request
}

// Vérifier si un utilisateur est admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !error && !!data
}

// Obtenir le profil utilisateur
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return null
  }

  return data
}

// Obtenir toutes les demandes de compte (admin seulement)
export async function getAccountRequests(): Promise<AccountRequest[]> {
  const { data, error } = await supabase
    .from('account_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erreur lors de la récupération des demandes: ${error.message}`)
  }

  return data || []
}

// Approuver une demande de compte
export async function approveAccountRequest(requestId: string, adminId: string) {
  const { data, error } = await supabase.rpc('approve_account_request', {
    p_request_id: requestId,
    p_admin_id: adminId
  })

  if (error) {
    throw new Error(`Erreur lors de l'approbation: ${error.message}`)
  }

  return data
}

// Rejeter une demande de compte
export async function rejectAccountRequest(requestId: string, adminId: string, reason: string) {
  const { data, error } = await supabase.rpc('reject_account_request', {
    p_request_id: requestId,
    p_admin_id: adminId,
    p_reason: reason
  })

  if (error) {
    throw new Error(`Erreur lors du rejet: ${error.message}`)
  }

  return data
}

// Connexion utilisateur
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(`Erreur de connexion: ${error.message}`)
  }

  return data
}

// Déconnexion
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(`Erreur de déconnexion: ${error.message}`)
  }
}

// Obtenir l'utilisateur actuel
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }

  return user
}

// Hook pour écouter les changements d'authentification
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}