import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password } = await request.json()
    
    // Admin par défaut
    if (email === 'admin@rdistrib.fr' && password === 'admin123') {
      const response = NextResponse.json({ success: true })
      
      response.cookies.set({
        name: 'rdistrib-auth',
        value: JSON.stringify({
          id: 'admin',
          email: 'admin@rdistrib.fr',
          isAdmin: true
        }),
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      return response
    }
    
    // Chercher l'utilisateur
    const user = await User.findOne({ email })
    
    if (user && user.password === password) {
      const response = NextResponse.json({ success: true })
      
      response.cookies.set({
        name: 'rdistrib-auth',
        value: JSON.stringify({
          id: user._id,
          email: user.email,
          isAdmin: user.is_admin || false,
          profile: user.profile
        }),
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      return response
    }
    
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}