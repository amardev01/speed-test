@echo off
REM Speed Test Application Deployment Script for Windows

echo === Speed Test Application Deployment ===
echo Starting deployment process...

REM Check if Docker is installed
docker --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Build the Docker images
echo.
echo Building Docker images...
docker-compose build

REM Start the containers
echo.
echo Starting containers...
docker-compose up -d

REM Check if containers are running
echo.
echo Checking container status...
docker-compose ps

echo.
echo Deployment completed successfully!
echo The application should be available at:
echo   - Frontend: http://localhost:5000
echo   - Backend API: http://localhost:3000
echo.
echo To view logs: docker-compose logs -f
echo To stop the application: docker-compose down

pause