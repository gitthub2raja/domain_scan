import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)
const resolve6 = promisify(dns.resolve6)
const resolveMx = promisify(dns.resolveMx)
const resolveNs = promisify(dns.resolveNs)
const resolveTxt = promisify(dns.resolveTxt)
const resolveSoa = promisify(dns.resolveSoa)
const resolveCname = promisify(dns.resolveCname)
const resolveSrv = promisify(dns.resolveSrv)

interface DNSResult {
  type: string
  name: string
  value: string
  ttl?: number
  priority?: number
  additional?: any
}

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

    const results: DNSResult[] = []

    // A Records (IPv4)
    try {
      const aRecords = await resolve4(domain)
      aRecords.forEach((record: any) => {
        results.push({
          type: 'A',
          name: domain,
          value: typeof record === 'string' ? record : record,
        })
      })
    } catch (error: any) {
      // A records not found, continue
    }

    // AAAA Records (IPv6)
    try {
      const aaaaRecords = await resolve6(domain)
      aaaaRecords.forEach((record: any) => {
        results.push({
          type: 'AAAA',
          name: domain,
          value: typeof record === 'string' ? record : record,
        })
      })
    } catch (error: any) {
      // AAAA records not found, continue
    }

    // MX Records
    try {
      const mxRecords = await resolveMx(domain)
      mxRecords.forEach((record) => {
        results.push({
          type: 'MX',
          name: domain,
          value: record.exchange,
          priority: record.priority,
        })
      })
    } catch (error: any) {
      // MX records not found, continue
    }

    // NS Records
    try {
      const nsRecords = await resolveNs(domain)
      nsRecords.forEach((record) => {
        results.push({
          type: 'NS',
          name: domain,
          value: record,
        })
      })
    } catch (error: any) {
      // NS records not found, continue
    }

    // TXT Records
    try {
      const txtRecords = await resolveTxt(domain)
      txtRecords.forEach((record) => {
        const txtValue = Array.isArray(record) ? record.join(' ') : record
        results.push({
          type: 'TXT',
          name: domain,
          value: txtValue,
        })
      })
    } catch (error: any) {
      // TXT records not found, continue
    }

    // SOA Record
    try {
      const soaRecord = await resolveSoa(domain)
      results.push({
        type: 'SOA',
        name: domain,
        value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial} ${soaRecord.refresh} ${soaRecord.retry} ${soaRecord.expire} ${soaRecord.minttl}`,
        additional: soaRecord,
      })
    } catch (error: any) {
      // SOA record not found, continue
    }

    // CNAME Records
    try {
      const cnameRecords = await resolveCname(domain)
      cnameRecords.forEach((record) => {
        results.push({
          type: 'CNAME',
          name: domain,
          value: record,
        })
      })
    } catch (error: any) {
      // CNAME records not found, continue
    }

    // Try common subdomains
    const commonSubdomains = [
      'www', 'mail', 'ftp', 'admin', 'api', 'blog', 'cdn', 'dev', 'staging', 'test', 
      'secure', 'vpn', 'portal', 'docs', 'support', 'webmail', 'imap', 'smtp', 'pop', 
      'ns1', 'ns2', 'mx', 'www2', 'shop', 'store', 'app', 'mobile', 'm', 'old', 
      'new', 'beta', 'alpha', 'demo', 'staging2', 'test2', 'backup', 'db', 'mysql', 
      'postgres', 'redis', 'cache', 'static', 'assets', 'media', 'images', 'img', 
      'video', 'videos', 'download', 'downloads', 'files', 'file', 'upload', 'uploads', 
      'share', 'shared', 'public', 'private', 'web', 'web2', 'www3', 'mail2', 'smtp2',
      'imap2', 'pop3', 'exchange', 'owa', 'autodiscover', 'lync', 'skype', 'teams'
    ]

    // Limit subdomain enumeration to avoid timeout
    const subdomainsToCheck = commonSubdomains.slice(0, 30)
    
    // Use Promise.allSettled for parallel subdomain checks (faster)
    const subdomainPromises = subdomainsToCheck.map(async (subdomain) => {
      const subdomainName = `${subdomain}.${domain}`
      try {
        const subdomainARecords = await resolve4(subdomainName)
        return subdomainARecords.map((record: any) => ({
          type: 'A' as const,
          name: subdomainName,
          value: typeof record === 'string' ? record : record,
        }))
      } catch (error: any) {
        return []
      }
    })

    const subdomainResults = await Promise.allSettled(subdomainPromises)
    subdomainResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value)
      }
    })

    return NextResponse.json({
      domain,
      records: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('DNS lookup error:', error)
    return NextResponse.json(
      { error: error.message || 'DNS lookup failed' },
      { status: 500 }
    )
  }
}

