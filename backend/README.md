# High-Performance Speed Test Backend Server

This backend server is optimized to handle millions of concurrent requests for speed testing applications. It uses clustering, streaming optimizations, and efficient memory management to provide reliable performance metrics even under extreme load.

## Features

- **Cluster Mode**: Automatically utilizes all available CPU cores for maximum throughput
- **Memory Optimization**: Uses shared buffer pools to minimize memory usage
- **Streaming Processing**: Efficiently handles large uploads and downloads without buffering entire payloads
- **Performance Metrics**: Detailed statistics for monitoring server performance
- **Rate Limiting**: Configurable rate limiting to prevent abuse (disabled for speed test endpoints)
- **Compression**: Automatic response compression for reduced bandwidth usage
- **Security Headers**: Implements best practices for web security

## Endpoints

### Ping Testing

- `GET /ping`: Standard ping endpoint with detailed timing information
- `HEAD /ping`: Minimal ping endpoint for latency testing
- `GET /fastping`: Ultra-lightweight ping endpoint for accurate latency measurement

### Speed Testing

- `GET /download`: Generates random data for download speed testing
  - Query parameter: `bytes` - Size in bytes to download (default: 1MB, max: 500MB)
- `POST /upload`: Accepts data uploads for upload speed testing
  - Supports raw binary data with `Content-Type: application/octet-stream`

### Monitoring

- `GET /status`: Detailed server status including system metrics, request counts, and performance data
- `GET /health`: Lightweight health check endpoint

## Performance Capabilities

- **Concurrent Connections**: Can handle millions of concurrent connections (limited by system resources)
- **Throughput**: Optimized for multi-gigabit throughput
- **CPU Utilization**: Efficiently distributes load across all available CPU cores
- **Memory Usage**: Minimizes memory usage through buffer reuse and streaming processing

## Installation

```bash
npm install
```

## Running the Server

### Production Mode

```bash
npm start
```

This will automatically start the server in cluster mode, utilizing all available CPU cores.

### Development Mode

```bash
npm run dev
```

This uses nodemon for automatic reloading during development.

## Configuration

The server is configured for optimal performance out of the box, but you can modify the following settings in `server.js`:

- **Rate Limiting**: Adjust the `apiLimiter` settings to change request limits
- **Timeouts**: Modify `app.timeout` to change the default socket timeout
- **Chunk Sizes**: Adjust the chunk sizes in the download endpoint for different performance characteristics

## Monitoring

The server logs performance metrics periodically:

- Master process logs overall statistics every minute
- Worker processes log their individual statistics every 5 minutes
- Download and upload completions are logged with throughput information

Use the `/status` endpoint to get real-time performance metrics.

## System Requirements

- Node.js 16.0.0 or higher
- Sufficient CPU cores and memory for expected load
- Network interface capable of handling expected throughput