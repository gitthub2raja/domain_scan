import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)
const resolve6 = promisify(dns.resolve6)
const resolveMx = promisify(dns.resolveMx)
const resolveTxt = promisify(dns.resolveTxt)
const resolveNs = promisify(dns.resolveNs)

interface SubdomainInfo {
  subdomain: string
  ipv4: string[]
  ipv6?: string[]
}

interface Vulnerability {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendation: string
}

// Comprehensive subdomain wordlist
const SUBDOMAIN_WORDLIST = [
  'www', 'mail', 'ftp', 'admin', 'api', 'blog', 'cdn', 'dev', 'staging', 'test',
  'secure', 'vpn', 'portal', 'docs', 'support', 'webmail', 'imap', 'smtp', 'pop',
  'ns1', 'ns2', 'mx', 'www2', 'shop', 'store', 'app', 'mobile', 'm', 'old',
  'new', 'beta', 'alpha', 'demo', 'staging2', 'test2', 'backup', 'db', 'mysql',
  'postgres', 'redis', 'cache', 'static', 'assets', 'media', 'images', 'img',
  'video', 'videos', 'download', 'downloads', 'files', 'file', 'upload', 'uploads',
  'share', 'shared', 'public', 'private', 'web', 'web2', 'www3', 'mail2', 'smtp2',
  'imap2', 'pop3', 'exchange', 'owa', 'autodiscover', 'lync', 'skype', 'teams',
  'connect', 'openvpn', 'vpn1', 'vpn2', 'remote', 'rdp', 'ssh', 'telnet',
]

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    const results: {
      domain: string
      mxRecords: Array<{ exchange: string; priority: number }>
      txtRecords: string[]
      subdomains: SubdomainInfo[]
      vulnerabilities: Vulnerability[]
    } = {
      domain,
      mxRecords: [],
      txtRecords: [],
      subdomains: [],
      vulnerabilities: [],
    }

    // Get MX Records for main domain
    try {
      const mxRecords = await resolveMx(domain)
      results.mxRecords = mxRecords.map(r => ({
        exchange: r.exchange,
        priority: r.priority,
      }))
    } catch (error) {
      // No MX records
    }

    // Get TXT Records for main domain
    try {
      const txtRecords = await resolveTxt(domain)
      results.txtRecords = txtRecords.map(r => 
        Array.isArray(r) ? r.join(' ') : r
      )
    } catch (error) {
      // No TXT records
    }

    // Subdomain enumeration with IP addresses
    const foundSubdomains = new Map<string, SubdomainInfo>()
    const batchSize = 50
    const timeout = 2000

    for (let i = 0; i < SUBDOMAIN_WORDLIST.length; i += batchSize) {
      const batch = SUBDOMAIN_WORDLIST.slice(i, i + batchSize)
      
      const promises = batch.map(async (subdomain) => {
        const subdomainName = `${subdomain}.${domain}`
        
        if (foundSubdomains.has(subdomainName)) {
          return
        }

        try {
          const ipv4Promise = resolve4(subdomainName)
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
          
          const ipv4Records = await Promise.race([ipv4Promise, timeoutPromise]) as string[]

          if (ipv4Records && ipv4Records.length > 0) {
            const info: SubdomainInfo = {
              subdomain: subdomainName,
              ipv4: ipv4Records,
            }

            // Try IPv6
            try {
              const ipv6Promise = resolve6(subdomainName)
              const ipv6TimeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
              )
              const ipv6Records = await Promise.race([ipv6Promise, ipv6TimeoutPromise]) as string[]
              if (ipv6Records && ipv6Records.length > 0) {
                info.ipv6 = ipv6Records
              }
            } catch (error) {
              // No IPv6
            }

            foundSubdomains.set(subdomainName, info)
          }
        } catch (error) {
          // Subdomain doesn't exist
        }
      })

      await Promise.allSettled(promises)
    }

    results.subdomains = Array.from(foundSubdomains.values()).sort((a, b) => 
      a.subdomain.localeCompare(b.subdomain)
    )

    // Vulnerability Scanning
    const vulnerabilities: Vulnerability[] = []

    // Check for missing security headers (SPF, DMARC, DKIM)
    const hasSpf = results.txtRecords.some(txt => txt.includes('v=spf1'))
    if (!hasSpf) {
      vulnerabilities.push({
        type: 'Missing SPF Record',
        severity: 'high',
        description: 'No SPF (Sender Policy Framework) record found. This allows email spoofing.',
        recommendation: 'Add an SPF record to your DNS: v=spf1 include:_spf.google.com ~all',
      })
    }

    const hasDmarc = results.txtRecords.some(txt => txt.toLowerCase().includes('v=dmarc1'))
    if (!hasDmarc) {
      vulnerabilities.push({
        type: 'Missing DMARC Record',
        severity: 'high',
        description: 'No DMARC record found. This reduces email security.',
        recommendation: 'Add a DMARC record: v=DMARC1; p=none; rua=mailto:admin@' + domain,
      })
    }

    // Check for exposed services
    const exposedServices = ['ftp', 'telnet', 'rdp', 'vnc']
    results.subdomains.forEach(sub => {
      const subLower = sub.subdomain.toLowerCase()
      exposedServices.forEach(service => {
        if (subLower.includes(service)) {
          vulnerabilities.push({
            type: `Exposed ${service.toUpperCase()} Service`,
            severity: 'medium',
            description: `Subdomain ${sub.subdomain} appears to expose ${service.toUpperCase()} service.`,
            recommendation: 'Ensure proper authentication and consider using VPN instead of direct exposure.',
          })
        }
      })
    })

    // Check for development/staging subdomains
    const devSubdomains = results.subdomains.filter(sub => 
      sub.subdomain.toLowerCase().includes('dev') ||
      sub.subdomain.toLowerCase().includes('staging') ||
      sub.subdomain.toLowerCase().includes('test')
    )
    if (devSubdomains.length > 0) {
      vulnerabilities.push({
        type: 'Development/Staging Subdomains Exposed',
        severity: 'medium',
        description: `Found ${devSubdomains.length} development/staging subdomains that may contain sensitive data.`,
        recommendation: 'Restrict access to development subdomains or use VPN/internal network only.',
      })
    }

    // Check for admin/management subdomains
    const adminSubdomains = results.subdomains.filter(sub => 
      sub.subdomain.toLowerCase().includes('admin') ||
      sub.subdomain.toLowerCase().includes('manage') ||
      sub.subdomain.toLowerCase().includes('control')
    )
    if (adminSubdomains.length > 0) {
      vulnerabilities.push({
        type: 'Admin/Management Subdomains Found',
        severity: 'low',
        description: `Found ${adminSubdomains.length} admin/management subdomains.`,
        recommendation: 'Ensure these subdomains have strong authentication and are not publicly accessible.',
      })
    }

    // Check for subdomain takeover risks (same IP addresses)
    const ipMap = new Map<string, string[]>()
    results.subdomains.forEach(sub => {
      sub.ipv4.forEach(ip => {
        if (!ipMap.has(ip)) {
          ipMap.set(ip, [])
        }
        ipMap.get(ip)!.push(sub.subdomain)
      })
    })

    ipMap.forEach((subdomains, ip) => {
      if (subdomains.length > 5) {
        vulnerabilities.push({
          type: 'Multiple Subdomains on Same IP',
          severity: 'low',
          description: `${subdomains.length} subdomains share the same IP address (${ip}).`,
          recommendation: 'Consider load balancing or separate hosting for critical subdomains.',
        })
      }
    })

    // Check for missing HTTPS (would need HTTP check, but we'll note it)
    if (results.subdomains.length > 0) {
      vulnerabilities.push({
        type: 'HTTPS Verification Recommended',
        severity: 'medium',
        description: 'Verify all subdomains use HTTPS and have valid SSL certificates.',
        recommendation: 'Run SSL/TLS scanning on all discovered subdomains.',
      })
    }

    results.vulnerabilities = vulnerabilities

    return NextResponse.json({
      ...results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Domain scan error:', error)
    return NextResponse.json(
      { error: error.message || 'Domain scan failed' },
      { status: 500 }
    )
  }
}

