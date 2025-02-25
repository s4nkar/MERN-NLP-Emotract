FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install -g serve

COPY ./src ./src
COPY package*.json ./
COPY . .

RUN npm run build

EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--port", "5174"]
# Use an official Node.js runtime as a parent image
# FROM node:18-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the package.json and package-lock.json (if present)
# # This step is separate to leverage Docker cache for faster builds
# COPY package.json package-lock.json* ./

# # Install dependencies (using npm install)
# RUN npm install

# # Install the `serve` package globally to serve the build
# RUN npm install -g serve

# # Copy the rest of the application code into the container
# COPY . .

# # Build the frontend application (usually for a production-ready app)
# RUN npm run build

# # Expose the port the app will run on (usually 5173 for Vite, adjust if necessary)
# EXPOSE 5174

# # Start the app using the `serve` command, serving the production build
# # CMD [ "serve", "-s", "dist", "-l", "5174" ]
# # CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "dev", "--", "--port", "5174"]




# Use official Node.js image
# FROM node:18

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package.json /app/
# RUN npm install

# # Copy the rest of the project files
# COPY . /app/

# # Expose the port the app will run on (default for Vite is 5173)
# EXPOSE 5174

# # Start the Vite React app
# CMD ["npm", "run", "dev"]
