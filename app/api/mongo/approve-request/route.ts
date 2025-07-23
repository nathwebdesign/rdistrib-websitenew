import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AccountRequest from '@/models/AccountRequest'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { requestId } = await request.json()
    
    // Récupérer la demande
    const accountRequest = await AccountRequest.findById(requestId)
    
    if (!accountRequest) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
    }
    
    // Créer l'utilisateur
    await User.create({
      email: accountRequest.email,
      password: accountRequest.password,
      profile: {
        contact_person: accountRequest.contact_person,
        company_name: accountRequest.company_name,
        phone: accountRequest.phone,
        address: accountRequest.address,
        postal_code: accountRequest.postal_code,
        city: accountRequest.city,
        siret: accountRequest.siret
      }
    })
    
    // Mettre à jour le statut
    accountRequest.status = 'approved'
    await accountRequest.save()
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erreur approbation:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}