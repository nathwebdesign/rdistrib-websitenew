"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireApproved?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireApproved = true 
}: ProtectedRouteProps) {
  const { user, profile, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push('/dashboard')
        return
      }

      if (requireApproved && profile?.account_status !== 'approved') {
        router.push('/account-pending')
        return
      }
    }
  }, [user, profile, isAdmin, loading, requireAdmin, requireApproved, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  if (requireApproved && profile?.account_status !== 'approved') {
    return null
  }

  return <>{children}</>
}