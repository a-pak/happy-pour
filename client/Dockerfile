#### Build stage

FROM node:latest AS build
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build


#### Runtime stage

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]