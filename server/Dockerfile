# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Expose your app port 
EXPOSE 3000

# Start only the backend
CMD ["npm", "start"]
