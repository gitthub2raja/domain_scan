'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiActivity, FiTarget, FiShield, FiTrendingUp } from 'react-icons/fi'
import { CyberCard } from '@/components/CyberCard'
import Link from 'next/link'
import { CyberButton } from '@/components/CyberButton'

export default function Dashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const stats = [
    { label: 'Total Scans', value: '127', icon: FiActivity, color: 'text-cyber-neon-cyan' },
    { label: 'Active Targets', value: '23', icon: FiTarget, color: 'text-cyber-neon-green' },
    { label: 'Vulnerabilities', value: '8', icon: FiShield, color: 'text-cyber-neon-pink' },
    { label: 'Success Rate', value: '94%', icon: FiTrendingUp, color: 'text-cyber-neon-blue' },
  ]

  const quickActions = [
    { title: 'DNS Lookup', href: '/dns-lookup', color: 'border-cyber-neon-cyan' },
    { title: 'Subdomain Enum', href: '/subdomain-enum', color: 'border-cyber-neon-green' },
    { title: 'Port Scanner', href: '/port-scanner', color: 'border-cyber-neon-blue' },
    { title: 'Attack Surface', href: '/attack-surface', color: 'border-cyber-neon-purple' },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyber-neon-cyan mb-2">DASHBOARD</h1>
          <p className="text-cyber-neon-cyan/70">Welcome back to your command center</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard className="scan-radar">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyber-neon-cyan/70 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-cyber-neon-cyan">{stat.value}</p>
                    </div>
                    <Icon className={`w-12 h-12 ${stat.color}`} />
                  </div>
                </CyberCard>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <CyberCard hover className={`border-2 ${action.color}`}>
                    <h3 className="text-lg font-bold text-cyber-neon-cyan text-center">
                      {action.title}
                    </h3>
                  </CyberCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <CyberCard>
          <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-cyber-darker/50 rounded-md border border-cyber-neon-cyan/20"
              >
                <div>
                  <p className="text-cyber-neon-cyan font-semibold">DNS Lookup - example.com</p>
                  <p className="text-cyber-neon-cyan/60 text-sm">2 hours ago</p>
                </div>
                <span className="px-3 py-1 bg-cyber-neon-green/20 text-cyber-neon-green rounded-md text-sm">
                  Completed
                </span>
              </motion.div>
            ))}
          </div>
        </CyberCard>
      </div>
    </div>
  )
}

