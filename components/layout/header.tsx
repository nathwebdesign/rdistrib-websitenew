"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Menu, X, LogIn, Calculator, User, LogOut, Settings, ShieldCheck } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Logo } from "@/components/ui/logo"
import { motion, AnimatePresence } from "framer-motion"
import { useSimpleAuth } from "@/components/auth/simple-auth-provider"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAdmin, logout } = useSimpleAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    logout()
    setUserMenuOpen(false)
  }

  return (
    <motion.header 
      className="fixed w-full bg-white/90 backdrop-blur-lg z-50 shadow-sm border-b border-white/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Logo 
            size="xl" 
            showBackground 
            variant="default"
            className="transform transition-all duration-300 hover:drop-shadow-lg scale-125 scale-x-[1.5]"
          />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                href={item.href}
                className="relative px-4 py-2 text-xl font-semibold leading-6 text-gray-900 transition-all duration-300 group"
              >
                <motion.span 
                  className="relative z-10"
                  whileHover={{ scale: 1.1, color: "#2563eb" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.name}
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg scale-x-0 group-hover:scale-x-100 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="hidden lg:flex lg:flex-1 lg:justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
              >
                <User className="w-5 h-5 text-primary" />
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-primary mt-1">Administrateur</p>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Mon compte
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShieldCheck className="w-4 h-4 mr-3" />
                          Administration
                        </Link>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/cotation">
                  <AnimatedButton>
                    Obtenir une cotation
                  </AnimatedButton>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login">
                  <button className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium transition duration-300 ease-out border-2 border-primary rounded-lg hover:bg-primary">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-primary duration-300 -translate-x-full group-hover:translate-x-0 group-hover:text-white ease">
                      <LogIn className="w-5 h-5" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-primary transition-all duration-300 transform group-hover:translate-x-full group-hover:text-white ease">
                      <LogIn className="w-5 h-5 mr-2" />
                      Connexion
                    </span>
                    <span className="relative invisible flex items-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Connexion
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Logo 
                size="md" 
                showBackground 
                variant="default"
              />
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link href="/cotation" className="block">
                    <AnimatedButton className="w-full">Obtenir une cotation</AnimatedButton>
                  </Link>
                  {user && (
                    <div className="mt-4 space-y-2">
                      <Link href="/dashboard" className="block text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                        Mon compte
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="block text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                  {!user && (
                    <div className="mt-4">
                      <Link href="/auth/login" className="block text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                        Connexion
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  )
}