import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN2hJu4I8'
  
  try {
    // 1. Vérifier les demandes de compte
    const requestsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/account_requests?order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    
    const requests = await requestsResponse.json()
    
    // 2. Vérifier les users
    const usersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    
    const users = await usersResponse.json()
    
    // 3. Compter les demandes par statut
    const stats = {
      total_requests: requests.length,
      pending: requests.filter((r: any) => r.status === 'pending').length,
      approved: requests.filter((r: any) => r.status === 'approved').length,
      rejected: requests.filter((r: any) => r.status === 'rejected').length,
      total_users: users.length
    }
    
    return NextResponse.json({
      success: true,
      stats,
      recent_requests: requests.slice(0, 5).map((r: any) => ({
        id: r.id,
        email: r.email,
        status: r.status,
        created_at: r.created_at,
        contact_person: r.contact_person
      })),
      users: users.map((u: any) => ({
        email: u.email,
        created_at: u.created_at
      }))
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}