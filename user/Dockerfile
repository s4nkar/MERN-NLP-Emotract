FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install -g serve

COPY ./src ./src
COPY package*.json ./
COPY . .

RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--port", "5173"]
# Build the frontend application (usually for a production-ready app)

# Expose the port the app will run on (usually 5173 for Vite, adjust if necessary)

# Start the app using the `serve` command, serving the production build
# CMD [ "serve", "-s", "dist", "-l", "5173" ]
# CMD ["npm", "run", "dev"]




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
# EXPOSE 5173

# # Start the Vite React app
# CMD ["npm", "run", "dev"]
