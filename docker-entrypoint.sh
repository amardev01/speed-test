#!/bin/sh
set -e

# Print environment for debugging (excluding sensitive data)
echo "Starting Speed Test application in $(node -v) environment"

# Start the unified backend server (serves both API and frontend)
echo "Starting backend server..."
cd /app/backend
exec node server.js