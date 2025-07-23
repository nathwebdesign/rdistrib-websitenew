import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODc0MTgsImV4cCI6MjA2ODg2MzQxOH0.rKpakv_mNLd4CkzDQ_SMyjNpgitgvnbAVif2_6DGGY4'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Données reçues:', data)
    
    // S'assurer que tous les champs requis sont présents
    const requestData = {
      email: data.email || '',
      contact_person: data.contact_person || '',
      company_name: data.company_name || null,
      phone: data.phone || null,
      address: data.address || null,
      postal_code: data.postal_code || null,
      city: data.city || null,
      siret: data.siret || null,
      message: data.message || null,
      status: 'pending'
    }
    
    console.log('Données formatées:', requestData)
    
    // Appel direct à l'API Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/account_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(requestData)
    })
    
    console.log('Réponse status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('Erreur Supabase:', error)
      
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'Un compte avec cet email existe déjà' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de la création de la demande' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Résultat:', result)
    
    // Retourner le premier élément du tableau ou l'objet directement
    return NextResponse.json(Array.isArray(result) ? result[0] : result)
    
  } catch (error) {
    console.error('Erreur API complète:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}