'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiShield, FiMenu, FiX } from 'react-icons/fi'

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
  }, [])

  const navItems = [
    { href: '/', label: 'Home', auth: false },
    { href: '/login', label: 'Login', auth: false, hideWhenAuth: true },
    { href: '/register', label: 'Register', auth: false, hideWhenAuth: true },
    { href: '/dashboard', label: 'Dashboard', auth: true },
    { href: '/dns-lookup', label: 'DNS Lookup', auth: true },
    { href: '/subdomain-enum', label: 'Subdomain Enum', auth: true },
    { href: '/host-discovery', label: 'Host Discovery', auth: true },
    { href: '/attack-surface', label: 'Attack Surface', auth: true },
    { href: '/port-scanner', label: 'Port Scanner', auth: true },
    { href: '/reports', label: 'Reports', auth: true },
  ]

  const visibleItems = navItems.filter(item => {
    if (item.auth && !isAuthenticated) return false
    if (item.hideWhenAuth && isAuthenticated) return false
    return true
  })

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-neon-cyan/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-cyber-neon-cyan text-glow">
            <FiShield className="w-6 h-6" />
            <span className="text-xl font-bold">CYBER RECON</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  pathname === item.href
                    ? 'hologram-effect text-cyber-neon-green'
                    : 'text-cyber-neon-cyan hover:text-cyber-neon-green hover:bg-cyber-neon-cyan/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token')
                  setIsAuthenticated(false)
                  window.location.href = '/'
                }}
                className="px-4 py-2 rounded-md text-cyber-neon-pink hover:bg-cyber-neon-pink/10 transition-all"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-cyber-neon-cyan hover:text-cyber-neon-green transition-colors"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-cyber-neon-cyan/30">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md transition-all ${
                  pathname === item.href
                    ? 'hologram-effect text-cyber-neon-green'
                    : 'text-cyber-neon-cyan hover:text-cyber-neon-green hover:bg-cyber-neon-cyan/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token')
                  setIsAuthenticated(false)
                  setIsMenuOpen(false)
                  window.location.href = '/'
                }}
                className="block w-full text-left px-4 py-2 rounded-md text-cyber-neon-pink hover:bg-cyber-neon-pink/10"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

