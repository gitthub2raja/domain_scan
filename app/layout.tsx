import type { Metadata } from 'next'
import './globals.css'
import { CyberBackground } from '@/components/CyberBackground'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Cyber Recon Portal',
  description: 'Authorized domain intelligence gathering and security reconnaissance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CyberBackground />
        <Navigation />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}

