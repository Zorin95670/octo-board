# Build stage
FROM node:lts-alpine as build-stage

ARG NPM_TOKEN
WORKDIR /app
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++
COPY npmrc .npmrc
COPY package*.json ./
RUN npm install --add-python-to-path='true'
COPY . .
RUN rm -f .npmrc
RUN npm run changelog --silent > public/changelog.html
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
