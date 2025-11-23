'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiShield, FiSearch, FiActivity, FiGlobe, FiTarget, FiFileText } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberCard } from '@/components/CyberCard'

export default function Home() {
  const features = [
    {
      icon: FiSearch,
      title: 'DNS Lookup',
      description: 'Comprehensive DNS record analysis and resolution',
      href: '/dns-lookup',
      color: 'text-cyber-neon-cyan',
    },
    {
      icon: FiGlobe,
      title: 'Subdomain Enumeration',
      description: 'Discover subdomains and hidden infrastructure',
      href: '/subdomain-enum',
      color: 'text-cyber-neon-green',
    },
    {
      icon: FiActivity,
      title: 'Host Discovery',
      description: 'Network host identification and mapping',
      href: '/host-discovery',
      color: 'text-cyber-neon-blue',
    },
    {
      icon: FiTarget,
      title: 'Attack Surface Mapping',
      description: 'Visual representation of exposed services',
      href: '/attack-surface',
      color: 'text-cyber-neon-purple',
    },
    {
      icon: FiShield,
      title: 'Port Scanner',
      description: 'Advanced Nmap-based port scanning',
      href: '/port-scanner',
      color: 'text-cyber-neon-pink',
    },
    {
      icon: FiFileText,
      title: 'Reports',
      description: 'Generate and export security reports',
      href: '/reports',
      color: 'text-cyber-neon-cyan',
    },
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 20px rgba(0, 255, 255, 0.5)',
                '0 0 40px rgba(0, 255, 65, 0.8)',
                '0 0 20px rgba(0, 255, 255, 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-8xl font-bold mb-4 text-cyber-neon-cyan"
          >
            CYBER RECON
          </motion.div>
          <p className="text-xl md:text-2xl text-cyber-neon-cyan/80 mb-8">
            Authorized Domain Intelligence & Security Reconnaissance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <CyberButton variant="primary">Get Started</CyberButton>
            </Link>
            <Link href="/register">
              <CyberButton variant="secondary">Create Account</CyberButton>
            </Link>
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <CyberCard className="border-2 border-cyber-neon-pink/50">
            <div className="flex items-start space-x-4">
              <FiShield className="w-6 h-6 text-cyber-neon-pink flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-cyber-neon-pink mb-2">
                  Legal & Ethical Use Only
                </h3>
                <p className="text-cyber-neon-cyan/80">
                  This portal is designed for authorized security testing and reconnaissance activities only. 
                  Users must have explicit permission to scan or analyze any target systems. Unauthorized access 
                  or scanning of systems without permission is illegal and strictly prohibited.
                </p>
              </div>
            </div>
          </CyberCard>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={feature.href}>
                  <CyberCard hover>
                    <div className="flex flex-col items-center text-center">
                      <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                      <h3 className="text-xl font-bold text-cyber-neon-cyan mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-cyber-neon-cyan/70">
                        {feature.description}
                      </p>
                    </div>
                  </CyberCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

