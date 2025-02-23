# Use the official Node.js image as the base image
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json  to the working directory
COPY app/package*.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY app/ .

# Build the React app for production
RUN npm run build

RUN ls -la /app

# # Use the official Nginx image to serve the React app
FROM nginx:alpine

# # Copy the build output to the Nginx html directory
COPY --from=0 /app/dist /usr/share/nginx/html

# # Expose port 80
EXPOSE 80

# # Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]