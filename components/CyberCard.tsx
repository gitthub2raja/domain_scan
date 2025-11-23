'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CyberCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function CyberCard({ children, className = '', hover = true }: CyberCardProps) {
  return (
    <motion.div
      className={`hologram-effect rounded-lg p-6 ${className}`}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

