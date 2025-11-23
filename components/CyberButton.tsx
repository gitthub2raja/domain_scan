'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CyberButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function CyberButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: CyberButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-md font-semibold transition-all duration-300 relative overflow-hidden circuit-line'
  
  const variantClasses = {
    primary: 'bg-cyber-neon-cyan/20 text-cyber-neon-cyan border border-cyber-neon-cyan/50 hover:bg-cyber-neon-cyan/30 hover:border-cyber-neon-cyan',
    secondary: 'bg-cyber-neon-green/20 text-cyber-neon-green border border-cyber-neon-green/50 hover:bg-cyber-neon-green/30 hover:border-cyber-neon-green',
    danger: 'bg-cyber-neon-pink/20 text-cyber-neon-pink border border-cyber-neon-pink/50 hover:bg-cyber-neon-pink/30 hover:border-cyber-neon-pink',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

