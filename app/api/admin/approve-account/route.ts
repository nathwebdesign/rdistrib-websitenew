import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const cookieStore = cookies()
    const authCookie = cookieStore.get('rdistrib-auth')
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    const authData = JSON.parse(authCookie.value)
    if (!authData.isAdmin) {
      return NextResponse.json({ error: 'Non autorisé - Admin requis' }, { status: 403 })
    }
    
    const { requestId } = await request.json()
    
    const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
    
    // 1. Récupérer la demande
    const getResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?id=eq.${requestId}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })
    
    if (!getResponse.ok) {
      throw new Error('Demande introuvable')
    }
    
    const [accountRequest] = await getResponse.json()
    if (!accountRequest) {
      throw new Error('Demande introuvable')
    }
    
    // 2. Créer l'utilisateur dans la table users
    const userData = {
      email: accountRequest.email,
      password: accountRequest.password || 'temporaryPassword123', // Utiliser le mot de passe fourni
      profile: {
        contact_person: accountRequest.contact_person,
        company_name: accountRequest.company_name,
        phone: accountRequest.phone,
        address: accountRequest.address,
        postal_code: accountRequest.postal_code,
        city: accountRequest.city,
        siret: accountRequest.siret
      },
      is_approved: true,
      created_at: new Date().toISOString()
    }
    
    const createUserResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(userData)
    })
    
    if (!createUserResponse.ok) {
      const error = await createUserResponse.text()
      console.error('Erreur création utilisateur:', error)
      // Continuer même si la création échoue (l'utilisateur existe peut-être déjà)
    }
    
    // 3. Mettre à jour le statut de la demande
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?id=eq.${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        status: 'approved'
      })
    })
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('Erreur update status:', errorText)
      console.error('Update URL:', `${SUPABASE_URL}/rest/v1/account_requests?id=eq.${requestId}`)
      throw new Error(`Erreur lors de la mise à jour du statut: ${errorText}`)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erreur approbation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'approbation' },
      { status: 500 }
    )
  }
}