# Deployment Guide

## Server Setup Instructions

### 1. Install Node.js (if not already installed)

```bash
# Install Node.js 18+ using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

Or using apt:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Dependencies and Build

On your server, navigate to the project directory and run:

```bash
cd ~/domain_scan
npm install
npm run build
```

### 3. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 4. Start the Application

```bash
# Start the Next.js app
pm2 start npm --name "next-app" -- start

# Save PM2 configuration
pm2 save

# Make PM2 start on system boot
pm2 startup
```

### 5. Configure Nginx as Reverse Proxy

Edit nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the content with the configuration from `nginx-config.conf` (or see below):

```nginx
server {
    listen 80;
    server_name _;  # or your domain name

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Quick Deployment Script

You can use the provided `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Important Notes

⚠️ **This app uses API routes and cannot be deployed as static files.**

- The app must run as a Node.js server (using `npm start` or PM2)
- Nginx should be configured as a reverse proxy to port 3000
- Do NOT copy files to `/var/www/html/` - that's for static sites only
- The `dist` folder contains the build output, but you still need Node.js to run it

## Useful PM2 Commands

```bash
pm2 status              # Check app status
pm2 logs next-app       # View logs
pm2 restart next-app    # Restart app
pm2 stop next-app       # Stop app
pm2 delete next-app     # Remove app from PM2
```

## Troubleshooting

1. **"next: not found"** - Run `npm install` first
2. **Port 3000 already in use** - Change port in `package.json` or kill the process
3. **Nginx 502 Bad Gateway** - Make sure Next.js app is running on port 3000
4. **Permission denied** - Check file permissions and nginx user permissions

