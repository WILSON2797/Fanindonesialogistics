<?php
header("Content-Type: application/xml; charset=utf-8");

// Konfigurasi Database
$configPath = __DIR__ . '/config.php';
if (file_exists($configPath)) {
    $config = require $configPath;
    $host = $config['db_host'] ?? 'localhost';
    $db   = $config['db_name'] ?? 'fis_logistics';
    $user = $config['db_user'] ?? 'root';
    $pass = $config['db_pass'] ?? '';
} else {
    $host = 'localhost';
    $db   = 'fis_logistics';
    $user = 'root';
    $pass = '';
}
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
     $pdo = new PDO($dsn, $user, $pass);
} catch (\PDOException $e) {
     exit("Error: " . $e->getMessage());
}

$baseUrl = "https://fanindonesialogistics.com";
$date = date('Y-m-d');

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

// 1. Static Pages
$staticPages = [
    '',
    '/about',
    '/services',
    '/fleet',
    '/warehouse',
    '/coverage',
    '/customers',
    '/clients',
    '/gallery',
    '/certificates',
    '/contact',
    '/quote'
];

foreach ($staticPages as $page) {
    echo '  <url>' . PHP_EOL;
    echo '    <loc>' . $baseUrl . $page . '</loc>' . PHP_EOL;
    echo '    <lastmod>' . $date . '</lastmod>' . PHP_EOL;
    echo '    <priority>' . ($page === '' ? '1.00' : '0.80') . '</priority>' . PHP_EOL;
    echo '  </url>' . PHP_EOL;
}

// 2. Dynamic Services from Database
$stmt = $pdo->query("SELECT id FROM services WHERE is_active = 1");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo '  <url>' . PHP_EOL;
    echo '    <loc>' . $baseUrl . '/services/' . $row['id'] . '</loc>' . PHP_EOL;
    echo '    <lastmod>' . $date . '</lastmod>' . PHP_EOL;
    echo '    <priority>0.85</priority>' . PHP_EOL;
    echo '  </url>' . PHP_EOL;
}

// 3. Dynamic Warehouses from Database
$stmtWH = $pdo->query("SELECT id FROM warehouses WHERE is_active = 1");
if ($stmtWH) {
    while ($row = $stmtWH->fetch(PDO::FETCH_ASSOC)) {
        echo '  <url>' . PHP_EOL;
        echo '    <loc>' . $baseUrl . '/warehouse/' . $row['id'] . '</loc>' . PHP_EOL;
        echo '    <lastmod>' . $date . '</lastmod>' . PHP_EOL;
        echo '    <priority>0.85</priority>' . PHP_EOL;
        echo '  </url>' . PHP_EOL;
    }
}

echo '</urlset>';
