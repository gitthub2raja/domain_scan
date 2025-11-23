# Use Node.js LTS as base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build Next.js app
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy build from builder
COPY --from=builder /app ./

# Expose port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
