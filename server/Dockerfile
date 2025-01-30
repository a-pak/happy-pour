#### Build Stage ####
FROM maven AS build
WORKDIR /app
# COPY server/pom.xml ./server/pom.xml
# COPY server/src ./server/src
COPY pom.xml ./pom.xml
COPY src ./src


# WORKDIR /app/server
WORKDIR /app
RUN mvn clean package -DskipTests

#### Runtime Stage ####
FROM openjdk
WORKDIR /app
COPY --from=build /app/target/happypour-0.0.1-SNAPSHOT.jar /app/happypour.jar
ENTRYPOINT ["java", "-jar", "/app/happypour.jar"]
