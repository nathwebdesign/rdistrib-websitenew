import { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Connexion - R DISTRIB SOLUTIONS",
  description: "Connectez-vous à votre espace client R DISTRIB SOLUTIONS",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center py-12 px-6">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}