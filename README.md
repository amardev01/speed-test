# Speed Test Application

This application provides a comprehensive internet speed testing solution with a React frontend and a custom Node.js backend for accurate speed measurements.

## Features

- Download speed testing
- Upload speed testing
- Ping and latency measurement
- Packet loss detection
- Bufferbloat analysis
- Modern, responsive UI
- Docker-based deployment for easy setup
- Environment-specific configuration
- Production-ready logging

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
- For production issues, check the logs in `backend/logs/access.log`

## Performance Considerations

- The backend generates random data on-the-fly to avoid caching issues
- Multiple parallel connections are used to saturate bandwidth
- Cache prevention headers are set on all responses
- Cluster mode is enabled by default to utilize all CPU cores

## Deployment

### Docker Deployment (Recommended)

The easiest way to deploy the application is using Docker:

1. Make sure Docker and Docker Compose are installed on your system

2. Run the deployment script:
   - On Linux/Mac: `./deploy.sh`
   - On Windows: `deploy.bat`

3. The application will be available at:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3000

### Manual Deployment

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install production dependencies:
   ```
   npm ci --only=production
   ```

3. Create a `.env` file based on `.env.production`

4. Start the server:
   ```
   NODE_ENV=production node server.js
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd project
   ```

2. Install dependencies:
   ```
   npm ci
   ```

3. Create a `.env.production` file with the backend URL:
   ```
   VITE_API_BASE_URL=http://your-backend-url:3000
   ```

4. Build the application:
   ```
   npm run build
   ```

5. Serve the built files using a static file server:
   ```
   npx serve -s dist
   ```

### Environment Variables

#### Backend

- `PORT`: The port on which the backend server runs (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `ENABLE_CLUSTER`: Whether to enable cluster mode (true/false)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `KEEP_ALIVE_TIMEOUT`: Keep-alive timeout in milliseconds
- `HEADERS_TIMEOUT`: Headers timeout in milliseconds

#### Frontend

- `VITE_API_BASE_URL`: The URL of the backend API