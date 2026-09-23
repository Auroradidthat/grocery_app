<?php
declare(strict_types=1);

header('Content-Type: application/json');

$host = getenv('DB_HOST') ?: 'db';
$dbName = getenv('DB_NAME') ?: '';
$dbUser = getenv('DB_USER') ?: '';
$dbPassword = getenv('DB_PASSWORD') ?: '';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPassword,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->query('SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = DATABASE()');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'ok',
        'db_connected' => true,
        'table_count' => (int) $row['table_count'],
    ]);
} catch (Throwable $e) {
    error_log('health check failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'db_connected' => false,
    ]);
}
