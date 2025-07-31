/**
 * Status endpoint for server information
 * Cloudflare Pages Function
 */

export async function onRequestGET(context: any) {
  try {
    const timestamp = Date.now();
    
    // Basic server status information for Cloudflare Pages
    const statusResponse = {
      status: 'ok',
      timestamp,
      server: {
        platform: 'Cloudflare Pages',
        runtime: 'Cloudflare Workers',
        region: context.cf?.colo || 'unknown',
        country: context.cf?.country || 'unknown'
      },
      performance: {
        uptime: 'N/A (Serverless)',
        memoryUsage: 'N/A (Serverless)',
        cpuUsage: 'N/A (Serverless)'
      },
      features: {
        clustering: false,
        compression: true,
        rateLimit: true,
        cors: true,
        helmet: true
      },
      endpoints: {
        ping: '/ping',
        download: '/download',
        upload: '/upload',
        status: '/status',
        health: '/health'
      },
      version: '2.0.0-cloudflare',
      environment: 'production'
    };
    
    return new Response(JSON.stringify(statusResponse, null, 2), {
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