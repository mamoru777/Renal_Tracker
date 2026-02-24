# Build Stage
FROM node:24-alpine3.22 AS build
WORKDIR /app
ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf.template /nginx.conf.template
ARG API_URL
ENV API_URL=$API_URL
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${API_BASE_URL} ${API_URL}' < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
