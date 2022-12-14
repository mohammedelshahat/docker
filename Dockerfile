# Base image
FROM node:12
# Make folder to put our files in
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/backend
# Set working directory so that all subsequent command runs in this folder
WORKDIR /usr/src/app/backend
# Copy package json and install dependencies
COPY package*.json ./
RUN npm install
# Copy our app
COPY . .
# Expose port to access server
EXPOSE 8080:8080

CMD [ "npm", "start"]