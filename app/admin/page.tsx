"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "@/components/auth/simple-auth-provider"
import AccountRequestsList from "@/components/admin/account-requests-list"

export default function AdminPage() {
  const { user, isAdmin, loading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    // Rediriger si pas admin
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si pas admin, ne rien afficher (la redirection va se faire)
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">
            Gestion des demandes de création de compte
          </p>
        </div>
        
        <AccountRequestsList />
      </div>
    </div>
  )
}