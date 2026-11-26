<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        $configPath = __DIR__ . '/../../config.php';
        if (file_exists($configPath)) {
            $config = require $configPath;
            $this->host = $config['db_host'] ?? 'localhost';
            $this->db_name = $config['db_name'] ?? 'db_logistics';
            $this->username = $config['db_user'] ?? 'root';
            $this->password = $config['db_pass'] ?? '';
        } else {
            // Fallback default
            $this->host = 'localhost';
            $this->db_name = 'db_logistics';
            $this->username = 'root';
            $this->password = '';
        }
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
