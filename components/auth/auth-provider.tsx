"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, getCurrentUser, getUserProfile, isUserAdmin } from '@/lib/auth'
import type { UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  isAdmin: boolean
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  refreshProfile: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id)
      const adminStatus = await isUserAdmin(user.id)
      setProfile(userProfile)
      setIsAdmin(adminStatus)
    } else {
      setProfile(null)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // Vérifier l'utilisateur actuel au chargement
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.id)
          const adminStatus = await isUserAdmin(currentUser.id)
          setProfile(userProfile)
          setIsAdmin(adminStatus)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = onAuthStateChange(async (newUser) => {
      setUser(newUser)
      if (newUser) {
        const userProfile = await getUserProfile(newUser.id)
        const adminStatus = await isUserAdmin(newUser.id)
        setProfile(userProfile)
        setIsAdmin(adminStatus)
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}