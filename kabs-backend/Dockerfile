# Use the official MySQL image as the base image
FROM mysql:latest

# Environment variables to set up the database
ENV MYSQL_ROOT_PASSWORD=kabs_password
ENV MYSQL_DATABASE=kabs_db
ENV MYSQL_USER=kabs_user
ENV MYSQL_PASSWORD=kabs_password

# Copy the database schema file into the container
COPY database.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306