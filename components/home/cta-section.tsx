"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Calculator, PhoneCall, Zap, TrendingUp } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative px-6 py-24 sm:py-32 lg:px-8">
      {/* Background avec effet de profondeur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl">
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-accent shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Motif décoratif animé */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundImage: [
                "radial-gradient(circle at 20% 80%, white 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, white 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          {/* Étoiles animées */}
          <motion.div
            className="absolute top-10 left-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-white/20" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-white/20" />
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-white/20" />
          </motion.div>
          
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              {/* Badge animé */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2"
              >
                <Zap className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-white">Réponse instantanée</span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Prêt à <span className="text-yellow-300">optimiser</span> votre logistique ?
              </motion.h2>
              
              <motion.p 
                className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Obtenez une cotation personnalisée en quelques clics et découvrez comment 
                <span className="font-semibold text-white"> R DISTRIB SOLUTIONS </span>
                peut transformer votre chaîne d'approvisionnement.
              </motion.p>
              
              {/* Stats rapides */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mx-auto mt-8 grid grid-cols-3 gap-4 max-w-md"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2min</div>
                  <div className="text-xs text-white/70">Cotation rapide</div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-white/70">Disponibilité</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-white/70">Gratuit</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/cotation" className="block">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:shadow-xl transition-all duration-300 group h-14 px-8 text-base font-semibold"
                    >
                      <Calculator className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Obtenir une cotation
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/contact" className="block">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-xl transition-all duration-300 group h-14 px-8 text-base font-semibold backdrop-blur-sm"
                    >
                      <PhoneCall className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Nous contacter
                      <motion.span 
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Service disponible</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>+50 devis/jour</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}