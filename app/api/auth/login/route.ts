import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODc0MTgsImV4cCI6MjA2ODg2MzQxOH0.rKpakv_mNLd4CkzDQ_SMyjNpgitgvnbAVif2_6DGGY4'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Créer un client Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Tenter la connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('Erreur Supabase login:', error)
      
      // Vérifier si c'est un compte en attente
      const { data: accountRequest } = await supabase
        .from('account_requests')
        .select('status')
        .eq('email', email)
        .single()
        
      if (accountRequest) {
        if (accountRequest.status === 'pending') {
          return NextResponse.json(
            { error: 'Votre compte est en attente de validation' },
            { status: 403 }
          )
        } else if (accountRequest.status === 'rejected') {
          return NextResponse.json(
            { error: 'Votre demande de compte a été refusée' },
            { status: 403 }
          )
        }
      }
      
      return NextResponse.json(
        { error: error.message || 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Vérifier si c'est un admin
    let isAdmin = false
    if (data.user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
      
      isAdmin = !!adminData
    }
    
    // Créer la réponse
    const response = NextResponse.json({
      user: data.user,
      session: data.session,
      isAdmin,
      success: true
    })
    
    // Cookie simple avec les infos utilisateur
    if (data.user) {
      response.cookies.set({
        name: 'rdistrib-auth',
        value: JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          isAdmin
        }),
        httpOnly: false, // Pour que le client puisse le lire
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Erreur API login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}