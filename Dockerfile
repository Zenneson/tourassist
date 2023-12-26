# Tourassist Development Dockerfile

# Use the official Node.js 20 Alpine image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables for configuration
ENV NODE_ENV=development
ENV PORT=3000

# Expose the port on which the Next.js application will run
EXPOSE 3000

# Run the Next.js application in development mode
CMD ["turbo", "run", "dev"]