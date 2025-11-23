'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiTarget, FiShield, FiGlobe } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberInput } from '@/components/CyberInput'
import { CyberCard } from '@/components/CyberCard'

interface Service {
  host: string
  port: number
  service: string
  version: string
  status: 'open' | 'filtered' | 'closed'
}

export default function AttackSurfacePage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (services.length > 0 && canvasRef.current) {
      drawNetworkGraph()
    }
  }, [services])

  const handlePermissionConfirm = () => {
    setHasPermission(true)
    setShowPermissionModal(false)
  }

  const drawNetworkGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = 400

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw network nodes
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 3

    // Central node (domain)
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw service nodes
    services.forEach((service, index) => {
      const angle = (index / services.length) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Connection line
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Service node
      const color = service.status === 'open' 
        ? 'rgba(0, 255, 65, 0.8)' 
        : 'rgba(255, 0, 128, 0.8)'
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, Math.PI * 2)
      ctx.fill()

      // Port label
      ctx.fillStyle = 'rgba(0, 255, 255, 0.9)'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${service.port}`, x, y - 25)
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!hasPermission) {
      setShowPermissionModal(true)
      return
    }

    setLoading(true)
    setServices([])

    // Simulate attack surface mapping
    setTimeout(() => {
      const mockServices: Service[] = [
        { host: domain, port: 22, service: 'SSH', version: 'OpenSSH 8.2', status: 'open' },
        { host: domain, port: 80, service: 'HTTP', version: 'nginx/1.18', status: 'open' },
        { host: domain, port: 443, service: 'HTTPS', version: 'nginx/1.18', status: 'open' },
        { host: domain, port: 3306, service: 'MySQL', version: '8.0.25', status: 'open' },
        { host: domain, port: 8080, service: 'HTTP-Proxy', version: 'Apache/2.4', status: 'open' },
        { host: domain, port: 21, service: 'FTP', version: 'vsftpd 3.0', status: 'filtered' },
      ]
      setServices(mockServices)
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
          <h1 className="text-4xl font-bold text-cyber-neon-purple mb-2 flex items-center gap-3">
            <FiTarget className="w-10 h-10" />
            ATTACK SURFACE MAPPING
          </h1>
          <p className="text-cyber-neon-cyan/70">Visual representation of exposed services</p>
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
                  Attack surface mapping must only be performed on systems you own or have explicit 
                  written permission to analyze. Unauthorized mapping is illegal.
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
              label="Domain or IP Address"
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
                    <FiTarget className="w-5 h-5" />
                  </motion.div>
                  MAPPING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiTarget className="w-5 h-5" />
                  MAP ATTACK SURFACE
                </span>
              )}
            </CyberButton>
          </form>
        </CyberCard>

        {/* Visual Network Graph */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-purple mb-6">NETWORK TOPOLOGY</h2>
              <canvas
                ref={canvasRef}
                className="w-full border border-cyber-neon-cyan/30 rounded-md"
              />
            </CyberCard>
          </motion.div>
        )}

        {/* Services List */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-purple mb-6">
                EXPOSED SERVICES ({services.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-neon-cyan/30">
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Host</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Port</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Service</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Version</th>
                      <th className="text-left py-3 px-4 text-cyber-neon-cyan">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <motion.tr
                        key={`${service.host}-${service.port}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-cyber-neon-cyan/10 hover:bg-cyber-neon-cyan/5"
                      >
                        <td className="py-3 px-4 text-cyber-neon-green font-mono">{service.host}</td>
                        <td className="py-3 px-4 text-cyber-neon-cyan">{service.port}</td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/80">{service.service}</td>
                        <td className="py-3 px-4 text-cyber-neon-cyan/60 text-sm">{service.version}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            service.status === 'open'
                              ? 'bg-cyber-neon-green/20 text-cyber-neon-green'
                              : service.status === 'filtered'
                              ? 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                              : 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan'
                          }`}>
                            {service.status.toUpperCase()}
                          </span>
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
                <FiTarget className="w-16 h-16 text-cyber-neon-purple" />
              </motion.div>
              <p className="text-cyber-neon-cyan">Analyzing attack surface...</p>
              <div className="mt-4 w-full bg-cyber-darker rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-neon-purple"
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

