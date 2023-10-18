#!/bin/bash

# Update package lists
sudo apt-get update

# Upgrade installed packages
sudo apt-get upgrade -y

#Install unzip 
sudo apt install unzip

#Display unzip version
which unzip

# Install additional dependencies
sudo apt-get install -y libterm-readline-perl-perl

# Install Node.js
sudo apt-get install -y nodejs

# Display Node.js version
node -v

# Install npm
sudo apt-get install -y npm

# Display npm version
npm -v

# Install MariaDB server
sudo apt-get install -y mariadb-server

# Define your MySQL root password
#DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=assignmentsdb

sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('$DB_PASSWORD');FLUSH PRIVILEGES;"

printf "%s\n n\n n\n n\n n\n n\n y\n" "$DB_PASSWORD" | sudo mysql_secure_installation

sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"

mysql -u root -p"$DB_PASSWORD" -Bse "CREATE DATABASE $DB_NAME;"

mysql -u root -p"$DB_PASSWORD" -Bse "SHOW DATABASES;"

# Clean up
sudo apt-get clean
