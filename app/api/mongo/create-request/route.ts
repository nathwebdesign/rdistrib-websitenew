import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AccountRequest from '@/models/AccountRequest'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const data = await request.json()
    
    const accountRequest = await AccountRequest.create({
      email: data.email,
      password: data.password,
      contact_person: data.contact_person,
      company_name: data.company_name,
      phone: data.phone,
      address: data.address,
      postal_code: data.postal_code,
      city: data.city,
      siret: data.siret,
      message: data.message
    })
    
    return NextResponse.json({ success: true, data: accountRequest })
  } catch (error) {
    console.error('Erreur création demande:', error)
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}