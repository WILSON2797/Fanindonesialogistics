<?php
// ==========================================
// PT. Fis Logistics — PHP REST API Router
// ==========================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: *;");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config/database.php';

// Parse URI — strip base path
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^.*/api#', '', $uri);
$uri    = trim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];
$parts  = $uri ? explode('/', $uri) : [];
$resource = $parts[0] ?? '';
$id       = isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null;
$sub      = $parts[2] ?? null;

$db   = new Database();
$conn = $db->getConnection();

// Support both JSON and multipart/form-data
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'multipart/form-data') !== false) {
    $body = $_POST;
} else {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
}

// Global Security: Strip tags from all inputs to prevent XSS
// Except for specific fields if needed in the future
array_walk_recursive($body, function(&$item) {
    if (is_string($item)) {
        $item = strip_tags($item, '<b><i><u><strong><em><ul><li><ol><p><br><a>');
    }
});

// Check for method spoofing (common for PUT/DELETE in PHP multipart/form-data)
if ($method === 'POST' && isset($body['_method'])) {
    $method = strtoupper($body['_method']);
}

switch ($resource) {

    // --- AUTH ---
    case 'auth':
        require_once __DIR__ . '/controllers/AuthController.php';
        $c = new AuthController($conn);
        if ($id === 'login')  { $c->login($body);  break; }
        if ($id === 'logout') { $c->logout();       break; }
        if ($id === 'check')  { $c->check();        break; }
        if ($id === 'change-password' && $method === 'POST') { $c->changePassword($body); break; }
        break;

    // --- CONTENT (CMS) ---
    case 'content':
        require_once __DIR__ . '/controllers/ContentController.php';
        $c = new ContentController($conn);
        if ($method === 'GET') { $c->get($id); break; }
        if ($method === 'PUT') { $c->update($id, $body); break; }
        break;

    // --- SERVICES ---
    case 'services':
        require_once __DIR__ . '/controllers/ServicesController.php';
        $c = new ServicesController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'GET'    &&  $id)  { $c->getById($id);      break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- FLEET ---
    case 'fleet':
        require_once __DIR__ . '/controllers/FleetController.php';
        $c = new FleetController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- CLIENTS ---
    case 'clients':
        require_once __DIR__ . '/controllers/ClientsController.php';
        $c = new ClientsController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- COVERAGE ---
    case 'coverage':
        require_once __DIR__ . '/controllers/CoverageController.php';
        $c = new CoverageController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- QUOTES ---
    case 'quotes':
        require_once __DIR__ . '/controllers/QuoteController.php';
        $c = new QuoteController($conn);
        if ($method === 'POST' && !$id)              { $c->submit($body);            break; }
        if ($method === 'GET')                        { $c->getAll();                 break; }
        if ($method === 'PUT' && $id && $sub==='status') { $c->updateStatus($id,$body); break; }
        break;

    // --- CONTACT ---
    case 'contact':
        require_once __DIR__ . '/controllers/ContactController.php';
        $c = new ContactController($conn);
        if ($method === 'POST' && !$id)              { $c->submit($body);   break; }
        if ($method === 'GET')                        { $c->getAll();        break; }
        if ($method === 'PUT' && $id)                 { $c->markRead($id);  break; }
        break;

    // --- CUSTOMERS ---
    case 'customers':
        require_once __DIR__ . '/controllers/CustomersController.php';
        $c = new CustomersController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'GET'    &&  $id)  { $c->getById($id);      break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- CERTIFICATES ---
    case 'certificates':
        require_once __DIR__ . '/controllers/CertificatesController.php';
        $c = new CertificatesController($conn);
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- GALLERY ---
    case 'gallery':
        require_once __DIR__ . '/controllers/GalleryController.php';
        $c = new GalleryController($conn);
        if ($method === 'GET' && $id === 'categories') { $c->getCategories(); break; }
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- WAREHOUSE ---
    case 'warehouse':
        require_once __DIR__ . '/controllers/WarehouseController.php';
        $c = new WarehouseController($conn);
        // Gallery sub-resource: /warehouse/{id}/gallery
        if ($id && $sub === 'gallery') {
            if ($method === 'GET')    { $c->getGallery($id);        break; }
            if ($method === 'POST')   { $c->addGallery($id, $body); break; }
            break;
        }
        // Gallery delete: /warehouse/gallery/{galleryId} — uses 'gallery' as $id, $sub as galleryId
        if ($id === 'gallery' && $sub && $method === 'DELETE') {
            $c->deleteGallery($sub); break;
        }
        // Highlight sub-resource: /warehouse/{id}/highlights
        if ($id && $sub === 'highlights') {
            if ($method === 'GET')    { $c->getHighlights($id);        break; }
            if ($method === 'POST')   { $c->addHighlight($id, $body);  break; }
            break;
        }
        // Highlight delete: /warehouse/highlights/{highlightId}
        if ($id === 'highlights' && $sub && $method === 'DELETE') {
            $c->deleteHighlight($sub); break;
        }
        if ($method === 'GET'    && !$id)  { $c->getAll();          break; }
        if ($method === 'GET'    &&  $id)  { $c->getById($id);      break; }
        if ($method === 'POST')            { $c->create($body);      break; }
        if ($method === 'PUT'    &&  $id)  { $c->update($id,$body);  break; }
        if ($method === 'DELETE' &&  $id)  { $c->delete($id);        break; }
        break;

    // --- STATS (dashboard) ---
    case 'stats':
        require_once __DIR__ . '/middleware/Auth.php';
        Auth::check();
        $quotes   = $conn->query("SELECT COUNT(*) as c FROM quote_requests")->fetch()['c'];
        $messages = $conn->query("SELECT COUNT(*) as c FROM contact_messages")->fetch()['c'];
        $newQ     = $conn->query("SELECT COUNT(*) as c FROM quote_requests WHERE status='new'")->fetch()['c'];
        $unread   = $conn->query("SELECT COUNT(*) as c FROM contact_messages WHERE is_read=0")->fetch()['c'];
        echo json_encode(['success' => true, 'data' => compact('quotes','messages','newQ','unread')]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found.']);
}
