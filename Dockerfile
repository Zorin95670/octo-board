# Build stage
FROM node:lts-alpine as build-stage

ARG NPM_TOKEN
WORKDIR /app
COPY npmrc .npmrc
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -f .npmrc
RUN npm run changelog --silent > public/changelog.html
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
