# Complete Render Deployment Guide for SpeedTest Pro

This guide provides all the necessary commands and steps to deploy SpeedTest Pro on Render successfully.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Git**: Ensure Git is installed and configured

## Deployment Commands

### 1. Prepare the Repository

```bash
# Navigate to your project directory
cd C:\speedtestapplication

# Add all changes to Git
git add .

# Commit the changes
git commit -m "Configure for Render deployment"

# Push to your GitHub repository
git push origin main
```

### 2. Deploy Using render.yaml (Recommended)

#### Option A: Automatic Deployment via GitHub

1. **Connect Repository to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub account
   - Select your repository
   - Render will automatically detect the `render.yaml` file

2. **Deploy**:
   - Click "Apply" to deploy both services
   - Wait for deployment to complete (5-10 minutes)

#### Option B: Manual Service Creation

If automatic deployment doesn't work, create services manually:

**Backend Service:**
```
Service Type: Web Service
Name: speedtest-backend
Environment: Node
Build Command: cd backend && npm ci
Start Command: cd backend && npm start
Plan: Free
Environment Variables:
  - NODE_ENV=production
  - PORT=10000
```

**Frontend Service:**
```
Service Type: Web Service
Name: speedtest-frontend
Environment: Node
Build Command: cd project && npm ci && npm run build
Start Command: cd project && npm start
Plan: Free
Environment Variables:
  - NODE_ENV=production
  - PORT=10000
  - VITE_API_BASE_URL=https://speedtest-backend.onrender.com
```

### 3. Verify Deployment

#### Check Backend Health
```bash
# Test backend API (replace with your actual backend URL)
curl https://speedtest-backend.onrender.com/health
```

#### Check Frontend
```bash
# Test frontend (replace with your actual frontend URL)
curl https://speedtest-frontend.onrender.com
```

### 4. Troubleshooting Commands

#### View Logs
```bash
# In Render Dashboard:
# 1. Go to your service
# 2. Click "Logs" tab
# 3. Monitor real-time logs
```

#### Local Testing Before Deployment
```bash
# Test backend locally
cd backend
npm ci
npm start

# Test frontend locally (in another terminal)
cd project
npm ci
npm run build
npm start
```

#### Debug Build Issues
```bash
# Check Node.js version compatibility
node --version
npm --version

# Clear npm cache if needed
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables Setup

### Required Environment Variables

**Backend Service:**
- `NODE_ENV=production`
- `PORT=10000`

**Frontend Service:**
- `NODE_ENV=production`
- `PORT=10000`
- `VITE_API_BASE_URL=https://speedtest-backend.onrender.com`

### Setting Environment Variables in Render

1. Go to your service in Render Dashboard
2. Click "Environment" tab
3. Add the required variables
4. Click "Save Changes"
5. Service will automatically redeploy

## Post-Deployment Steps

### 1. Update DNS (if using custom domain)
```bash
# Add CNAME record pointing to:
# your-app-name.onrender.com
```

### 2. Enable HTTPS
- Render automatically provides SSL certificates
- No additional configuration needed

### 3. Monitor Performance
- Check Render Dashboard for metrics
- Monitor response times and uptime

## Common Issues and Solutions

### Build Failures
```bash
# Issue: "npm: command not found"
# Solution: Ensure Node.js environment is selected

# Issue: "vite: command not found"
# Solution: Use npx vite in package.json scripts

# Issue: "Module not found"
# Solution: Check package.json dependencies
```

### Runtime Errors
```bash
# Issue: "Cannot connect to backend"
# Solution: Verify VITE_API_BASE_URL is correct

# Issue: "WebSocket connection failed"
# Solution: Check WebSocket URL configuration

# Issue: "404 on page refresh"
# Solution: Ensure SPA routing is configured
```

## Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] `render.yaml` configured correctly
- [ ] Backend service deployed and healthy
- [ ] Frontend service deployed and accessible
- [ ] Environment variables set correctly
- [ ] API connection working
- [ ] WebSocket connection working
- [ ] All features tested in production

## Support Commands

### Update Deployment
```bash
# Make changes to your code
git add .
git commit -m "Update deployment"
git push origin main
# Render will automatically redeploy
```

### Rollback Deployment
```bash
# In Render Dashboard:
# 1. Go to service
# 2. Click "Deploys" tab
# 3. Click "Rollback" on previous successful deploy
```

### Scale Services
```bash
# In Render Dashboard:
# 1. Go to service
# 2. Click "Settings" tab
# 3. Change plan or add autoscaling
```

## Final Notes

- Free tier services may sleep after 15 minutes of inactivity
- First request after sleep may take 30+ seconds
- Consider upgrading to paid plans for production use
- Monitor usage to avoid hitting free tier limits

For additional support, refer to [Render Documentation](https://render.com/docs) or contact Render support.