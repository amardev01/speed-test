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
  
  // In production, check if we're on Render or Cloudflare
  if (import.meta.env.PROD) {
    // For Render deployment, use relative URLs since frontend and backend are served together
    if (window.location.hostname.includes('onrender.com')) {
      return ''; // Use relative URLs
    }
    // For Cloudflare Pages, use the current origin
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
  
  // In production, handle different platforms
  if (import.meta.env.PROD) {
    // For Render deployment, WebSocket is on the same domain
    if (window.location.hostname.includes('onrender.com') || baseUrl === '') {
      return window.location.origin.replace('https://', 'wss://').replace('http://', 'ws://');
    }
    // For Cloudflare Pages, use functions/websocket
    return baseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/functions/websocket';
  }
  
  // Development fallback
  return 'ws://localhost:3000';
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