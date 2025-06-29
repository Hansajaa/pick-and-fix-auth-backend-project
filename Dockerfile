# Dockerfile

# Use an official Node.js 16 runtime as a base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire application directory into the container
COPY . .

RUN npm run build

# Expose the port on which your NestJS application is running
EXPOSE 3000

# Start your NestJS application
CMD ["npm", "run", "start:prod"]

