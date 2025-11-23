'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSearch, FiActivity, FiShield } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'

interface Port {
  port: number
  state: 'open' | 'closed' | 'filtered'
  service: string
  version?: string
}

type ScanMode = 'quick' | 'standard' | 'comprehensive' | 'stealth'

export default function PortScannerPage() {
  const router = useRouter()
  const [target, setTarget] = useState('')
  const [scanMode, setScanMode] = useState<ScanMode>('standard')
  const [loading, setLoading] = useState(false)
  const [ports, setPorts] = useState<Port[]>([])
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

  const scanModes: { value: ScanMode; label: string; description: string }[] = [
    { value: 'quick', label: 'Quick Scan', description: 'Top 100 ports, fast' },
    { value: 'standard', label: 'Standard Scan', description: 'Top 1000 ports, balanced' },
    { value: 'comprehensive', label: 'Comprehensive', description: 'All 65535 ports, thorough' },
    { value: 'stealth', label: 'Stealth Scan', description: 'SYN scan, less detectable' },
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!hasPermission) {
      setShowPermissionModal(true)
      return
    }

    setLoading(true)
    setPorts([])

    // Simulate port scanning based on mode
    setTimeout(() => {
      const basePorts: Port[] = [
        { port: 22, state: 'open', service: 'SSH', version: 'OpenSSH 8.2' },
        { port: 80, state: 'open', service: 'HTTP', version: 'nginx/1.18' },
        { port: 443, state: 'open', service: 'HTTPS', version: 'nginx/1.18' },
        { port: 3306, state: 'open', service: 'MySQL', version: '8.0.25' },
        { port: 8080, state: 'open', service: 'HTTP-Proxy' },
        { port: 21, state: 'filtered', service: 'FTP' },
        { port: 25, state: 'closed', service: 'SMTP' },
        { port: 53, state: 'open', service: 'DNS' },
        { port: 135, state: 'filtered', service: 'MSRPC' },
        { port: 139, state: 'closed', service: 'NetBIOS' },
        { port: 445, state: 'open', service: 'SMB', version: 'Samba 4.12' },
        { port: 1433, state: 'open', service: 'MSSQL', version: '2019' },
      ]

      let mockPorts: Port[] = []
      if (scanMode === 'quick') {
        mockPorts = basePorts.slice(0, 5)
      } else if (scanMode === 'standard') {
        mockPorts = basePorts
      } else {
        mockPorts = basePorts.concat(
          Array.from({ length: 20 }, (_, i) => ({
            port: 5000 + i,
            state: 'closed' as const,
            service: 'Unknown',
          }))
        )
      }

      setPorts(mockPorts)
      setLoading(false)
    }, scanMode === 'comprehensive' ? 5000 : 3000)
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyber-neon-pink mb-2 flex items-center gap-3">
            <FiActivity className="w-10 h-10" />
            PORT SCANNER
          </h1>
          <p className="text-cyber-neon-cyan/70">Advanced Nmap-based port scanning</p>
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
                  Port scanning must only be performed on systems you own or have explicit 
                  written permission to scan. Unauthorized port scanning is illegal and may 
                  be considered a criminal offense.
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

        {/* Scan Form */}
        <CyberCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CyberInput
              type="text"
              label="Target (IP or Domain)"
              placeholder="192.168.1.1 or example.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />

            <div>
              <label className="block mb-3 text-cyber-neon-cyan text-sm font-semibold">
                Scan Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanModes.map((mode) => (
                  <motion.button
                    key={mode.value}
                    type="button"
                    onClick={() => setScanMode(mode.value)}
                    className={`p-4 rounded-md border-2 transition-all text-left ${
                      scanMode === mode.value
                        ? 'border-cyber-neon-pink bg-cyber-neon-pink/20'
                        : 'border-cyber-neon-cyan/30 hover:border-cyber-neon-cyan/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-bold text-cyber-neon-cyan mb-1">{mode.label}</div>
                    <div className="text-sm text-cyber-neon-cyan/70">{mode.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <CyberButton type="submit" variant="danger" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiActivity className="w-5 h-5" />
                  </motion.div>
                  SCANNING PORTS...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiActivity className="w-5 h-5" />
                  START SCAN
                </span>
              )}
            </CyberButton>
          </form>
        </CyberCard>

        {/* Results */}
        {ports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-pink mb-6">
                SCAN RESULTS ({ports.length} ports)
              </h2>
              <div className="mb-4 flex gap-4 text-sm">
                <span className="text-cyber-neon-green">
                  Open: {ports.filter(p => p.state === 'open').length}
                </span>
                <span className="text-cyber-neon-pink">
                  Filtered: {ports.filter(p => p.state === 'filtered').length}
                </span>
                <span className="text-cyber-neon-cyan">
                  Closed: {ports.filter(p => p.state === 'closed').length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-neon-cyan/30">
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Port</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">State</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Service</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ports.map((port, index) => (
                      <motion.tr
                        key={port.port}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                      >
                        <td className="py-3 px-4 text-cyber-neon-green font-mono font-bold">
                          {port.port}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            port.state === 'open'
                              ? 'bg-cyber-neon-green/20 text-cyber-neon-green'
                              : port.state === 'filtered'
                              ? 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                              : 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan'
                          }`}>
                            {port.state.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/80">{port.service}</td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/60 text-sm">
                          {port.version || 'N/A'}
                        </td>
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
                <FiActivity className="w-16 h-16 text-cyber-neon-pink" />
              </motion.div>
              <p className="text-cyber-neon-cyan">Scanning ports with {scanMode} mode...</p>
              <div className="mt-4 w-full bg-cyber-darker rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-neon-pink"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: scanMode === 'comprehensive' ? 5 : 3, ease: 'linear' }}
                />
              </div>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  )
}

