"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "@/components/auth/simple-auth-provider"

export default function DashboardPage() {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue {user?.email} !
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nouvelle cotation
              </h3>
              <p className="text-gray-600 mb-4">
                Obtenez un devis instantané pour vos transports
              </p>
              <a
                href="/cotation"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Calculer un tarif
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mes expéditions
              </h3>
              <p className="text-gray-600 mb-4">
                Suivez vos commandes en cours
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Voir mes expéditions
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mon profil
              </h3>
              <p className="text-gray-600 mb-4">
                Gérez vos informations personnelles
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Modifier mon profil
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}