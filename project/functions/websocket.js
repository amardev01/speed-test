// Durable Object for WebSocket state management
export class WebSocketState {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
  }

  async fetch(request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, server);

    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'ping':
            server.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
              originalTimestamp: data.timestamp
            }));
            break;
            
          case 'download_start':
            // Send test data for download speed test
            const testData = 'x'.repeat(data.size || 1024 * 1024); // 1MB default
            server.send(JSON.stringify({
              type: 'download_data',
              data: testData,
              timestamp: Date.now()
            }));
            break;
            
          case 'upload_data':
            // Acknowledge upload data receipt
            server.send(JSON.stringify({
              type: 'upload_ack',
              timestamp: Date.now(),
              receivedSize: data.data ? data.data.length : 0
            }));
            break;
            
          default:
            server.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        server.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON message'
        }));
      }
    });

    server.addEventListener('close', () => {
      this.sessions.delete(sessionId);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/websocket') {
      const id = env.WEBSOCKET_STATE.idFromName('global');
      const obj = env.WEBSOCKET_STATE.get(id);
      return obj.fetch(request);
    }
    
    return new Response('Not found', { status: 404 });
  }
};