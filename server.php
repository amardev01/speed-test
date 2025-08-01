<?php
/**
 * Simple PHP server for LibreSpeed backend
 * This serves the LibreSpeed backend files and handles CORS
 */

// Enable CORS for all requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Encoding');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the requested path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Route requests to appropriate backend files
switch ($path) {
    case 'backend/garbage.php':
        require_once __DIR__ . '/backend/garbage.php';
        break;
        
    case 'backend/empty.php':
        require_once __DIR__ . '/backend/empty.php';
        break;
        
    case 'backend/getIP.php':
        require_once __DIR__ . '/backend/getIP.php';
        break;
        
    case 'status':
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'ok',
            'server' => 'LibreSpeed Backend',
            'version' => '1.0.0',
            'timestamp' => date('c')
        ]);
        break;
        
    case 'health':
        header('Content-Type: application/json');
        echo json_encode([
            'healthy' => true,
            'uptime' => time(),
            'services' => [
                'download' => 'ok',
                'upload' => 'ok',
                'ping' => 'ok',
                'getIP' => 'ok'
            ]
        ]);
        break;
        
    default:
        // Serve static files from the project directory
        $filePath = __DIR__ . '/project/dist/' . $path;
        
        if (file_exists($filePath) && is_file($filePath)) {
            $mimeType = mime_content_type($filePath);
            header('Content-Type: ' . $mimeType);
            readfile($filePath);
        } else {
            // Fallback to index.html for SPA routing
            $indexPath = __DIR__ . '/project/dist/index.html';
            if (file_exists($indexPath)) {
                header('Content-Type: text/html');
                readfile($indexPath);
            } else {
                http_response_code(404);
                echo 'File not found';
            }
        }
        break;
}
?>