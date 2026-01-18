FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy EVERYTHING from the build context
COPY . .

# Universal Build Logic:
# 1. If 'backend' folder exists (Context=Root), go inside, install deps, and move everything up to /app
# 2. If no 'backend' folder (Context=Backend), just install deps in /app
RUN if [ -d "backend" ]; then \
    echo "Build Context is ROOT. Moving backend files..." && \
    cd backend && \
    npm ci --only=production && \
    cp -r * /app/ && \
    cd .. ; \
    else \
    echo "Build Context is BACKEND. Installing..." && \
    npm ci --only=production; \
    fi

# Expose port
EXPOSE 5001

# Debug: List files to prove server.js exists
RUN ls -la /app

# Start server
CMD ["node", "server.js"]
