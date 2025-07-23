import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/account_requests?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  )
  
  const data = await response.json()
  return NextResponse.json(data)
}