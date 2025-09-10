#### Build stage
FROM node:20 AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build -- --mode production

#### Runtime stage
FROM nginx:alpine
# Kopioidaan FE build oikeaan Nginx-roottiin
COPY --from=build /app/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]