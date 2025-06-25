# Speed Test Application

This application provides a comprehensive internet speed testing solution with a React frontend and a custom Node.js backend for accurate speed measurements.

## Features

- Download speed testing
- Upload speed testing
- Ping and latency measurement
- Packet loss detection
- Bufferbloat analysis
- Modern, responsive UI

## Project Structure

- `/project` - React frontend application
- `/backend` - Node.js Express backend server

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

   The server will run on port 3000 by default. You should see a message: `Speed test backend server running on port 3000`

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

## Backend API Endpoints

- `GET /ping` - Used for ping/latency testing
- `GET /download` - Serves random data for download speed testing
  - Query parameter: `bytes` - Size of data to download (default: 1MB)
- `POST /upload` - Accepts data uploads for upload speed testing
- `GET /status` - Returns server status information

## Configuration

The frontend is configured to connect to the backend using the settings in `project/src/config/serverConfig.ts`. If you need to change the backend URL or port, update this file.

## Troubleshooting

- If you encounter CORS issues, ensure both frontend and backend are running
- Check browser console for any error messages
- Verify that the backend server is running and accessible

## Performance Considerations

- The backend generates random data on-the-fly to avoid caching issues
- Multiple parallel connections are used to saturate bandwidth
- Cache prevention headers are set on all responses