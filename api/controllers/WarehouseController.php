<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class WarehouseController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM warehouses WHERE is_active=1 ORDER BY sort_order ASC");
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
            "INSERT INTO warehouses (name, area, type, region, project, description, image_path, sort_order) VALUES (?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $data['name'],
            $data['area'] ?? '',
            $data['type'] ?? '',
            $data['region'] ?? '',
            $data['project'] ?? '',
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
        $stmt = $this->conn->prepare("SELECT image_path FROM warehouses WHERE id=?");
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
            "UPDATE warehouses SET name=?, area=?, type=?, region=?, project=?, description=?, image_path=?, sort_order=?, is_active=? WHERE id=?"
        );
        $stmt->execute([
            $data['name'],
            $data['area'] ?? '',
            $data['type'] ?? '',
            $data['region'] ?? '',
            $data['project'] ?? '',
            $data['description'] ?? '',
            $imagePath,
            $data['sort_order'] ?? 0,
            $data['is_active'] ?? 1,
            $id
        ]);
        echo json_encode(['success' => true, 'message' => 'Warehouse updated.']);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM warehouses WHERE id=? AND is_active=1");
        $stmt->execute([$id]);
        $warehouse = $stmt->fetch();
        if (!$warehouse) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Warehouse not found.']);
            return;
        }

        // Fetch gallery images
        $gStmt = $this->conn->prepare("SELECT * FROM warehouse_gallery WHERE warehouse_id=? ORDER BY sort_order ASC");
        $gStmt->execute([$id]);
        $warehouse['gallery'] = $gStmt->fetchAll();

        // Fetch highlights
        $hStmt = $this->conn->prepare("SELECT * FROM warehouse_highlights WHERE warehouse_id=? ORDER BY sort_order ASC");
        $hStmt->execute([$id]);
        $warehouse['highlights'] = $hStmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $warehouse]);
    }

    private function uploadFile($file) {
        return ImageHelper::uploadAndCompress($file, 'warehouse', 80, 1200);
    }

    // --- Highlights Methods ---

    public function getHighlights($warehouseId) {
        $stmt = $this->conn->prepare("SELECT * FROM warehouse_highlights WHERE warehouse_id=? ORDER BY sort_order ASC");
        $stmt->execute([$warehouseId]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function addHighlight($warehouseId, $body) {
        Auth::check();
        $data = $body['data'] ?? $body;
        if (is_string($data)) $data = json_decode($data, true) ?: [];

        $stmt = $this->conn->prepare(
            "INSERT INTO warehouse_highlights (warehouse_id, icon, text, sort_order) VALUES (?,?,?,?)"
        );
        $stmt->execute([
            $warehouseId,
            $data['icon'] ?? 'bi-check-circle',
            $data['text'] ?? '',
            $data['sort_order'] ?? 0
        ]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function deleteHighlight($highlightId) {
        Auth::check();
        $stmt = $this->conn->prepare("DELETE FROM warehouse_highlights WHERE id=?");
        $stmt->execute([$highlightId]);
        echo json_encode(['success' => true, 'message' => 'Highlight deleted.']);
    }

    // --- Gallery Methods ---

    public function getGallery($warehouseId) {
        $stmt = $this->conn->prepare("SELECT * FROM warehouse_gallery WHERE warehouse_id=? ORDER BY sort_order ASC");
        $stmt->execute([$warehouseId]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function addGallery($warehouseId, $body) {
        Auth::check();
        $data = $body['data'] ?? $body;
        if (is_string($data)) $data = json_decode($data, true) ?: [];

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Image file is required.']);
            return;
        }

        $imagePath = ImageHelper::uploadAndCompress($_FILES['image'], 'warehouse-gallery', 80, 1200);

        $stmt = $this->conn->prepare(
            "INSERT INTO warehouse_gallery (warehouse_id, image_path, caption, sort_order) VALUES (?,?,?,?)"
        );
        $stmt->execute([
            $warehouseId,
            $imagePath,
            $data['caption'] ?? '',
            $data['sort_order'] ?? 0
        ]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function deleteGallery($galleryId) {
        Auth::check();
        $stmt = $this->conn->prepare("SELECT image_path FROM warehouse_gallery WHERE id=?");
        $stmt->execute([$galleryId]);
        $row = $stmt->fetch();
        if ($row && $row['image_path'] && file_exists(__DIR__ . '/../../' . $row['image_path'])) {
            unlink(__DIR__ . '/../../' . $row['image_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM warehouse_gallery WHERE id=?");
        $stmt->execute([$galleryId]);
        echo json_encode(['success' => true, 'message' => 'Gallery image deleted.']);
    }

    public function delete($id) {
        Auth::check();
        // Delete main image
        $stmt = $this->conn->prepare("SELECT image_path FROM warehouses WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row && $row['image_path'] && file_exists(__DIR__ . '/../../' . $row['image_path'])) {
            unlink(__DIR__ . '/../../' . $row['image_path']);
        }
        // Delete all gallery images
        $gStmt = $this->conn->prepare("SELECT image_path FROM warehouse_gallery WHERE warehouse_id=?");
        $gStmt->execute([$id]);
        while ($g = $gStmt->fetch()) {
            if ($g['image_path'] && file_exists(__DIR__ . '/../../' . $g['image_path'])) {
                unlink(__DIR__ . '/../../' . $g['image_path']);
            }
        }
        // CASCADE will handle DB rows for gallery and highlights, but delete explicitly just in case for gallery files
        $this->conn->prepare("DELETE FROM warehouse_highlights WHERE warehouse_id=?")->execute([$id]);
        $this->conn->prepare("DELETE FROM warehouse_gallery WHERE warehouse_id=?")->execute([$id]);
        $stmt = $this->conn->prepare("DELETE FROM warehouses WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Warehouse deleted.']);
    }
}
