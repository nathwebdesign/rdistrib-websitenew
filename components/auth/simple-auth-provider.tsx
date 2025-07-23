"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  isAdmin: boolean
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  logout: () => {}
})

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Lire le cookie au chargement
    const checkAuth = () => {
      try {
        // Récupérer le cookie rdistrib-auth
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('rdistrib-auth='))
          
        if (authCookie) {
          const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]))
          setUser(authData)
          setIsAdmin(authData.isAdmin || false)
        }
      } catch (error) {
        console.error('Erreur lecture auth:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const logout = async () => {
    // Supprimer le cookie
    document.cookie = 'rdistrib-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(null)
    setIsAdmin(false)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSimpleAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider')
  }
  return context
}