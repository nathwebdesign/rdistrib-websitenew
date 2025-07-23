import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  const data = await request.json()
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/account_requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      contact_person: data.contact_person,
      company_name: data.company_name,
      phone: data.phone,
      address: data.address,
      postal_code: data.postal_code,
      city: data.city,
      siret: data.siret,
      message: data.message,
      status: 'pending'
    })
  })
  
  if (!response.ok) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}