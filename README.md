# Cyber Recon Portal

A modern, public-access cybersecurity-themed reconnaissance web portal inspired by DNSDumpster.com, featuring a dark neon aesthetic with animated cyber-grid backgrounds, glowing circuit-line transitions, hologram-style buttons, and interactive security-themed animations.

## Features

- **DNS Record Lookup** - Comprehensive DNS record analysis and resolution
- **Subdomain Enumeration** - Discover subdomains and hidden infrastructure
- **Host Discovery** - Network host identification and mapping
- **Attack Surface Mapping** - Visual representation of exposed services
- **Port Scanner** - Advanced Nmap-based port scanning with multiple scan modes
- **Reports** - Generate and export security reports in multiple formats

## Design Features

- Dark neon aesthetic with cyber-grid animated backgrounds
- Particle effects and network visualization
- Hologram-style buttons with glowing effects
- Scanning radar animations
- Data-flow motion graphics
- Smooth hover transitions
- Circuit-line animations

## Security & Legal

⚠️ **IMPORTANT**: This portal is designed for authorized security testing and reconnaissance activities only. Users must have explicit written permission to scan or analyze any target systems. Unauthorized access or scanning of systems without permission is illegal and strictly prohibited.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon library

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── login/                # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # User dashboard
│   ├── dns-lookup/          # DNS lookup tool
│   ├── subdomain-enum/      # Subdomain enumeration
│   ├── host-discovery/      # Host discovery
│   ├── attack-surface/      # Attack surface mapping
│   ├── port-scanner/        # Port scanner
│   └── reports/             # Reports page
├── components/
│   ├── CyberBackground.tsx  # Animated background
│   ├── Navigation.tsx        # Navigation bar
│   ├── CyberButton.tsx       # Cyber-themed button
│   ├── CyberInput.tsx        # Cyber-themed input
│   └── CyberCard.tsx         # Cyber-themed card
└── app/
    └── globals.css           # Global styles and animations
```

## Usage

1. **Register/Login** - Create an account or login to access the portal
2. **Authorize** - Confirm you have permission to perform scans on each tool
3. **Perform Scans** - Use the various tools to gather intelligence
4. **View Reports** - Access and export your scan results

## License

This project is for educational and authorized security testing purposes only.

# domain_scan
