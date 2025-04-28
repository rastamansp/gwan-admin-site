# Build stage
FROM node:20-bullseye as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-bullseye

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Install only production dependencies
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 