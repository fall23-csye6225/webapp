#!/bin/bash

# Log file path
LOG_FILE="/var/log/start-app.log"

# Change to the directory where your Node.js application is located
cd /opt/webapps || { echo "Error: Unable to change directory to /opt/webapps" | tee -a "$LOG_FILE"; exit 1; }

# Log the start time
echo "Starting Node.js application at $(date)" | tee -a "$LOG_FILE"

# Install dependencies (uncomment if needed)
# npm install || { echo "Error: Unable to install dependencies" | tee -a "$LOG_FILE"; exit 1; }

# Start your Node.js application using npm
node app.js || { echo "Error: Failed to start Node.js application" | tee -a "$LOG_FILE"; exit 1; }

# Log the end time
echo "Node.js application started successfully at $(date)" | tee -a "$LOG_FILE"





















# #!/bin/bash

# # Change to the directory where your Node.js application is located
# cd /opt/webapps

# # Start your Node.js application using npm
# #npm install # Install any required dependencies (if not already installed)
# node app.js

