'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSearch, FiActivity, FiShield } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'

interface Host {
  ip: string
  hostname: string
  status: 'online' | 'offline'
  responseTime: number
}

export default function HostDiscoveryPage() {
  const router = useRouter()
  const [network, setNetwork] = useState('')
  const [loading, setLoading] = useState(false)
  const [hosts, setHosts] = useState<Host[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true)

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
    setHosts([])

    // Simulate host discovery
    setTimeout(() => {
      const mockHosts: Host[] = [
        { ip: '192.168.1.1', hostname: 'gateway.local', status: 'online', responseTime: 12 },
        { ip: '192.168.1.10', hostname: 'server-01.local', status: 'online', responseTime: 8 },
        { ip: '192.168.1.20', hostname: 'workstation-01.local', status: 'online', responseTime: 15 },
        { ip: '192.168.1.30', hostname: 'printer.local', status: 'online', responseTime: 25 },
        { ip: '192.168.1.50', hostname: 'nas.local', status: 'online', responseTime: 10 },
      ]
      setHosts(mockHosts)
      setLoading(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyber-neon-blue mb-2 flex items-center gap-3">
            <FiActivity className="w-10 h-10" />
            HOST DISCOVERY
          </h1>
          <p className="text-cyber-neon-cyan/70">Network host identification and mapping</p>
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
                  Host discovery must only be performed on networks you own or have explicit 
                  written permission to scan. Unauthorized network scanning is illegal.
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
              label="Network Range (CIDR)"
              placeholder="192.168.1.0/24"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              required
            />
            <CyberButton type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiActivity className="w-5 h-5" />
                  </motion.div>
                  DISCOVERING HOSTS...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiActivity className="w-5 h-5" />
                  START DISCOVERY
                </span>
              )}
            </CyberButton>
          </form>
        </CyberCard>

        {/* Results */}
        {hosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-blue mb-6">
                DISCOVERED HOSTS ({hosts.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-neon-cyan/30">
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">IP Address</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Hostname</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Status</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hosts.map((host, index) => (
                      <motion.tr
                        key={host.ip}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                      >
                        <td className="py-3 px-4 text-cyber-neon-green font-mono">{host.ip}</td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/80">{host.hostname}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            host.status === 'online'
                              ? 'bg-cyber-neon-green/20 text-cyber-neon-green'
                              : 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                          }`}>
                            {host.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/60">{host.responseTime}ms</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
                <FiActivity className="w-16 h-16 text-cyber-neon-blue" />
              </motion.div>
              <p className="text-cyber-neon-cyan">Scanning network for active hosts...</p>
              <div className="mt-4 w-full bg-cyber-darker rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-neon-blue"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </div>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  )
}

