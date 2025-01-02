
#### Build stage

FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY server/pom.xml .
COPY server/src ./src
RUN mvn clean package -DskipTests


#### Runtime stage

FROM openjdk:23-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]