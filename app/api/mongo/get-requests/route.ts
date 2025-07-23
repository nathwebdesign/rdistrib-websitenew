import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AccountRequest from '@/models/AccountRequest'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const requests = await AccountRequest.find({}).sort({ created_at: -1 })
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Erreur récupération demandes:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}