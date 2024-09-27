# Use a base image with Node.js
FROM node:18-bullseye-slim

# Install Chromium and necessary dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable to skip downloading Chromium with Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set Puppeteer's executable path for Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install Node.js dependencies (Puppeteer and others)
RUN npm install --omit=dev

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on (if needed)
EXPOSE 3040

# Command to start your app
CMD ["node", "server.js"]
