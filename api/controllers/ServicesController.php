<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class ServicesController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM services WHERE is_active=1 ORDER BY sort_order ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM services WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'data' => $stmt->fetch()]);
    }    public function create($body) {
        Auth::check();
        
        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = ImageHelper::uploadAndCompress($_FILES['image'], 'services');
        }

        $stmt = $this->conn->prepare(
            "INSERT INTO services (icon, image_path, title, description, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $body['icon'] ?? 'bi-truck', 
            $imagePath,
            $body['title'] ?? ($_POST['title'] ?? ''), 
            $body['description'] ?? ($_POST['description'] ?? ''), 
            $body['content'] ?? ($_POST['content'] ?? ''),
            $body['sort_order'] ?? ($_POST['sort_order'] ?? 0)
        ]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Delete old image
            $old = $this->conn->prepare("SELECT image_path FROM services WHERE id=?");
            $old->execute([$id]);
            $oldRow = $old->fetch();
            if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
                unlink(__DIR__ . '/../../' . $oldRow['image_path']);
            }
            $imagePath = ImageHelper::uploadAndCompress($_FILES['image'], 'services');
        }

        $icon = $body['icon'] ?? ($_POST['icon'] ?? 'bi-truck');
        $title = $body['title'] ?? ($_POST['title'] ?? '');
        $desc = $body['description'] ?? ($_POST['description'] ?? '');
        $content = $body['content'] ?? ($_POST['content'] ?? '');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);
        $active = $body['is_active'] ?? ($_POST['is_active'] ?? 1);

        if ($imagePath !== null) {
            $stmt = $this->conn->prepare("UPDATE services SET icon=?, image_path=?, title=?, description=?, content=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$icon, $imagePath, $title, $desc, $content, $order, $active, $id]);
        } else {
            $stmt = $this->conn->prepare("UPDATE services SET icon=?, title=?, description=?, content=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$icon, $title, $desc, $content, $order, $active, $id]);
        }
        echo json_encode(['success' => true, 'message' => 'Service updated.']);
    }

    public function delete($id) {
        Auth::check();
        // Delete image file
        $old = $this->conn->prepare("SELECT image_path FROM services WHERE id=?");
        $old->execute([$id]);
        $oldRow = $old->fetch();
        if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
            unlink(__DIR__ . '/../../' . $oldRow['image_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM services WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Service deleted.']);
    }
}
