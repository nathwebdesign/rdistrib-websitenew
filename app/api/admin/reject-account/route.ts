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
    
    const { requestId, reason } = await request.json()
    
    const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
    
    // Mettre à jour le statut de la demande
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?id=eq.${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        status: 'rejected',
        rejection_reason: reason
      })
    })
    
    if (!updateResponse.ok) {
      throw new Error('Erreur lors de la mise à jour du statut')
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erreur rejet:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du rejet' },
      { status: 500 }
    )
  }
}