import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  try {
    // Appel direct à l'API REST de Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur Supabase:', errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des demandes', details: errorText },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('Demandes récupérées:', data)
    
    return NextResponse.json(data || [])
    
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { 
        error: 'Erreur serveur', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}