FROM node:22-alpine

# Set working directory to /app (standard)
WORKDIR /app

# Copy backend package files directly to /app
COPY backend/package*.json ./

# Install dependencies in /app
RUN npm ci --only=production

# Copy all backend source files directly to /app
# This moves 'backend/server.js' to '/app/server.js'
COPY backend/ .

# Expose port
EXPOSE 5001

# Start server (now located at /app/server.js)
CMD ["node", "server.js"]
