import { Metadata } from "next"
import AccountRequestsList from "@/components/admin/account-requests-list"

export const metadata: Metadata = {
  title: "Administration - R DISTRIB SOLUTIONS",
  description: "Interface d'administration pour la gestion des comptes utilisateurs",
}

export default function AdminPage() {
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