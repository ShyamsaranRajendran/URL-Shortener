# Stage 1: Build the application
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Make sure this matches your build script in package.json
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
# Copy the built files from builder to nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 (nginx default) but map to 5173 in compose
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]