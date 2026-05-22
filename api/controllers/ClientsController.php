<?php
require_once __DIR__ . '/../middleware/Auth.php';

class ClientsController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM clients WHERE is_active=1");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function create($body) {
        Auth::check();
        $stmt = $this->conn->prepare(
            "INSERT INTO clients (company_name, logo_path, testimonial, client_name, client_position, rating) VALUES (?,?,?,?,?,?)"
        );
        $stmt->execute([$body['company_name'], $body['logo_path'] ?? '', $body['testimonial'] ?? '', $body['client_name'] ?? '', $body['client_position'] ?? '', $body['rating'] ?? 5]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();
        $stmt = $this->conn->prepare(
            "UPDATE clients SET company_name=?, logo_path=?, testimonial=?, client_name=?, client_position=?, rating=?, is_active=? WHERE id=?"
        );
        $stmt->execute([$body['company_name'], $body['logo_path'] ?? '', $body['testimonial'] ?? '', $body['client_name'] ?? '', $body['client_position'] ?? '', $body['rating'] ?? 5, $body['is_active'] ?? 1, $id]);
        echo json_encode(['success' => true, 'message' => 'Client updated.']);
    }

    public function delete($id) {
        Auth::check();
        $stmt = $this->conn->prepare("DELETE FROM clients WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Client deleted.']);
    }
}
