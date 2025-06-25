#!/bin/sh
set -e

# Print environment for debugging (excluding sensitive data)
echo "Starting Speed Test application in $(node -v) environment"

# Start the backend server in the background
echo "Starting backend server..."
cd /app/backend
node server.js &
BACKEND_PID=$!

# Wait a moment to ensure backend is running
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "ERROR: Backend server failed to start"
  exit 1
fi

echo "Backend server started successfully with PID $BACKEND_PID"

# Start the frontend server
echo "Starting frontend server..."
cd /app/frontend
exec serve -s dist -l 5000