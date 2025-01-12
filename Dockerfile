# Dockerfile

# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Expose the port your app will run on
EXPOSE 4173

# Use npm run preview to serve the app
CMD ["npm", "run", "preview"]
