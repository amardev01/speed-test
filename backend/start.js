// Simple start script for the backend server
// This avoids using shell operators like && which may not work in all environments

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change directory to backend (if not already there)
process.chdir(__dirname);

// Start the server
console.log('Starting backend server...');
import('./server.js');