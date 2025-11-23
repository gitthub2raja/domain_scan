'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSearch, FiGlobe, FiShield, FiAlertTriangle } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'

export default function SubdomainEnumPage() {
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [subdomains, setSubdomains] = useState<Array<{ subdomain: string; ipv4: string[]; ipv6?: string[] }>>([])
  const [mxRecords, setMxRecords] = useState<Array<{ exchange: string; priority: number }>>([])
  const [txtRecords, setTxtRecords] = useState<string[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<Array<{ type: string; severity: string; description: string; recommendation: string }>>([])
  const [hasPermission, setHasPermission] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handlePermissionConfirm = () => {
    setHasPermission(true)
    setShowPermissionModal(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!hasPermission) {
      setShowPermissionModal(true)
      return
    }

    setLoading(true)
    setSubdomains([])
    setScanProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 5
      })
    }, 500)

    try {
      const response = await fetch('/api/domain-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Domain scan failed')
      }

      const data = await response.json()
      setScanProgress(100)
      setSubdomains(data.subdomains || [])
      setMxRecords(data.mxRecords || [])
      setTxtRecords(data.txtRecords || [])
      setVulnerabilities(data.vulnerabilities || [])
    } catch (error: any) {
      console.error('Subdomain enumeration error:', error)
      alert(`Subdomain enumeration failed: ${error.message}`)
    } finally {
      clearInterval(progressInterval)
      setScanProgress(0)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyber-neon-green mb-2 flex items-center gap-3">
            <FiGlobe className="w-10 h-10" />
            SUBDOMAIN ENUMERATION
          </h1>
          <p className="text-cyber-neon-cyan/70">Discover subdomains and hidden infrastructure</p>
        </motion.div>

        {/* Permission Modal */}
        {showPermissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <CyberCard className="max-w-md mx-4">
              <div className="text-center mb-6">
                <FiShield className="w-16 h-16 text-cyber-neon-pink mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-cyber-neon-pink mb-2">
                  Authorization Required
                </h2>
                <p className="text-cyber-neon-cyan/80">
                  Subdomain enumeration must only be performed on domains you own or have explicit 
                  written permission to test. Unauthorized enumeration is illegal.
                </p>
              </div>
              <div className="space-y-4">
                <CyberButton
                  variant="primary"
                  onClick={handlePermissionConfirm}
                  className="w-full"
                >
                  I Have Authorization
                </CyberButton>
                <CyberButton
                  variant="danger"
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Cancel
                </CyberButton>
              </div>
            </CyberCard>
          </motion.div>
        )}

        {/* Search Form */}
        <CyberCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CyberInput
              type="text"
              label="Domain Name"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <CyberButton type="submit" variant="secondary" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiSearch className="w-5 h-5" />
                  </motion.div>
                  SCANNING DOMAIN...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiSearch className="w-5 h-5" />
                  COMPREHENSIVE DOMAIN SCAN
                </span>
              )}
            </CyberButton>
          </form>
        </CyberCard>

        {/* MX Records */}
        {mxRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-6">
                MX RECORDS ({mxRecords.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-neon-cyan/30">
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Priority</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Exchange</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mxRecords.map((record, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                      >
                        <td className="py-3 px-4 text-cyber-neon-cyan">{record.priority}</td>
                        <td className="py-3 px-4 text-cyber-neon-green font-mono">{record.exchange}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CyberCard>
          </motion.div>
        )}

        {/* TXT Records */}
        {txtRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-6">
                TXT RECORDS ({txtRecords.length})
              </h2>
              <div className="space-y-2">
                {txtRecords.map((record, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-cyber-darker/50 border border-cyber-neon-cyan/30 rounded-md"
                  >
                    <p className="text-cyber-neon-green font-mono text-sm break-all">{record}</p>
                  </motion.div>
                ))}
              </div>
            </CyberCard>
          </motion.div>
        )}

        {/* Subdomains with IP Addresses */}
        {subdomains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-green mb-6">
                DISCOVERED SUBDOMAINS ({subdomains.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-neon-cyan/30">
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Subdomain</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subdomains.map((subdomain, index) => (
                      <motion.tr
                        key={subdomain.subdomain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                      >
                        <td className="py-3 px-4 text-cyber-neon-green font-mono text-sm">
                          {subdomain.subdomain}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {subdomain.ipv4.map((ip, ipIndex) => (
                              <span key={ipIndex} className="block text-cyber-neon-cyan font-mono text-sm">
                                {ip}
                              </span>
                            ))}
                            {subdomain.ipv6 && subdomain.ipv6.map((ip, ipIndex) => (
                              <span key={ipIndex} className="block text-cyber-neon-blue font-mono text-sm">
                                {ip}
                              </span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CyberCard>
          </motion.div>
        )}

        {/* Vulnerabilities */}
        {vulnerabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-pink mb-6 flex items-center gap-2">
                <FiAlertTriangle className="w-6 h-6" />
                VULNERABILITIES ({vulnerabilities.length})
              </h2>
              <div className="space-y-4">
                {vulnerabilities.map((vuln, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-md border-2 ${
                      vuln.severity === 'critical'
                        ? 'border-cyber-neon-pink bg-cyber-neon-pink/10'
                        : vuln.severity === 'high'
                        ? 'border-cyber-neon-pink/70 bg-cyber-neon-pink/5'
                        : vuln.severity === 'medium'
                        ? 'border-cyber-neon-cyan/70 bg-cyber-neon-cyan/5'
                        : 'border-cyber-neon-cyan/50 bg-cyber-neon-cyan/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-cyber-neon-cyan">{vuln.type}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        vuln.severity === 'critical' || vuln.severity === 'high'
                          ? 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                          : 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan'
                      }`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-cyber-neon-cyan/80 mb-2">{vuln.description}</p>
                    <p className="text-cyber-neon-green text-sm">
                      <strong>Recommendation:</strong> {vuln.recommendation}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CyberCard>
          </motion.div>
        )}

        {loading && (
          <CyberCard>
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <FiSearch className="w-16 h-16 text-cyber-neon-green" />
              </motion.div>
              <p className="text-cyber-neon-cyan mb-2">Performing comprehensive domain intelligence scan...</p>
              <p className="text-cyber-neon-cyan/60 text-sm mb-4">
                Scanning subdomains, DNS records, and vulnerabilities...
              </p>
              <div className="mt-4 w-full bg-cyber-darker rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-neon-green"
                  initial={{ width: '0%' }}
                  animate={{ width: scanProgress + '%' }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                />
              </div>
              <p className="text-cyber-neon-cyan/60 text-xs mt-2">
                This may take 1-3 minutes depending on network conditions...
              </p>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  )
}

