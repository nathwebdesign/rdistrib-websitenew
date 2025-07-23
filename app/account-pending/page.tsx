import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compte en attente - R DISTRIB SOLUTIONS",
  description: "Votre compte est en cours de validation",
}

export default function AccountPendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Compte en cours de validation
          </h1>
          
          <p className="text-gray-600 mb-6">
            Votre demande de création de compte a bien été reçue et est actuellement en cours d'examen 
            par notre équipe. Vous recevrez un email de confirmation dès que votre compte sera activé.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Délai habituel :</strong> 24-48h ouvrées<br />
              <strong>Contact :</strong> Pour toute question, contactez-nous au 01 48 16 35 14
            </p>
          </div>
          
          <div className="space-y-3">
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Nous contacter
            </a>
            <br />
            <a
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}