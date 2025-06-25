#!/bin/sh

# Start the backend server in the background
cd /app/backend
node server.js &

# Start the frontend server
cd /app/frontend
serve -s dist -l 5000