FROM node:22-alpine

# Set working directory for backend
WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Expose the port the server listens on (5001)
EXPOSE 5001

# Start the backend server
CMD ["node", "server.js"]
