import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  try {
    // Appel direct à l'API REST de Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/account_requests?select=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Data:', data)
    
    return NextResponse.json({
      status: response.status,
      data: data,
      count: Array.isArray(data) ? data.length : 0,
      serviceKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      serviceKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }, { status: 500 })
  }
}