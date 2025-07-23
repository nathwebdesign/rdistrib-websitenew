import { createClient } from '@supabase/supabase-js'

// Fonction pour créer le client Supabase de manière dynamique
export function getSupabaseClient() {
  // Récupérer les variables depuis window pour s'assurer qu'elles sont disponibles côté client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODc0MTgsImV4cCI6MjA2ODg2MzQxOH0.rKpakv_mNLd4CkzDQ_SMyjNpgitgvnbAVif2_6DGGY4'
  
  return createClient(supabaseUrl, supabaseAnonKey)
}