/**
 * Server configuration for speed test endpoints
 */

interface ServerConfig {
  baseUrl: string;
  wsUrl: string;
  endpoints: {
    download: string;
    upload: string;
    ping: string;
    getIP: string;
    status: string;
    health: string;
    websocket: string;
  };
}

// Determine base URL based on environment
const getBaseUrl = (): string => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production, use current origin
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // LibreSpeed backend URL for development
  return 'http://localhost:8080';
};

// Determine WebSocket URL based on environment
const getWebSocketUrl = (): string => {
  // Check for explicit WebSocket URL
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // In production, use current origin with wss protocol
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  
  // LibreSpeed backend WebSocket URL for development
  return 'ws://localhost:8080';
};

const serverConfig: ServerConfig = {
  baseUrl: getBaseUrl(),
  wsUrl: getWebSocketUrl(),
  endpoints: {
    download: 'garbage.php',
    upload: 'empty.php',
    ping: 'empty.php',
    getIP: 'getIP.php',
    status: '/status',
    health: '/health',
    websocket: '/websocket'
  }
};

export default serverConfig;
