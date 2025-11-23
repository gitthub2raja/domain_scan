'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'
import { CyberButton } from '@/components/CyberButton'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-6"
        >
          <FiAlertCircle className="w-24 h-24 text-cyber-neon-pink" />
        </motion.div>
        <h1 className="text-6xl font-bold text-cyber-neon-pink mb-4">404</h1>
        <p className="text-2xl text-cyber-neon-cyan mb-8">Page Not Found</p>
        <Link href="/">
          <CyberButton variant="primary">Return Home</CyberButton>
        </Link>
      </motion.div>
    </div>
  )
}

