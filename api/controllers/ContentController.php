<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class ContentController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function get($section) {
        $stmt = $this->conn->prepare("SELECT data FROM content WHERE section = ? LIMIT 1");
        $stmt->execute([$section]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode(['success' => true, 'data' => json_decode($row['data'], true)]);
        } else {
            echo json_encode(['success' => false, 'data' => null]);
        }
    }

    public function update($section, $body) {
        Auth::check();
        
        $currentData = [];
        $stmt = $this->conn->prepare("SELECT data FROM content WHERE section = ?");
        $stmt->execute([$section]);
        $row = $stmt->fetch();
        if ($row) {
            $currentData = json_decode($row['data'], true) ?: [];
        }

        $newData = $body['data'] ?? $body;
        if (is_string($newData)) $newData = json_decode($newData, true) ?: [];

        // Handle image upload if exists
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                // Delete old image if exists
                if (isset($currentData['bg_image']) && $currentData['bg_image']) {
                    $oldPath = __DIR__ . '/../../' . $currentData['bg_image'];
                    if (file_exists($oldPath) && is_file($oldPath)) {
                        unlink($oldPath);
                    }
                }
                $newData['bg_image'] = ImageHelper::uploadAndCompress($_FILES['image'], 'cms');
            } catch (Exception $e) {
                // Log or handle error
            }
        } else {
            // Tetap gunakan image lama HANYA JIKA field bg_image tidak dikirim dalam payload
            // Jika dikirim tapi kosong (e.g. ""), artinya user ingin menghapus/reset.
            if (!isset($newData['bg_image']) && isset($currentData['bg_image'])) {
                $newData['bg_image'] = $currentData['bg_image'];
            }
        }

        $json = json_encode($newData);
        $stmt = $this->conn->prepare(
            "INSERT INTO content (section, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()"
        );
        $stmt->execute([$section, $json]);
        echo json_encode(['success' => true, 'message' => 'Konten berhasil diperbarui.', 'data' => $newData]);
    }

    private function uploadFile($file, $folder) {
        return ImageHelper::uploadAndCompress($file, $folder);
    }
}
