"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Stocker la session dans le localStorage pour Supabase
      if (data.session && data.session.access_token) {
        // Stocker les tokens dans le localStorage comme Supabase le fait
        localStorage.setItem('sb-ebffmwedzkcuqqqwofrp-auth-token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
          user: data.user
        }))
        
        // Attendre un peu pour que le storage se propage
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      } else {
        throw new Error('Pas de session retournée')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <LogIn className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-bold text-center mb-2">Connexion</h2>
          <p className="text-center text-white/90">
            Accédez à votre espace client
          </p>
        </div>
        
        <div className="p-8">

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
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
                Connexion...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </span>
            )}
          </Button>
        </motion.div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:text-primary/80 transition-colors duration-200">
            Faire une demande
          </Link>
        </p>
      </div>
        </div>
      </div>
    </motion.div>
  )
}