#### Build Stage ####
FROM maven:3.9.2-eclipse-temurin AS build
WORKDIR /app
COPY server/pom.xml ./pom.xml
COPY server/src ./src

RUN mvn clean package -DskipTests

#### Runtime Stage ####
FROM eclipse-temurin:20-jre-jammy
WORKDIR /app
COPY --from=build /app/target/happypour-0.0.1-SNAPSHOT.jar /app/happypour.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/happypour.jar"]