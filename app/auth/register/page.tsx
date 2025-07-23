import { Metadata } from "next"
import AccountRequestForm from "@/components/auth/account-request-form"

export const metadata: Metadata = {
  title: "Demande de compte - R DISTRIB SOLUTIONS",
  description: "Créez votre compte professionnel pour accéder à nos services de transport et logistique",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center py-12 px-6">
      <div className="w-full">
        <AccountRequestForm />
      </div>
    </div>
  )
}