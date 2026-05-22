<?php
require_once __DIR__ . '/../middleware/Auth.php';

class CoverageController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM coverage_areas WHERE is_active=1 ORDER BY sort_order ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function create($body) {
        Auth::check();
        $stmt = $this->conn->prepare("INSERT INTO coverage_areas (region, cities, sort_order) VALUES (?,?,?)");
        $stmt->execute([$body['region'], $body['cities'] ?? '', $body['sort_order'] ?? 0]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();
        $stmt = $this->conn->prepare("UPDATE coverage_areas SET region=?, cities=?, sort_order=?, is_active=? WHERE id=?");
        $stmt->execute([$body['region'], $body['cities'] ?? '', $body['sort_order'] ?? 0, $body['is_active'] ?? 1, $id]);
        echo json_encode(['success' => true, 'message' => 'Coverage area updated.']);
    }

    public function delete($id) {
        Auth::check();
        $stmt = $this->conn->prepare("DELETE FROM coverage_areas WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Coverage area deleted.']);
    }
}
