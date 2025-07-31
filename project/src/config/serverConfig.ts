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
  
  // In production (Cloudflare Pages), use the current origin
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

// Determine WebSocket URL based on environment
const getWebSocketUrl = (): string => {
  // Check for explicit WebSocket URL
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  const baseUrl = getBaseUrl();
  
  // In production (Cloudflare Pages), use WSS with the current origin
  if (import.meta.env.PROD) {
    return baseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/functions/websocket';
  }
  
  // Development fallback
  return 'ws://localhost:3000/functions/websocket';
};

const serverConfig: ServerConfig = {
  baseUrl: getBaseUrl(),
  wsUrl: getWebSocketUrl(),
  endpoints: {
    download: '/download',
    upload: '/upload',
    ping: '/ping',
    status: '/status',
    health: '/health',
    websocket: '/websocket'
  }
};

export default serverConfig;