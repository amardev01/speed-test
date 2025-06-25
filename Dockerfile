# Multi-stage build for speed test application

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package.json and install dependencies
COPY project/package.json project/package-lock.json* ./
RUN npm ci

# Copy frontend source code and build
COPY project/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend

# Copy backend package.json and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

# Copy backend source code
COPY backend/ ./

# Stage 3: Production image
FROM node:18-alpine
WORKDIR /app

# Copy built backend from backend-build stage
COPY --from=backend-build /app/backend ./backend

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install serve to serve the frontend
RUN npm install -g serve

# Copy the startup script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Expose ports for backend and frontend
EXPOSE 3000 5000

# Start both services
ENTRYPOINT ["/docker-entrypoint.sh"]