import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'project', 'dist');
const targetDir = path.join(__dirname, '..', 'backend', 'public');

console.log('Copying frontend files...');
console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created target directory');
}

// Copy files recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    return;
  }

  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursive(sourceDir, targetDir);
  console.log('Frontend files copied successfully!');
} catch (error) {
  console.error('Error copying frontend files:', error);
  process.exit(1);
} 