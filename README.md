# Speed Test Application

This application provides a comprehensive internet speed testing solution with a React frontend. The backend is currently being updated and will be integrated soon.

## Features

- Download speed testing
- Upload speed testing
- Ping and latency measurement
- Packet loss detection
- Bufferbloat analysis
- Modern, responsive UI
- Environment-specific configuration

## Project Structure

- `/project` - React frontend application
- Backend - Currently being updated

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend will typically run on port 5173 or another available port.

## Using the Application

1. Open your browser and navigate to the frontend URL (e.g., http://localhost:5173)
2. The speed test will start automatically or click the "Start Test" button
3. View your results for download speed, upload speed, ping, and other metrics

## Configuration

The frontend is configured to connect to a backend using the settings in `project/src/config/serverConfig.ts`. This will be updated when the new backend is integrated.

## Troubleshooting

- Check browser console for any error messages
- Ensure all dependencies are installed with `npm install`
- Verify the development server is running on the correct port

## Development

The project includes GitHub Actions workflows for code quality and frontend deployment. Backend-specific workflows will be updated when the new backend is integrated.
- Project board automation for organizing tasks
- Runs on issue/PR events and daily for maintenance tasks

## Future Development

The backend is currently being redesigned and will be integrated soon. Deployment instructions will be updated accordingly.