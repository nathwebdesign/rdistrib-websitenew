import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  try {
    // Test 1: Vérifier la connexion
    const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })
    
    const tablesText = await tablesResponse.text()
    
    // Test 2: Essayer de récupérer les account_requests
    const requestsResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      },
    })
    
    const requestsData = await requestsResponse.json()
    const totalCount = requestsResponse.headers.get('content-range')
    
    // Test 3: Insérer une demande de test
    const testData = {
      email: 'test@example.com',
      password: 'password123',
      contact_person: 'Test User',
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/account_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    })
    
    const insertResult = await insertResponse.json()
    
    return NextResponse.json({
      connection: 'OK',
      tables: tablesText.substring(0, 200) + '...',
      requests: {
        status: requestsResponse.status,
        data: requestsData,
        count: totalCount
      },
      testInsert: {
        status: insertResponse.status,
        result: insertResult
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}