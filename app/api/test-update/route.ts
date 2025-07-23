import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  try {
    // 1. Récupérer une demande en pending
    const getResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?status=eq.pending&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })
    
    const requests = await getResponse.json()
    
    if (!requests || requests.length === 0) {
      return NextResponse.json({ message: 'Aucune demande en attente' })
    }
    
    const request = requests[0]
    
    // 2. Tester une mise à jour simple
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?id=eq.${request.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        status: 'approved'
      })
    })
    
    const updateResult = await updateResponse.text()
    
    return NextResponse.json({
      request: request,
      updateStatus: updateResponse.status,
      updateResult: updateResult,
      headers: Object.fromEntries(updateResponse.headers.entries())
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}