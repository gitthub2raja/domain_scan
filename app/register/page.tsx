'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiShield, FiUser, FiLock, FiMail } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreed) {
      setError('You must agree to the terms and conditions')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    // Simulate registration
    setTimeout(() => {
      if (formData.username && formData.email && formData.password) {
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
                <FiShield className="w-16 h-16 text-cyber-neon-green" />
              </motion.div>
              <h1 className="text-3xl font-bold text-cyber-neon-green mb-2">
                CREATE ACCOUNT
              </h1>
              <p className="text-cyber-neon-cyan/70">
                Join the Cyber Recon Portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CyberInput
                type="text"
                label="Username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />

              <CyberInput
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <CyberInput
                type="password"
                label="Password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <CyberInput
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-cyber-darker border-cyber-neon-cyan/50 rounded focus:ring-cyber-neon-cyan"
                />
                <label htmlFor="agree" className="text-sm text-cyber-neon-cyan/80">
                  I agree to use this portal only for authorized security testing and 
                  acknowledge that unauthorized scanning is illegal.
                </label>
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
                variant="secondary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
              </CyberButton>

              <div className="text-center">
                <p className="text-cyber-neon-cyan/70">
                  Already have an account?{' '}
                  <Link href="/login" className="text-cyber-neon-cyan hover:underline">
                    Login here
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

