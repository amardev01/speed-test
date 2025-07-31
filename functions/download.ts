/**
 * Download endpoint for speed testing
 * Cloudflare Pages Function
 */

export async function onRequestGET(context: any) {
  const { request } = context;
  
  try {
    const url = new URL(request.url);
    const size = parseInt(url.searchParams.get('size') || '10485760'); // Default 10MB
    const chunkSize = parseInt(url.searchParams.get('chunkSize') || '65536'); // Default 64KB
    
    // Limit maximum size to 100MB for safety
    const safeSize = Math.min(size, 100 * 1024 * 1024);
    const safechunkSize = Math.min(chunkSize, 1024 * 1024); // Max 1MB chunks
    
    // Generate random data for the test
    const generateRandomChunk = (size: number): Uint8Array => {
      const chunk = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        chunk[i] = Math.floor(Math.random() * 256);
      }
      return chunk;
    };
    
    // Create a readable stream for the response
    const stream = new ReadableStream({
      start(controller) {
        let bytesSent = 0;
        
        const sendChunk = () => {
          if (bytesSent >= safeSize) {
            controller.close();
            return;
          }
          
          const remainingBytes = safeSize - bytesSent;
          const currentChunkSize = Math.min(safechunkSize, remainingBytes);
          const chunk = generateRandomChunk(currentChunkSize);
          
          controller.enqueue(chunk);
          bytesSent += currentChunkSize;
          
          // Schedule next chunk
          setTimeout(sendChunk, 0);
        };
        
        sendChunk();
      }
    });
    
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': safeSize.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Connection': 'keep-alive'
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