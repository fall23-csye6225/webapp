#!/bin/bash

# Unzip the webapp.zip file to /opt directory
sudo mkdir -p /opt/webapps
sudo mv /home/admin/web_app_ami.zip /opt/webapps/web_app_ami.zip

# Print the directory structure
ls -R /opt/webapps

# Change directory to the unzipped webapp directory, exit if cd fails
if cd /opt/webapps; then
  # Unzip the contents
  sudo unzip -o web_app_ami.zip

  # Go inside the unzipped folder
  cd web_app_ami/webapp

  # Run npm install
  echo "cd inside the webapp directory"
  if sudo npm install; then
    echo "npm install completed without errors."
  else
    echo "npm install encountered errors."
    exit 1
  fi
else
  echo "Failed to change directory to /opt/webapp. Exiting."
  exit 1
fi

# Set permissions on web_app_ami.zip
# chmod 644 /opt/webapp/web_app_ami.zip
