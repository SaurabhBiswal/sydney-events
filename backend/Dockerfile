FROM node:22-alpine

# Set working directory to the backend folder inside the container
WORKDIR /app/backend

# Install only production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Expose the port the server listens on (5001 as used locally)
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
