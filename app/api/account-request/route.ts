import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Appel direct à l'API Supabase
    const response = await fetch('https://ebffmwedzkcuqqqwofrp.supabase.co/rest/v1/account_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODc0MTgsImV4cCI6MjA2ODg2MzQxOH0.rKpakv_mNLd4CkzDQ_SMyjNpgitgvnbAVif2_6DGGY4',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODc0MTgsImV4cCI6MjA2ODg2MzQxOH0.rKpakv_mNLd4CkzDQ_SMyjNpgitgvnbAVif2_6DGGY4',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    })

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
    return NextResponse.json(result[0])
    
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}