# Docker Deployment Guide

## Quick Start

### Build and run with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Build and run with Docker directly

```bash
# Build the image
docker build -t cyber-recon-portal .

# Run the container
docker run -p 3000:3000 cyber-recon-portal
```

## Access the Application

Once running, access the application at:
- **http://localhost:3000**

## Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Check status
docker-compose ps

# Execute command in container
docker-compose exec app sh
```

## Environment Variables

You can add environment variables to `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_TELEMETRY_DISABLED=1
  - CUSTOM_VAR=value
```

Or use a `.env` file:

```bash
# Create .env file
echo "NODE_ENV=production" > .env

# docker-compose will automatically load it
docker-compose up -d
```

## Production Deployment

For production, consider:

1. **Use a reverse proxy** (nginx/traefik) in front of the container
2. **Set up SSL/TLS** certificates
3. **Configure resource limits** in docker-compose.yml
4. **Use Docker secrets** for sensitive data
5. **Set up health checks** (already included)

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app

# Check if port is already in use
lsof -i :3000
```

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Access container shell
```bash
docker-compose exec app sh
```

