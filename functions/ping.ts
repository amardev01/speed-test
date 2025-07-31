/**
 * Ping endpoint for latency measurement
 * Cloudflare Pages Function
 */

export async function onRequestGET(context: any) {
  const { request } = context;
  
  try {
    const startTime = Date.now();
    const clientTimestamp = new URL(request.url).searchParams.get('t');
    const serverTimestamp = Date.now();
    
    const response = {
      timestamp: serverTimestamp,
      clientTimestamp: clientTimestamp ? parseInt(clientTimestamp) : null,
      serverProcessingTime: serverTimestamp - startTime,
      message: 'pong'
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
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