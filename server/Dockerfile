#### Build Stage ####
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY server/pom.xml ./pom.xml
COPY server/src ./src
# -DskipTests
RUN mvn clean package

#### Runtime Stage ####
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/happypour-0.0.1-SNAPSHOT.jar /app/happypour.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/happypour.jar"]