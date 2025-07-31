/**
 * Index function for Cloudflare Pages
 * This helps with routing and provides a basic health check
 */

export async function onRequestGET(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Basic API information
  const apiInfo = {
    name: 'SpeedTest Pro API',
    version: '2.0.0',
    timestamp: Date.now(),
    endpoints: {
      ping: '/ping',
      download: '/download',
      upload: '/upload',
      status: '/status',
      health: '/health',
      websocket: '/websocket'
    },
    message: 'SpeedTest Pro API is running on Cloudflare Pages'
  };
  
  return new Response(JSON.stringify(apiInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function onRequestOPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}