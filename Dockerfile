# Example: Frontend Dockerfile

FROM node:21.7.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build"]
