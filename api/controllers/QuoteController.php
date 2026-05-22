<?php
class QuoteController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function submit($body) {
        $required = ['name', 'email', 'phone', 'origin', 'destination', 'cargo_type'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi."]);
                return;
            }
        }
        $stmt = $this->conn->prepare(
            "INSERT INTO quote_requests (name, company, email, phone, origin, destination, cargo_type, weight, volume, notes)
             VALUES (?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$body['name'], $body['company'] ?? '', $body['email'], $body['phone'], $body['origin'], $body['destination'], $body['cargo_type'], $body['weight'] ?? '', $body['volume'] ?? '', $body['notes'] ?? '']);
        echo json_encode(['success' => true, 'message' => 'Permintaan penawaran berhasil dikirim! Tim kami akan menghubungi Anda segera.']);
    }

    public function getAll() {
        require_once __DIR__ . '/../middleware/Auth.php';
        Auth::check();
        $stmt = $this->conn->query("SELECT * FROM quote_requests ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function updateStatus($id, $body) {
        require_once __DIR__ . '/../middleware/Auth.php';
        Auth::check();
        $stmt = $this->conn->prepare("UPDATE quote_requests SET status=? WHERE id=?");
        $stmt->execute([$body['status'], $id]);
        echo json_encode(['success' => true, 'message' => 'Status updated.']);
    }
}
