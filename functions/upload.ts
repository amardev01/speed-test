/**
 * Upload endpoint for speed testing
 * Cloudflare Pages Function
 */

export async function onRequestPOST(context: any) {
  const { request } = context;
  
  try {
    const startTime = Date.now();
    
    // Read the request body to simulate upload processing
    const body = await request.arrayBuffer();
    const uploadSize = body.byteLength;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate upload speed in bits per second
    const bitsPerSecond = uploadSize > 0 && duration > 0 ? (uploadSize * 8) / (duration / 1000) : 0;
    const mbps = bitsPerSecond / (1024 * 1024);
    
    const response = {
      timestamp: endTime,
      uploadSize,
      duration,
      speed: {
        bps: Math.round(bitsPerSecond),
        mbps: Math.round(mbps * 100) / 100
      },
      message: 'Upload test completed'
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