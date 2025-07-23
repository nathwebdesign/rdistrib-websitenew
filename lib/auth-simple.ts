// Solution simple pour l'authentification sans le client Supabase problématique

import { cookies } from 'next/headers'

export interface SimpleUser {
  id: string
  email: string
  isAdmin: boolean
  profile?: any
}

// Stocker l'utilisateur dans un cookie simple
export function setAuthCookie(user: SimpleUser) {
  const cookieStore = cookies()
  cookieStore.set('rdistrib-auth', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 jours
  })
}

// Récupérer l'utilisateur depuis le cookie
export function getAuthCookie(): SimpleUser | null {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('rdistrib-auth')
    if (authCookie) {
      return JSON.parse(authCookie.value)
    }
  } catch (error) {
    console.error('Erreur lecture cookie:', error)
  }
  return null
}

// Supprimer le cookie
export function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete('rdistrib-auth')
}