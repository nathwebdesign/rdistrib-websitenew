import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Tentative de connexion pour:', email)
    
    const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
    
    // Gestion spéciale pour le compte admin
    if (email === 'admin@rdistrib.fr' && password === 'admin123') {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin-id',
          email: 'admin@rdistrib.fr',
          profile: {
            contact_person: 'Administrateur',
            company_name: 'R DISTRIB SOLUTIONS'
          }
        }
      })
      
      response.cookies.set({
        name: 'rdistrib-auth',
        value: JSON.stringify({
          id: 'admin-id',
          email: 'admin@rdistrib.fr',
          isAdmin: true,
          profile: {
            contact_person: 'Administrateur',
            company_name: 'R DISTRIB SOLUTIONS'
          }
        }),
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      return response
    }
    
    // 1. Vérifier dans la table users
    const usersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    
    if (!usersResponse.ok) {
      throw new Error('Erreur lors de la vérification')
    }
    
    const users = await usersResponse.json()
    console.log('Utilisateurs trouvés:', users.length)
    
    if (users.length > 0) {
      const user = users[0]
      console.log('Vérification du mot de passe pour:', user.email)
      
      // Vérifier le mot de passe (simple comparaison pour l'instant)
      if (user.password === password) {
        // Vérifier si c'est un admin
        const isAdmin = email === 'admin@rdistrib.fr'
        
        // Créer la réponse
        const response = NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            profile: user.profile
          }
        })
        
        // Cookie avec les infos utilisateur
        response.cookies.set({
          name: 'rdistrib-auth',
          value: JSON.stringify({
            id: user.id,
            email: user.email,
            isAdmin,
            profile: user.profile
          }),
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 jours
        })
        
        return response
      }
    }
    
    // 2. Si pas trouvé dans users, vérifier dans account_requests
    const requestsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/account_requests?email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    
    if (requestsResponse.ok) {
      const requests = await requestsResponse.json()
      if (requests.length > 0) {
        const request = requests[0]
        if (request.status === 'pending') {
          return NextResponse.json(
            { error: 'Votre compte est en attente de validation' },
            { status: 403 }
          )
        } else if (request.status === 'rejected') {
          return NextResponse.json(
            { error: `Votre demande a été refusée : ${request.rejection_reason || 'Aucune raison spécifiée'}` },
            { status: 403 }
          )
        }
      }
    }
    
    return NextResponse.json(
      { error: 'Email ou mot de passe incorrect' },
      { status: 401 }
    )
    
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}