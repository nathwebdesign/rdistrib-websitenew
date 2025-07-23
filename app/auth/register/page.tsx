import { Metadata } from "next"
import AccountRequestForm from "@/components/auth/account-request-form"

export const metadata: Metadata = {
  title: "Demande de compte - R DISTRIB SOLUTIONS",
  description: "Créez votre compte professionnel pour accéder à nos services de transport et logistique",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <AccountRequestForm />
      </div>
    </div>
  )
}