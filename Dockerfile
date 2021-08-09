# Develop stage
FROM node:14.17.4-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@7.20.5
RUN npm install --legacy-peer-deps
COPY . .

# Build stage
FROM develop-stage as build-stage
WORKDIR /app
RUN npm run changelog --silent > public/changelog.html
RUN npm run build

# Production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
