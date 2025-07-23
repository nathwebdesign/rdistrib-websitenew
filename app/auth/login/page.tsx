import { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Connexion - R DISTRIB SOLUTIONS",
  description: "Connectez-vous à votre espace client R DISTRIB SOLUTIONS",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  )
}