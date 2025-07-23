"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
// Suppression de l'import createAccountRequest

export default function AccountRequestForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
    contact_person: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    siret: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/account-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Votre demande de création de compte a bien été reçue. Vous recevrez un email de confirmation 
            et nous vous contacterons dès que votre compte aura été validé par notre équipe.
          </p>
          <p className="text-sm text-gray-500">
            Délai de traitement habituel : 24-48h ouvrées
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Demande de création de compte</h2>
        <p className="text-gray-600">
          Remplissez ce formulaire pour demander l'accès à votre espace client R DISTRIB SOLUTIONS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du contact *
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email professionnel *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Minimum 8 caractères"
          />
          <p className="mt-1 text-sm text-gray-500">
            Ce mot de passe sera utilisé pour vous connecter une fois votre compte approuvé
          </p>
        </div>

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
              SIRET
            </label>
            <input
              type="text"
              id="siret"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
              Code postal
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message (optionnel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Décrivez brièvement vos besoins en transport..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800 text-sm">
            <strong>Information :</strong> Votre demande sera examinée par notre équipe dans les 24-48h ouvrées. 
            Vous recevrez un email de confirmation une fois votre compte validé.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Envoyer la demande
              </span>
            )}
          </Button>
        </motion.div>
      </form>
        </div>
      </div>
    </motion.div>
  )
}