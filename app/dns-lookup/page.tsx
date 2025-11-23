'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSearch, FiGlobe, FiShield, FiDownload } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'

interface DNSRecord {
  type: string
  name: string
  value: string
  ttl?: number
  priority?: number
  additional?: any
}

export default function DNSLookupPage() {
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DNSRecord[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true)
  const [scannedDomain, setScannedDomain] = useState('')

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
    setResults([])

    try {
      const response = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'DNS lookup failed')
      }

      const data = await response.json()
      setResults(data.records || [])
      setScannedDomain(domain)
    } catch (error: any) {
      console.error('DNS lookup error:', error)
      alert(`DNS lookup failed: ${error.message}`)
    } finally {
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
          <h1 className="text-4xl font-bold text-cyber-neon-cyan mb-2 flex items-center gap-3">
            <FiGlobe className="w-10 h-10" />
            DNS LOOKUP
          </h1>
          <p className="text-cyber-neon-cyan/70">Comprehensive DNS record analysis</p>
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
                  You must have explicit written permission to perform DNS lookups on any domain. 
                  Unauthorized reconnaissance is illegal and may result in criminal prosecution.
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
            <CyberButton type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiSearch className="w-5 h-5" />
                  </motion.div>
                  SCANNING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiSearch className="w-5 h-5" />
                  LOOKUP DNS RECORDS
                </span>
              )}
            </CyberButton>
          </form>
        </CyberCard>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Export Button */}
            <div className="flex justify-end mb-4">
              <CyberButton
                variant="secondary"
                onClick={() => {
                  const dataStr = JSON.stringify({ domain: scannedDomain, records: results, timestamp: new Date().toISOString() }, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `dns-lookup-${scannedDomain}-${Date.now()}.json`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                }}
              >
                <span className="flex items-center gap-2">
                  <FiDownload className="w-5 h-5" />
                  Download JSON
                </span>
              </CyberButton>
            </div>
            {/* Group results by type */}
            {['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME'].map((recordType) => {
              const typeRecords = results.filter(r => r.type === recordType)
              if (typeRecords.length === 0) return null

              return (
                <CyberCard key={recordType}>
                  <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-6">
                    {recordType} RECORDS ({typeRecords.length})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cyber-neon-cyan/30">
                          <th className="text-left py-3 px-4 text-cyber-neon-cyan">Host</th>
                          {recordType === 'MX' && (
                            <th className="text-left py-3 px-4 text-cyber-neon-cyan">Priority</th>
                          )}
                          <th className="text-left py-3 px-4 text-cyber-neon-cyan">
                            {recordType === 'MX' ? 'Exchange' : recordType === 'SOA' ? 'SOA Data' : 'Value'}
                          </th>
                          {recordType !== 'SOA' && (
                            <th className="text-left py-3 px-4 text-cyber-neon-cyan">TTL</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {typeRecords.map((record, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                          >
                            <td className="py-3 px-4 text-cyber-neon-cyan/80 font-mono text-sm">
                              {record.name}
                            </td>
                            {recordType === 'MX' && (
                              <td className="py-3 px-4 text-cyber-neon-cyan/60">
                                {record.priority || 'N/A'}
                              </td>
                            )}
                            <td className="py-3 px-4 text-cyber-neon-green font-mono text-sm break-all">
                              {record.value}
                            </td>
                            {recordType !== 'SOA' && (
                              <td className="py-3 px-4 text-cyber-neon-cyan/60">
                                {record.ttl ? `${record.ttl}s` : 'N/A'}
                              </td>
                            )}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CyberCard>
              )
            })}

            {/* Subdomains (A records that are not the main domain) */}
            {(() => {
              const subdomainRecords = results.filter(
                r => r.type === 'A' && r.name !== domain && !r.name.startsWith('www.')
              )
              if (subdomainRecords.length === 0) return null

              return (
                <CyberCard>
                  <h2 className="text-2xl font-bold text-cyber-neon-green mb-6">
                    A RECORDS (Subdomains) ({subdomainRecords.length})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cyber-neon-cyan/30">
                          <th className="text-left py-3 px-4 text-cyber-neon-cyan">Host</th>
                          <th className="text-left py-3 px-4 text-cyber-neon-cyan">IP Address</th>
                          <th className="text-left py-3 px-4 text-cyber-neon-cyan">TTL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subdomainRecords.map((record, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                          >
                            <td className="py-3 px-4 text-cyber-neon-cyan/80 font-mono text-sm">
                              {record.name}
                            </td>
                            <td className="py-3 px-4 text-cyber-neon-green font-mono text-sm">
                              {record.value}
                            </td>
                            <td className="py-3 px-4 text-cyber-neon-cyan/60">
                              {record.ttl ? `${record.ttl}s` : 'N/A'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CyberCard>
              )
            })()}
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
                <FiSearch className="w-16 h-16 text-cyber-neon-cyan" />
              </motion.div>
              <p className="text-cyber-neon-cyan">Querying DNS records...</p>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  )
}

