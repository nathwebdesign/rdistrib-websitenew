import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
  
  try {
    // Test direct sans aucune complexité
    const url = `${SUPABASE_URL}/rest/v1/account_requests?select=*`
    console.log('Fetching from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    
    const text = await response.text()
    console.log('Response text:', text)
    
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      return NextResponse.json({
        error: 'Invalid JSON response',
        responseText: text,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    }
    
    return NextResponse.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      data: data,
      status: response.status
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN2hJu4I8'
  
  try {
    // Créer une demande de test
    const testData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      contact_person: 'Test User',
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/account_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    })
    
    const text = await response.text()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: response.ok ? JSON.parse(text) : text,
      testData: testData
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}