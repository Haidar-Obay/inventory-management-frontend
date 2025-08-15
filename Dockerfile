# ---------- deps: install dependencies ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --legacy-peer-deps --ignore-scripts

    
# ---------- builder: compile Next.js ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Add these two lines:
    ARG NEXT_PUBLIC_API_BASE_URL
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    
    RUN npm run build
    
    # ---------- runner: minimal image to run the app ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    ENV PORT=3000
    ENV HOSTNAME=0.0.0.0
    
    # Next.js standalone contains server + needed node_modules
    COPY --from=builder /app/.next/standalone ./
    # Static assets + public folder
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    
    EXPOSE 3000
    CMD ["node", "server.js"]
    