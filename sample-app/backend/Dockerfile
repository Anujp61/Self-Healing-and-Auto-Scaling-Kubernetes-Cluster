# base image
FROM node:14

# Set working dir...
WORKDIR /app

COPY . .

RUN npm install

# port
EXPOSE 8080

# Start the backend server
CMD ["npm", "start"]
