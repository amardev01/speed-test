# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Speed Test Application to Cloudflare Pages with Functions.

## Architecture Overview

The application has been restructured for Cloudflare Pages deployment:

- **Frontend**: React application built with Vite (served as static assets)
- **Backend**: Migrated from Express.js to Cloudflare Pages Functions
- **WebSocket**: Implemented using Cloudflare Durable Objects for real-time communication
- **Configuration**: Environment-aware configuration for seamless deployment

## Project Structure

```
speedtestapplication/
├── functions/                 # Cloudflare Pages Functions
│   ├── ping.ts               # Ping endpoint for latency testing
│   ├── download.ts           # Download speed test endpoint
│   ├── upload.ts             # Upload speed test endpoint
│   ├── status.ts             # Server status information
│   ├── health.ts             # Health check endpoint
│   ├── websocket.ts          # WebSocket handler with Durable Objects
│   └── _routes.json          # Route configuration
├── project/                  # React frontend application
├── wrangler.toml            # Cloudflare Workers configuration
├── package.json             # Root package.json with deployment scripts
└── CLOUDFLARE_DEPLOYMENT.md # This deployment guide
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Cloudflare Account** with Pages access
3. **Wrangler CLI** (installed via npm)
4. **Git repository** (for automatic deployments)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies (including Wrangler)
npm install

# Install frontend dependencies
cd project
npm install
cd ..
```

### 2. Configure Wrangler

```bash
# Login to Cloudflare
npx wrangler login

# Verify your account
npx wrangler whoami
```

### 3. Create KV Namespace (Optional)

If you want to store test results:

```bash
# Create KV namespace for production
npx wrangler kv:namespace create "SPEED_TEST_RESULTS"

# Create KV namespace for preview
npx wrangler kv:namespace create "SPEED_TEST_RESULTS" --preview
```

Update the KV namespace IDs in `wrangler.toml`.

### 4. Build the Application

```bash
# Build the frontend
npm run build:cf
```

### 5. Deploy to Cloudflare Pages

#### Option A: Manual Deployment

```bash
# Deploy to Cloudflare Pages
npm run cf:deploy
```

#### Option B: Git-based Deployment (Recommended)

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Cloudflare Pages deployment setup"
   git push origin main
   ```

2. **Connect Repository to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your Git repository
   - Configure build settings:
     - **Build command**: `npm run build:cf`
     - **Build output directory**: `project/dist`
     - **Root directory**: `/` (leave empty)

3. **Environment Variables**:
   Set the following in Cloudflare Pages dashboard:
   ```
   NODE_ENV=production
   VITE_API_BASE_URL=https://your-pages-domain.pages.dev
   VITE_WS_URL=wss://your-pages-domain.pages.dev/websocket
   ```

## Local Development with Cloudflare

```bash
# Build the frontend first
npm run build:cf

# Start local Cloudflare Pages development server
npm run cf:dev
```

This will start a local server that mimics the Cloudflare Pages environment.

## Configuration Files

### wrangler.toml

Main configuration file for Cloudflare Workers/Pages:
- Compatibility settings
- Environment variables
- Durable Objects bindings
- KV namespace bindings

### functions/_routes.json

Defines which routes are handled by Functions vs static assets:
- API endpoints → Functions
- Static assets → Direct serving

## API Endpoints

After deployment, the following endpoints will be available:

- `GET /ping` - Latency measurement
- `GET /download?size=10485760` - Download speed test
- `POST /upload` - Upload speed test
- `GET /status` - Server status information
- `GET /health` - Health check
- `GET /websocket` - WebSocket connection (upgrade)

## WebSocket Implementation

The WebSocket functionality uses Cloudflare Durable Objects:
- **Persistent state** across requests
- **Real-time communication** for speed tests
- **Automatic scaling** and global distribution

## Environment Variables

### Production (Cloudflare Pages Dashboard)

```env
NODE_ENV=production
VITE_API_BASE_URL=https://your-domain.pages.dev
VITE_WS_URL=wss://your-domain.pages.dev/websocket
```

### Development (.env.local in project/)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Monitoring and Debugging

### View Logs

```bash
# View real-time logs
npx wrangler pages deployment tail
```

### Analytics

- **Cloudflare Analytics**: Built-in traffic and performance metrics
- **Workers Analytics**: Function execution metrics
- **Real User Monitoring**: Available in Cloudflare dashboard

## Performance Optimizations

1. **Global CDN**: Automatic edge caching for static assets
2. **Edge Computing**: Functions run close to users
3. **Compression**: Automatic Brotli/Gzip compression
4. **HTTP/3**: Latest protocol support
5. **Smart Routing**: Optimal path selection

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (>=18)
   - Verify all dependencies are installed
   - Check build logs in Cloudflare dashboard

2. **Function Errors**:
   - Check Wrangler logs: `npx wrangler pages deployment tail`
   - Verify environment variables
   - Check compatibility flags in wrangler.toml

3. **WebSocket Issues**:
   - Ensure Durable Objects are properly configured
   - Check WebSocket URL format (wss:// for HTTPS)
   - Verify _routes.json includes /websocket

### Debug Commands

```bash
# Check Wrangler configuration
npx wrangler pages project list

# View deployment status
npx wrangler pages deployment list

# Test functions locally
npx wrangler pages dev project/dist --local
```

## Custom Domain Setup

1. **Add Custom Domain**:
   - Go to Pages project → Custom domains
   - Add your domain
   - Update DNS records as instructed

2. **Update Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://your-custom-domain.com
   VITE_WS_URL=wss://your-custom-domain.com/websocket
   ```

## Security Features

- **Automatic HTTPS**: SSL certificates managed by Cloudflare
- **DDoS Protection**: Built-in protection against attacks
- **Rate Limiting**: Configurable in wrangler.toml
- **CORS**: Properly configured for cross-origin requests

## Cost Optimization

- **Free Tier**: 100,000 requests/day included
- **Pay-as-you-go**: Only pay for usage above free tier
- **No server costs**: Serverless architecture
- **Global distribution**: No additional CDN costs

## Migration from Traditional Backend

Key changes made during migration:

1. **Express.js → Functions**: Each route became a separate function
2. **WebSocket Server → Durable Objects**: Persistent WebSocket state
3. **Environment Configuration**: Dynamic URL detection
4. **Build Process**: Integrated with Vite build
5. **Deployment**: Git-based continuous deployment

## Support

For issues specific to Cloudflare Pages:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

For application-specific issues:
- Check the main README.md
- Review function logs in Cloudflare dashboard
- Test locally with `npm run cf:dev`