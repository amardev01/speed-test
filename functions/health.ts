/**
 * Health endpoint for basic health checks
 * Cloudflare Pages Function
 */

export async function onRequestGET(context: any) {
  try {
    const timestamp = Date.now();
    
    const healthResponse = {
      status: 'ok',
      timestamp,
      uptime: 'N/A (Serverless)',
      region: context.cf?.colo || 'unknown',
      country: context.cf?.country || 'unknown',
      version: '2.0.0-cloudflare'
    };
    
    return new Response(JSON.stringify(healthResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}