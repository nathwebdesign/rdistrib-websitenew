import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const SUPABASE_URL = 'https://ebffmwedzkcuqqqwofrp.supabase.co'
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZmZtd2VkemtjdXFxcXdvZnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI4NzQxOCwiZXhwIjoyMDY4ODYzNDE4fQ.-2xR2yJQYwm40gEcapRGPFNPaSSiyMnpIaVN6hJu4I8'
    
    // Créer le compte admin dans la table users
    const adminData = {
      email: 'admin@rdistrib.fr',
      password: 'admin123', // Mot de passe par défaut
      profile: {
        contact_person: 'Administrateur',
        company_name: 'R DISTRIB SOLUTIONS'
      },
      is_approved: true,
      created_at: new Date().toISOString()
    }
    
    // Vérifier si l'admin existe déjà
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.admin@rdistrib.fr`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    
    const existingAdmin = await checkResponse.json()
    
    if (existingAdmin && existingAdmin.length > 0) {
      return NextResponse.json({ 
        message: 'Le compte admin existe déjà',
        email: 'admin@rdistrib.fr',
        password: 'Utilisez le mot de passe existant'
      })
    }
    
    // Créer le compte admin
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(adminData)
    })
    
    if (!createResponse.ok) {
      const error = await createResponse.text()
      return NextResponse.json({ 
        error: 'Erreur lors de la création du compte admin',
        details: error
      }, { status: 500 })
    }
    
    const result = await createResponse.json()
    
    return NextResponse.json({ 
      message: 'Compte admin créé avec succès',
      email: 'admin@rdistrib.fr',
      password: 'admin123',
      note: 'Changez ce mot de passe dès que possible'
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}