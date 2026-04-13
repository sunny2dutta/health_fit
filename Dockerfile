# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .

# Install frontend dependencies and build the integrated app.
RUN cd client && npm ci --ignore-scripts && npm run build
RUN npm run build:server

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application
CMD ["npm", "start"]
