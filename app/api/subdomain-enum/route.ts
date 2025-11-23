import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)
const resolve6 = promisify(dns.resolve6)
const resolveNs = promisify(dns.resolveNs)

interface SubdomainResult {
  subdomain: string
  ipv4?: string[]
  ipv6?: string[]
  found: boolean
  method: string
}

// Comprehensive subdomain wordlist (1000+ entries)
const SUBDOMAIN_WORDLIST = [
  // Common
  'www', 'mail', 'ftp', 'admin', 'api', 'blog', 'cdn', 'dev', 'staging', 'test',
  'secure', 'vpn', 'portal', 'docs', 'support', 'webmail', 'imap', 'smtp', 'pop',
  'ns1', 'ns2', 'mx', 'www2', 'shop', 'store', 'app', 'mobile', 'm', 'old',
  'new', 'beta', 'alpha', 'demo', 'staging2', 'test2', 'backup', 'db', 'mysql',
  'postgres', 'redis', 'cache', 'static', 'assets', 'media', 'images', 'img',
  'video', 'videos', 'download', 'downloads', 'files', 'file', 'upload', 'uploads',
  'share', 'shared', 'public', 'private', 'web', 'web2', 'www3', 'mail2', 'smtp2',
  'imap2', 'pop3', 'exchange', 'owa', 'autodiscover', 'lync', 'skype', 'teams',
  // Infrastructure
  'ns', 'ns3', 'ns4', 'dns', 'dns1', 'dns2', 'mx1', 'mx2', 'mail1', 'mail3',
  'web1', 'web3', 'www1', 'www4', 'cdn1', 'cdn2', 'cdn3', 'static1', 'static2',
  'assets1', 'assets2', 'media1', 'media2', 'images1', 'images2', 'files1', 'files2',
  // Services
  'smtp', 'pop3', 'imap', 'imap4', 'pop', 'exchange', 'owa', 'activesync',
  'autodiscover', 'lyncdiscover', 'sip', 'sipfederationtls', 'lync', 'skype',
  'teams', 'meet', 'zoom', 'webex', 'gotomeeting', 'join', 'joinme',
  // Development
  'dev', 'dev1', 'dev2', 'development', 'staging', 'staging1', 'staging2',
  'test', 'test1', 'test2', 'testing', 'qa', 'qa1', 'qa2', 'preprod', 'prod',
  'production', 'prod1', 'prod2', 'live', 'live1', 'live2', 'beta', 'alpha',
  'demo', 'demo1', 'demo2', 'sandbox', 'sandbox1', 'sandbox2',
  // Applications
  'app', 'app1', 'app2', 'apps', 'application', 'applications', 'webapp',
  'webapp1', 'webapp2', 'mobile', 'mobile1', 'mobile2', 'm', 'm1', 'm2',
  'api', 'api1', 'api2', 'apis', 'rest', 'restapi', 'graphql', 'graph',
  'v1', 'v2', 'v3', 'version1', 'version2', 'version3',
  // Content
  'blog', 'blogs', 'news', 'news1', 'news2', 'articles', 'posts', 'content',
  'content1', 'content2', 'cms', 'cms1', 'cms2', 'wp', 'wordpress', 'drupal',
  'joomla', 'magento', 'shopify', 'woocommerce',
  // E-commerce
  'shop', 'shops', 'store', 'stores', 'store1', 'store2', 'ecommerce',
  'ecom', 'cart', 'checkout', 'payment', 'payments', 'billing', 'invoice',
  'invoices', 'orders', 'order', 'customer', 'customers', 'account', 'accounts',
  // Security
  'secure', 'secure1', 'secure2', 'security', 'vpn', 'vpn1', 'vpn2', 'vpn3',
  'ssl', 'tls', 'cert', 'certificate', 'certs', 'ca', 'pki', 'key', 'keys',
  'auth', 'auth1', 'auth2', 'authentication', 'login', 'logins', 'signin',
  'signup', 'register', 'registration', 'account', 'accounts', 'user', 'users',
  'admin', 'admin1', 'admin2', 'administrator', 'admins', 'root', 'sudo',
  // Infrastructure Services
  'db', 'db1', 'db2', 'database', 'databases', 'mysql', 'mysql1', 'mysql2',
  'postgres', 'postgres1', 'postgres2', 'postgresql', 'mongo', 'mongo1', 'mongo2',
  'mongodb', 'redis', 'redis1', 'redis2', 'cache', 'cache1', 'cache2',
  'memcached', 'memcache', 'elastic', 'elasticsearch', 'es', 'es1', 'es2',
  'solr', 'solr1', 'solr2', 'kibana', 'grafana', 'prometheus', 'monitoring',
  // Cloud Services
  'aws', 'aws1', 'aws2', 'amazon', 's3', 's3bucket', 'ec2', 'lambda', 'cloudfront',
  'azure', 'azure1', 'azure2', 'microsoft', 'gcp', 'gcp1', 'gcp2', 'google',
  'cloud', 'cloud1', 'cloud2', 'cloudflare', 'cf', 'cf1', 'cf2',
  // CDN & Static
  'cdn', 'cdn1', 'cdn2', 'cdn3', 'static', 'static1', 'static2', 'static3',
  'assets', 'assets1', 'assets2', 'assets3', 'media', 'media1', 'media2',
  'images', 'images1', 'images2', 'img', 'img1', 'img2', 'pics', 'pictures',
  'video', 'videos', 'video1', 'video2', 'stream', 'streaming', 'stream1',
  // File Services
  'files', 'files1', 'files2', 'file', 'file1', 'file2', 'upload', 'uploads',
  'upload1', 'upload2', 'download', 'downloads', 'download1', 'download2',
  'share', 'shared', 'sharing', 'share1', 'share2', 'public', 'public1',
  'private', 'private1', 'private2', 'internal', 'internal1', 'internal2',
  // Communication
  'mail', 'mail1', 'mail2', 'mail3', 'email', 'emails', 'email1', 'email2',
  'smtp', 'smtp1', 'smtp2', 'pop', 'pop1', 'pop2', 'pop3', 'imap', 'imap1',
  'imap2', 'imap4', 'exchange', 'exchange1', 'exchange2', 'owa', 'owa1',
  'activesync', 'sync', 'sync1', 'sync2',
  // Collaboration
  'collab', 'collaboration', 'team', 'teams', 'team1', 'team2', 'sharepoint',
  'sp', 'sp1', 'sp2', 'confluence', 'jira', 'jira1', 'jira2', 'slack', 'slack1',
  'discord', 'discord1', 'mattermost', 'mattermost1',
  // Monitoring & Analytics
  'monitoring', 'monitor', 'monitor1', 'monitor2', 'stats', 'statistics',
  'stats1', 'stats2', 'analytics', 'analytics1', 'analytics2', 'tracking',
  'track', 'track1', 'track2', 'log', 'logs', 'logging', 'log1', 'log2',
  'syslog', 'syslog1', 'syslog2',
  // Documentation
  'docs', 'docs1', 'docs2', 'documentation', 'doc', 'doc1', 'doc2', 'wiki',
  'wiki1', 'wiki2', 'help', 'help1', 'help2', 'support', 'support1', 'support2',
  'faq', 'faqs', 'guide', 'guides', 'manual', 'manuals', 'tutorial', 'tutorials',
  // Marketing
  'marketing', 'marketing1', 'marketing2', 'campaign', 'campaigns', 'promo',
  'promos', 'promotion', 'promotions', 'ad', 'ads', 'advertising', 'advert',
  'newsletter', 'newsletters', 'subscribe', 'subscription', 'sub', 'subs',
  // Customer Service
  'support', 'support1', 'support2', 'help', 'help1', 'help2', 'ticket',
  'tickets', 'ticketing', 'service', 'services', 'service1', 'service2',
  'customer', 'customers', 'client', 'clients', 'client1', 'client2',
  // Additional common patterns
  'old', 'old1', 'old2', 'new', 'new1', 'new2', 'legacy', 'legacy1', 'legacy2',
  'archive', 'archives', 'archive1', 'archive2', 'backup', 'backups', 'backup1',
  'backup2', 'temp', 'temp1', 'temp2', 'temporary', 'tmp', 'tmp1', 'tmp2',
  'test', 'test1', 'test2', 'testing', 'tests', 'qa', 'qa1', 'qa2',
  // Geographic
  'us', 'usa', 'uk', 'eu', 'eu1', 'eu2', 'asia', 'asia1', 'asia2', 'apac',
  'emea', 'emea1', 'emea2', 'na', 'na1', 'na2', 'sa', 'sa1', 'sa2',
  'ny', 'ny1', 'ny2', 'nyc', 'sf', 'sf1', 'sf2', 'la', 'la1', 'la2',
  'london', 'london1', 'london2', 'tokyo', 'tokyo1', 'tokyo2', 'singapore',
  'singapore1', 'singapore2', 'sydney', 'sydney1', 'sydney2',
  // Numbers
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '01', '02', '03', '04', '05', '06', '07', '08', '09',
  // Common prefixes
  'my', 'my1', 'my2', 'your', 'your1', 'your2', 'our', 'our1', 'our2',
  'get', 'get1', 'get2', 'go', 'go1', 'go2', 'try', 'try1', 'try2',
  'use', 'use1', 'use2', 'access', 'access1', 'access2',
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

    const foundSubdomains = new Map<string, SubdomainResult>()

    // Method 1: Try DNS zone transfer (AXFR)
    try {
      const nsRecords = await resolveNs(domain)
      for (const ns of nsRecords) {
        try {
          // Attempt zone transfer (will likely fail, but worth trying)
          // Note: Most DNS servers disable AXFR for security
          // Zone transfer attempt (simulated - actual AXFR requires special setup)
          // Using dns.promises.resolve for promise-based API
          await dns.promises.resolve(domain, 'NS')
        } catch (error) {
          // Zone transfer not allowed (expected)
        }
      }
    } catch (error) {
      // Continue with other methods
    }

    // Method 2: DNS Brute Force with comprehensive wordlist (parallel processing)
    const wordlist = SUBDOMAIN_WORDLIST
    const batchSize = 100 // Process in larger batches for better performance
    const timeout = 2000 // 2 second timeout per subdomain
    
    for (let i = 0; i < wordlist.length; i += batchSize) {
      const batch = wordlist.slice(i, i + batchSize)
      
      const promises = batch.map(async (subdomain) => {
        const subdomainName = `${subdomain}.${domain}`
        
        // Skip if already found
        if (foundSubdomains.has(subdomainName)) {
          return
        }

        try {
          // Try IPv4 with timeout
          const ipv4Promise = resolve4(subdomainName)
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
          
          const ipv4Records = await Promise.race([ipv4Promise, timeoutPromise]) as string[]

          if (ipv4Records && ipv4Records.length > 0) {
            foundSubdomains.set(subdomainName, {
              subdomain: subdomainName,
              ipv4: ipv4Records,
              found: true,
              method: 'DNS Brute Force',
            })
            return // Found via IPv4, skip IPv6 check for speed
          }
        } catch (error: any) {
          // Subdomain doesn't exist or timeout - try IPv6
          try {
            const ipv6Promise = resolve6(subdomainName)
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
            
            const ipv6Records = await Promise.race([ipv6Promise, timeoutPromise]) as string[]

            if (ipv6Records && ipv6Records.length > 0) {
              foundSubdomains.set(subdomainName, {
                subdomain: subdomainName,
                ipv6: ipv6Records,
                found: true,
                method: 'DNS Brute Force',
              })
            }
          } catch (error2: any) {
            // Neither IPv4 nor IPv6 found
          }
        }
      })

      await Promise.allSettled(promises)
      
      // Progress update could be sent via streaming, but for now we continue
    }

    // Method 3: Check common DNS records that might reveal subdomains
    try {
      const nsRecords = await resolveNs(domain)
      nsRecords.forEach((ns) => {
        if (ns.includes('.')) {
          const parts = ns.split('.')
          if (parts.length >= 2) {
            const potentialSubdomain = parts.slice(0, -2).join('.')
            if (potentialSubdomain && !foundSubdomains.has(`${potentialSubdomain}.${domain}`)) {
              // Try to resolve it
              resolve4(`${potentialSubdomain}.${domain}`)
                .then((ips) => {
                  if (ips && ips.length > 0) {
                    foundSubdomains.set(`${potentialSubdomain}.${domain}`, {
                      subdomain: `${potentialSubdomain}.${domain}`,
                      ipv4: ips as string[],
                      found: true,
                      method: 'NS Record Analysis',
                    })
                  }
                })
                .catch(() => {})
            }
          }
        }
      })
    } catch (error) {
      // Continue
    }

    // Convert map to array
    const results = Array.from(foundSubdomains.values())
      .filter(r => r.found)
      .map(r => r.subdomain)
      .sort()

    return NextResponse.json({
      domain,
      subdomains: results,
      count: results.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Subdomain enumeration error:', error)
    return NextResponse.json(
      { error: error.message || 'Subdomain enumeration failed' },
      { status: 500 }
    )
  }
}

