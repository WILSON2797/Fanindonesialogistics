<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class FleetController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM fleet WHERE is_active=1 ORDER BY sort_order ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function create($body) {
        Auth::check();
        $data = $body['data'] ?? $body;
        if (is_string($data)) $data = json_decode($data, true) ?: [];

        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadFile($_FILES['image']);
        }

        $stmt = $this->conn->prepare(
            "INSERT INTO fleet (name, type, capacity, description, image_path, sort_order) VALUES (?,?,?,?,?,?)"
        );
        $stmt->execute([
            $data['name'], 
            $data['type'] ?? '', 
            $data['capacity'] ?? '', 
            $data['description'] ?? '', 
            $imagePath, 
            $data['sort_order'] ?? 0
        ]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();
        $data = $body['data'] ?? $body;
        if (is_string($data)) $data = json_decode($data, true) ?: [];

        // Get current image to keep or delete
        $stmt = $this->conn->prepare("SELECT image_path FROM fleet WHERE id=?");
        $stmt->execute([$id]);
        $current = $stmt->fetch();
        $imagePath = $current['image_path'] ?? '';

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Delete old if exists
            if ($imagePath && file_exists(__DIR__ . '/../../' . $imagePath)) {
                unlink(__DIR__ . '/../../' . $imagePath);
            }
            $imagePath = $this->uploadFile($_FILES['image']);
        } else if (isset($data['remove_image']) && $data['remove_image']) {
            if ($imagePath && file_exists(__DIR__ . '/../../' . $imagePath)) {
                unlink(__DIR__ . '/../../' . $imagePath);
            }
            $imagePath = '';
        }

        $stmt = $this->conn->prepare(
            "UPDATE fleet SET name=?, type=?, capacity=?, description=?, image_path=?, sort_order=?, is_active=? WHERE id=?"
        );
        $stmt->execute([
            $data['name'], 
            $data['type'] ?? '', 
            $data['capacity'] ?? '', 
            $data['description'] ?? '', 
            $imagePath, 
            $data['sort_order'] ?? 0, 
            $data['is_active'] ?? 1, 
            $id
        ]);
        echo json_encode(['success' => true, 'message' => 'Fleet updated.']);
    }

    private function uploadFile($file) {
        return ImageHelper::uploadAndCompress($file, 'fleet', 80, 800);
    }

    public function delete($id) {
        Auth::check();
        $stmt = $this->conn->prepare("SELECT image_path FROM fleet WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row && $row['image_path'] && file_exists(__DIR__ . '/../../' . $row['image_path'])) {
            unlink(__DIR__ . '/../../' . $row['image_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM fleet WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Fleet deleted.']);
    }
}
