# url-service/Dockerfile

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install
Run npm install bcryptjs 
# Copy application source
COPY . .

# Expose the correct port (adjust if needed)
EXPOSE 3001

# Start the app
CMD ["node", "app.js"]
