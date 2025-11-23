'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiFileText, FiDownload, FiTrash2, FiEye } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'
import { CyberCard } from '@/components/CyberCard'

interface Report {
  id: string
  title: string
  type: string
  target: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  data: any
}

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Load mock reports
    const mockReports: Report[] = [
      {
        id: '1',
        title: 'DNS Lookup - example.com',
        type: 'DNS Lookup',
        target: 'example.com',
        date: new Date().toISOString(),
        status: 'completed',
        data: { records: 7 },
      },
      {
        id: '2',
        title: 'Port Scan - 192.168.1.1',
        type: 'Port Scanner',
        target: '192.168.1.1',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        data: { ports: 12 },
      },
      {
        id: '3',
        title: 'Subdomain Enum - example.com',
        type: 'Subdomain Enum',
        target: 'example.com',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        data: { subdomains: 15 },
      },
    ]
    setReports(mockReports)
  }, [router])

  const handleExport = (report: Report, format: 'json' | 'csv' | 'txt') => {
    let content = ''
    let filename = `${report.title.replace(/\s+/g, '_')}.${format}`

    if (format === 'json') {
      content = JSON.stringify(report, null, 2)
    } else if (format === 'csv') {
      content = `Report ID,Title,Type,Target,Date,Status\n${report.id},${report.title},${report.type},${report.target},${report.date},${report.status}`
    } else {
      content = `Report: ${report.title}\nType: ${report.type}\nTarget: ${report.target}\nDate: ${new Date(report.date).toLocaleString()}\nStatus: ${report.status}\n\nData:\n${JSON.stringify(report.data, null, 2)}`
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: string) => {
    setReports(reports.filter(r => r.id !== id))
    if (selectedReport?.id === id) {
      setSelectedReport(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
            <FiFileText className="w-10 h-10" />
            REPORTS
          </h1>
          <p className="text-cyber-neon-cyan/70">View and export your scan reports</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <CyberCard>
              <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-6">
                SCAN REPORTS ({reports.length})
              </h2>
              {reports.length === 0 ? (
                <div className="text-center py-12 text-cyber-neon-cyan/60">
                  <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No reports available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-md border-2 transition-all cursor-pointer ${
                        selectedReport?.id === report.id
                          ? 'border-cyber-neon-cyan bg-cyber-neon-cyan/10'
                          : 'border-cyber-neon-cyan/30 hover:border-cyber-neon-cyan/50 hover:bg-cyber-neon-cyan/5'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-cyber-neon-cyan mb-1">
                            {report.title}
                          </h3>
                          <p className="text-sm text-cyber-neon-cyan/70 mb-2">
                            {report.type} • {report.target}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-cyber-neon-cyan/60">
                            <span>{formatDate(report.date)}</span>
                            <span className={`px-2 py-1 rounded ${
                              report.status === 'completed'
                                ? 'bg-cyber-neon-green/20 text-cyber-neon-green'
                                : report.status === 'pending'
                                ? 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan'
                                : 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                            }`}>
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(report, 'json')
                            }}
                            className="p-2 text-cyber-neon-cyan hover:bg-cyber-neon-cyan/10 rounded transition-colors"
                            title="Export JSON"
                          >
                            <FiDownload className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(report.id)
                            }}
                            className="p-2 text-cyber-neon-pink hover:bg-cyber-neon-pink/10 rounded transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CyberCard>
          </div>

          {/* Report Details */}
          <div>
            {selectedReport ? (
              <CyberCard>
                <h2 className="text-2xl font-bold text-cyber-neon-cyan mb-6">REPORT DETAILS</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-cyber-neon-cyan/70">Title</label>
                    <p className="text-cyber-neon-cyan font-semibold">{selectedReport.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-cyber-neon-cyan/70">Type</label>
                    <p className="text-cyber-neon-cyan">{selectedReport.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-cyber-neon-cyan/70">Target</label>
                    <p className="text-cyber-neon-green font-mono">{selectedReport.target}</p>
                  </div>
                  <div>
                    <label className="text-sm text-cyber-neon-cyan/70">Date</label>
                    <p className="text-cyber-neon-cyan/80">{formatDate(selectedReport.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-cyber-neon-cyan/70">Status</label>
                    <p className={`inline-block px-2 py-1 rounded text-sm ${
                      selectedReport.status === 'completed'
                        ? 'bg-cyber-neon-green/20 text-cyber-neon-green'
                        : 'bg-cyber-neon-pink/20 text-cyber-neon-pink'
                    }`}>
                      {selectedReport.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-cyber-neon-cyan/70 mb-2 block">Data</label>
                  <pre className="p-4 bg-cyber-darker rounded-md border border-cyber-neon-cyan/30 overflow-auto text-xs text-cyber-neon-green font-mono">
                    {JSON.stringify(selectedReport.data, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-cyber-neon-cyan/70 mb-2">Export Format</p>
                  <div className="grid grid-cols-3 gap-2">
                    <CyberButton
                      variant="primary"
                      onClick={() => handleExport(selectedReport, 'json')}
                      className="text-xs py-2"
                    >
                      JSON
                    </CyberButton>
                    <CyberButton
                      variant="secondary"
                      onClick={() => handleExport(selectedReport, 'csv')}
                      className="text-xs py-2"
                    >
                      CSV
                    </CyberButton>
                    <CyberButton
                      variant="primary"
                      onClick={() => handleExport(selectedReport, 'txt')}
                      className="text-xs py-2"
                    >
                      TXT
                    </CyberButton>
                  </div>
                </div>
              </CyberCard>
            ) : (
              <CyberCard>
                <div className="text-center py-12 text-cyber-neon-cyan/60">
                  <FiEye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a report to view details</p>
                </div>
              </CyberCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

