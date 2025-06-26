# Speed Test Application

This application provides a comprehensive internet speed testing solution with a React frontend and a custom Node.js backend for accurate speed measurements.

## Features

- Download speed testing
- Upload speed testing
- Ping and latency measurement
- Packet loss detection
- Bufferbloat analysis
- Modern, responsive UI
- Docker-based deployment for easy setup
- Environment-specific configuration
- Production-ready logging

## Project Structure

- `/project` - React frontend application
- `/backend` - Node.js Express backend server

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

   The server will run on port 3000 by default. You should see a message: `Speed test backend server running on port 3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend will typically run on port 5173 or another available port.

## Using the Application

1. Open your browser and navigate to the frontend URL (e.g., http://localhost:5173)
2. The speed test will start automatically or click the "Start Test" button
3. View your results for download speed, upload speed, ping, and other metrics

## Backend API Endpoints

- `GET /ping` - Used for ping/latency testing
- `GET /download` - Serves random data for download speed testing
  - Query parameter: `bytes` - Size of data to download (default: 1MB)
- `POST /upload` - Accepts data uploads for upload speed testing
- `GET /status` - Returns server status information

## Configuration

The frontend is configured to connect to the backend using the settings in `project/src/config/serverConfig.ts`. If you need to change the backend URL or port, update this file.

## Troubleshooting

- If you encounter CORS issues, ensure both frontend and backend are running
- Check browser console for any error messages
- Verify that the backend server is running and accessible
- For production issues, check the logs in `backend/logs/access.log`

## Performance Considerations

- The backend generates random data on-the-fly to avoid caching issues
- Multiple parallel connections are used to saturate bandwidth
- Cache prevention headers are set on all responses
- Cluster mode is enabled by default to utilize all CPU cores

## CI/CD Pipelines

This project includes GitHub Actions workflows for continuous integration and deployment:

### CI/CD Pipeline

The `.github/workflows/ci-cd.yml` workflow handles:

- Building and testing the application on every push and pull request
- Building and pushing Docker images to Docker Hub on pushes to the main branch

### Render Deployment

The `.github/workflows/render-deploy.yml` workflow handles:

- Automatic deployment to Render on pushes to the main branch
- Deploys both frontend and backend services
- Requires the following GitHub secrets:
  - `RENDER_API_KEY`: Your Render API key
  - `RENDER_SERVICE_ID_BACKEND`: Your backend service ID
  - `RENDER_SERVICE_ID_FRONTEND`: Your frontend service ID

### Kubernetes Deployment

The `.github/workflows/kubernetes-deploy.yml` workflow handles:

- Automatic deployment to Kubernetes when changes are made to Kubernetes or Helm configurations
- Uses Helm to deploy the application to a Kubernetes cluster
- Requires the following GitHub secrets:
  - `KUBE_CONFIG`: Your Kubernetes configuration file (base64 encoded)
  - `DOCKER_USERNAME`: Your Docker Hub username

### Security Scanning

The `.github/workflows/security-scan.yml` workflow handles:

- Dependency vulnerability scanning using npm audit and Snyk
- Code security analysis using GitHub CodeQL
- Docker image scanning using Trivy
- Runs on pushes to main, pull requests, and weekly on Sundays
- Requires the following GitHub secrets (optional):
  - `SNYK_TOKEN`: Your Snyk API token for enhanced dependency scanning

### Performance Testing

The `.github/workflows/performance-test.yml` workflow handles:

- Automated load testing using k6
- Tests API endpoints for response time and reliability
- Runs on pushes to main branch when backend or frontend code changes
- Enforces performance thresholds:
  - 95% of requests complete under 500ms
  - Less than 10% error rate
- Archives test results as workflow artifacts

### Code Quality

The `.github/workflows/code-quality.yml` workflow handles:

- Linting for both frontend and backend code
- Code formatting checks using Prettier
- Static code analysis with SonarCloud
- Runs on pushes to main and pull requests
- Requires the following GitHub secrets:
  - `SONAR_TOKEN`: Your SonarCloud API token

### Documentation Generation

The `.github/workflows/docs-generation.yml` workflow handles:

- Automatic generation of API documentation using JSDoc and Swagger
- TypeScript documentation generation for the frontend
- Publishes documentation to GitHub Pages
- Runs on pushes to main branch when code or markdown files change
- Documentation is available at:
  - API docs: `https://<username>.github.io/<repo>/api-docs`
  - Frontend docs: `https://<username>.github.io/<repo>/frontend-docs`

### Release Management

The `.github/workflows/release.yml` workflow handles:

- Automated release creation when a new tag is pushed
- Generates changelog from git commits
- Creates GitHub release with release notes
- Builds and uploads frontend and backend artifacts
- Builds and pushes versioned Docker images
- Can be triggered manually with a specific version
- Requires the following GitHub secrets:
  - `DOCKER_USERNAME`: Your Docker Hub username
  - `DOCKER_PASSWORD`: Your Docker Hub password

### Dependency Updates

The `.github/workflows/dependency-updates.yml` workflow handles:

- Weekly automated dependency updates for all packages
- Creates pull requests with dependency changes
- Configures Renovate for more granular dependency management
- Can be triggered manually to update dependencies immediately
- Automatically merges minor and patch updates for stable dependencies

### Issue Management

The `.github/workflows/issue-management.yml` workflow handles:

- Automatic issue triage and labeling based on keywords
- Welcome messages for first-time contributors
- Stale issue and PR management
- Project board automation for organizing tasks
- Runs on issue/PR events and daily for maintenance tasks

### Environment Deployment

The `.github/workflows/environment-deploy.yml` workflow handles:

- Environment-specific deployments (development, staging, production)
- Automatic deployment based on branch (main → production, staging → staging, others → development)
- Manual deployment to any environment via workflow dispatch
- Environment-specific configuration and build parameters
- Slack notifications for deployment status
- Requires the following GitHub secrets:
  - `DOCKER_USERNAME` and `DOCKER_PASSWORD`: Docker Hub credentials
  - `RENDER_DEPLOY_HOOK_DEV`, `RENDER_DEPLOY_HOOK_STAGING`, `RENDER_DEPLOY_HOOK_PROD`: Render deploy hooks
  - `DEV_API_URL`, `STAGING_API_URL`, `PROD_API_URL`: Environment-specific API URLs
  - `SLACK_WEBHOOK`: Webhook for Slack notifications

### Scheduled Backups

The `.github/workflows/scheduled-backups.yml` workflow handles:

- Daily automated backups of code repository
- Database backups (disabled by default until configured)
- Retention policies for backups (7 days for code, 3 days for database)
- Email notifications of backup status
- Uploads backups as GitHub artifacts and optionally to S3
- Requires the following GitHub secrets (when fully enabled):
  - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: AWS credentials for S3 storage
  - `BACKUP_BUCKET_NAME`: S3 bucket for storing backups
  - `MONGODB_URI`: Connection string for MongoDB database
  - `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: Email server details
  - `ADMIN_EMAIL`: Email address for notifications

### Monitoring and Alerts

The `.github/workflows/monitoring.yml` workflow handles:

- Service health checks every 15 minutes
- Monitors both production and staging environments
- Performance metrics collection and threshold alerts
- Multi-channel notifications (Slack and email) based on severity
- Critical alerts for production issues, warnings for staging
- Requires the following GitHub secrets:
  - `PROD_API_URL` and `PROD_FRONTEND_URL`: Production service URLs
  - `STAGING_API_URL` and `STAGING_FRONTEND_URL`: Staging service URLs
  - `SLACK_WEBHOOK`: Webhook for Slack notifications
  - `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: Email server details
  - `ADMIN_EMAIL`: Email address for critical alerts

### Branch Protection

The `.github/workflows/branch-protection.yml` workflow enforces code quality standards:

- Validates commit message format using Conventional Commits standard
- Enforces branch naming conventions (e.g., feature/*, bugfix/*, etc.)
- Detects and warns about changes to protected files/directories
- Checks for merge conflicts before allowing merges
- Monitors PR size and warns/blocks excessively large changes
- Automatically comments on PRs with relevant warnings
- Runs on pull requests to main and staging branches

### Pull Request Labeler

The `.github/workflows/pr-labeler.yml` workflow automatically labels pull requests:

- Adds component labels based on modified files (frontend, backend, infrastructure, etc.)
- Labels PRs by size (XS, S, M, L, XL, XXL) based on the number of changes
- Adds type labels based on branch name (feature, bugfix, hotfix, etc.)
- Marks draft PRs with a status label
- Uses the `.github/labeler-config.yml` file for file path to label mappings
- Helps with PR organization and filtering

### Auto-Merge

The `.github/workflows/auto-merge.yml` workflow streamlines the PR process:

- Automatically merges PRs with the `auto-merge` label after required approvals
- Special handling for Dependabot PRs:
  - Auto-approves and merges minor and patch updates
  - Adds warning comments on major version updates
- Auto-approves documentation-only PRs
- Uses squash merging by default and deletes branches after merging
- Respects the `do-not-merge` label to prevent automatic merging

### Changelog Generation

The `.github/workflows/changelog.yml` workflow maintains a comprehensive record of changes:

- Automatically generates and updates CHANGELOG.md on pushes to main branch
- Uses Conventional Commits standard to categorize changes
- Creates release PRs when manually triggered with a specific version
- Auto-increments patch version if no version is specified
- Formats changelog entries by type (features, fixes, etc.)
- Labels generated release PRs with `type/release` and `auto-merge`

### CI/CD Dashboard

The `.github/workflows/dashboard.yml` workflow provides visibility into all workflows:

- Generates a comprehensive dashboard of all GitHub Actions workflows
- Displays success rates, run counts, and statuses for the last 30 days
- Creates visual charts for workflow performance metrics
- Updates automatically after each workflow run and weekly
- Deploys to GitHub Pages for easy access
- Includes both HTML dashboard and Markdown summary

### Workflow Status Badges

The `.github/workflows/workflow-badges.yml` workflow generates status badges:

- Creates SVG badges for each workflow showing current status
- Updates an overall CI/CD status badge
- Refreshes automatically after workflow runs and every 6 hours
- Displays badges in a dedicated README in the badges directory
- Uses color-coding for quick status identification (green for passing, red for failing, etc.)
- Provides a markdown table of all workflow statuses

### Workflow Visualization

The `.github/workflows/workflow-visualization.yml` workflow creates visual diagrams:

- Generates Mermaid flowcharts for each GitHub Actions workflow
- Creates an overview diagram showing the entire CI/CD pipeline structure
- Updates automatically when workflows are modified
- Categorizes workflows by purpose (build, deploy, security, etc.)
- Converts diagrams to SVG format for easy viewing
- Maintains a documentation directory with all visualizations

## Deployment

### Render Deployment (Recommended)

The easiest way to deploy the application is using Render:

1. Create an account on [Render](https://render.com/) if you don't have one

2. Connect your GitHub repository to Render

3. Use the Blueprint deployment option to automatically configure services based on the `render.yaml` file

4. Alternatively, manually configure the services with these settings:

   #### Frontend Service (Static Site)
   - Root Directory: `project`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

   #### Backend Service (Web Service)
   - Root Directory: (leave empty - use repository root)
   - Build Command: `npm install && npm run build:backend`
   - Start Command: `cd backend && npm start`

5. Add the following environment variables in Render dashboard:
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `ENABLE_CLUSTER`: `true`
   - `RATE_LIMIT_WINDOW_MS`: `60000`
   - `RATE_LIMIT_MAX_REQUESTS`: `100`
   - `KEEP_ALIVE_TIMEOUT`: `65000`
   - `HEADERS_TIMEOUT`: `66000`
   - `VITE_API_BASE_URL`: Your Render backend service URL

6. For automated deployments, set up the following GitHub secrets:
   - `RENDER_API_KEY`: Your Render API key
   - `RENDER_SERVICE_ID_BACKEND`: Your backend service ID
   - `RENDER_SERVICE_ID_FRONTEND`: Your frontend service ID

7. Once deployed, Render will provide you with URLs to access your services

### Railway Deployment

Alternatively, you can deploy the application using Railway.com:

1. Create an account on [Railway](https://railway.app/) if you don't have one

2. Connect your GitHub repository to Railway

3. Create a new project and select your repository

4. Configure the project with the following settings:
   - Root Directory: `/` (root of the repository)
   - Build Command: `npm run build:all`
   - Start Command: `npm start`

5. Add the following environment variables in Railway dashboard:
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `ENABLE_CLUSTER`: `true`
   - `RATE_LIMIT_WINDOW_MS`: `60000`
   - `RATE_LIMIT_MAX_REQUESTS`: `100`
   - `KEEP_ALIVE_TIMEOUT`: `65000`
   - `HEADERS_TIMEOUT`: `66000`
   - `VITE_API_BASE_URL`: Your Railway app URL (e.g., `https://your-app-name.railway.app`)

6. Deploy the application by clicking the "Deploy" button

7. Once deployed, Railway will provide you with a URL to access your application

### Docker Deployment

Alternatively, you can deploy the application using Docker:

1. Make sure Docker and Docker Compose are installed on your system

2. Run the deployment script:
   - On Linux/Mac: `./deploy.sh`
   - On Windows: `deploy.bat`

3. The application will be available at:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3000

### Manual Deployment

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install production dependencies:
   ```
   npm ci --only=production
   ```

3. Create a `.env` file based on `.env.production`

4. Start the server:
   ```
   NODE_ENV=production node server.js
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd project
   ```

2. Install dependencies:
   ```
   npm ci
   ```

3. Create a `.env.production` file with the backend URL:
   ```
   VITE_API_BASE_URL=http://your-backend-url:3000
   ```

4. Build the application:
   ```
   npm run build
   ```

5. Serve the built files using a static file server:
   ```
   npx serve -s dist
   ```

### Environment Variables

#### Backend

- `PORT`: The port on which the backend server runs (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `ENABLE_CLUSTER`: Whether to enable cluster mode (true/false)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `KEEP_ALIVE_TIMEOUT`: Keep-alive timeout in milliseconds
- `HEADERS_TIMEOUT`: Headers timeout in milliseconds

#### Frontend

- `VITE_API_BASE_URL`: The URL of the backend API