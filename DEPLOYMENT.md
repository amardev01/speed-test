# Deployment Guide

## Production Deployment

This application is ready for production deployment on various platforms including Render, Vercel, Netlify, or traditional servers.

### For Render Deployment

1. **Build Settings:**
   - Build Command: `cd project && npm install && npm run build`
   - Start Command: `php -S 0.0.0.0:$PORT server.php`
   - Environment: `PHP 8.x`

2. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-app-name.onrender.com
   VITE_WS_URL=wss://your-app-name.onrender.com
   NODE_ENV=production
   ```

### For Apache/Nginx + PHP

1. **Apache Configuration (.htaccess):**
   ```apache
   RewriteEngine On
   
   # Handle CORS
   Header always set Access-Control-Allow-Origin "*"
   Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
   Header always set Access-Control-Allow-Headers "Content-Type, Content-Encoding"
   
   # Route backend requests
   RewriteRule ^backend/(.*)$ backend/$1 [L]
   
   # SPA routing - serve index.html for all other requests
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

2. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/speedtestapplication/project/dist;
       index index.html;
   
       # CORS headers
       add_header Access-Control-Allow-Origin *;
       add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
       add_header Access-Control-Allow-Headers "Content-Type, Content-Encoding";
   
       # Handle backend PHP requests
       location /backend/ {
           try_files $uri $uri/ @php;
       }
   
       location @php {
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME /path/to/speedtestapplication$fastcgi_script_name;
           include fastcgi_params;
       }
   
       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### File Structure for Production

```
speedtestapplication/
├── backend/                 # PHP backend files
│   ├── garbage.php         # Download test endpoint
│   ├── empty.php           # Upload/ping endpoint
│   ├── getIP.php           # IP detection endpoint
│   └── *.mmdb              # GeoIP database files
├── project/dist/           # Built frontend files
│   ├── index.html
│   ├── assets/
│   └── ...
├── server.php              # Development server (not needed in production)
└── .env                    # Environment configuration
```

### Requirements

- **PHP 7.4+** with extensions:
  - `curl` (for IP detection)
  - `json` (for API responses)
  - `mbstring` (for string handling)
- **Web server** (Apache/Nginx) or **Platform** (Render/Vercel)
- **HTTPS** recommended for production

### Security Considerations

1. **CORS**: Properly configure allowed origins in production
2. **Rate Limiting**: Implement rate limiting for speed test endpoints
3. **HTTPS**: Use SSL/TLS certificates
4. **File Permissions**: Ensure proper file permissions on server

### Performance Optimization

1. **Gzip Compression**: Enable gzip for static assets
2. **Caching**: Configure appropriate cache headers
3. **CDN**: Consider using a CDN for static assets
4. **PHP OPcache**: Enable PHP OPcache for better performance

### Monitoring

- Health check endpoint: `/health`
- Status endpoint: `/status`
- Monitor server logs for errors
- Set up uptime monitoring