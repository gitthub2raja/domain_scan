'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiShield, FiLock, FiMail } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        // In a real app, this would be an API call
        localStorage.setItem('auth_token', 'demo_token_' + Date.now())
        router.push('/dashboard')
      } else {
        setError('Please fill in all fields')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CyberCard>
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <FiShield className="w-16 h-16 text-cyber-neon-cyan" />
              </motion.div>
              <h1 className="text-3xl font-bold text-cyber-neon-cyan mb-2">
                SECURE ACCESS
              </h1>
              <p className="text-cyber-neon-cyan/70">
                Enter your credentials to access the portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <CyberInput
                  type="email"
                  label="Email Address"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <CyberInput
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-cyber-neon-pink/20 border border-cyber-neon-pink rounded-md text-cyber-neon-pink"
                >
                  {error}
                </motion.div>
              )}

              <CyberButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN'}
              </CyberButton>

              <div className="text-center">
                <p className="text-cyber-neon-cyan/70">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-cyber-neon-green hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  )
}

