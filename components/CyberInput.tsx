'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-cyber-neon-cyan text-sm font-semibold">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-cyber-darker/50 border border-cyber-neon-cyan/30 
            rounded-md text-cyber-neon-cyan placeholder-cyber-neon-cyan/50
            focus:outline-none focus:border-cyber-neon-cyan focus:ring-2 
            focus:ring-cyber-neon-cyan/50 transition-all duration-300
            hover:border-cyber-neon-cyan/50
            ${error ? 'border-cyber-neon-pink' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-cyber-neon-pink">{error}</p>
        )}
      </div>
    )
  }
)

CyberInput.displayName = 'CyberInput'

