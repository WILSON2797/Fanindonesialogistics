<?php
class ContactController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function submit($body) {
        $required = ['name', 'email', 'message'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi."]);
                return;
            }
        }
        $stmt = $this->conn->prepare(
            "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)"
        );
        $stmt->execute([$body['name'], $body['email'], $body['phone'] ?? '', $body['subject'] ?? '', $body['message']]);
        echo json_encode(['success' => true, 'message' => 'Pesan Anda berhasil dikirim! Kami akan merespons dalam 1x24 jam.']);
    }

    public function getAll() {
        require_once __DIR__ . '/../middleware/Auth.php';
        Auth::check();
        $stmt = $this->conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function markRead($id) {
        require_once __DIR__ . '/../middleware/Auth.php';
        Auth::check();
        $stmt = $this->conn->prepare("UPDATE contact_messages SET is_read=1 WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
}
