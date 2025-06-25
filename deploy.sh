#!/bin/bash

# Speed Test Application Deployment Script

echo "=== Speed Test Application Deployment ==="
echo "Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the Docker images
echo "\nBuilding Docker images..."
docker-compose build

# Start the containers
echo "\nStarting containers..."
docker-compose up -d

# Check if containers are running
echo "\nChecking container status..."
docker-compose ps

echo "\nDeployment completed successfully!"
echo "The application should be available at:"
echo "  - Frontend: http://localhost:5000"
echo "  - Backend API: http://localhost:3000"
echo "\nTo view logs: docker-compose logs -f"
echo "To stop the application: docker-compose down"