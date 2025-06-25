/**
 * Server configuration for speed test endpoints
 */

interface ServerConfig {
  baseUrl: string;
  endpoints: {
    download: string;
    upload: string;
    ping: string;
  };
}

const serverConfig: ServerConfig = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    download: '/download',
    upload: '/upload',
    ping: '/ping'
  }
};

export default serverConfig;