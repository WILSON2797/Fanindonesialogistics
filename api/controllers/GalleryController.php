<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class GalleryController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $category = $_GET['category'] ?? null;
        if ($category && $category !== 'all') {
            $stmt = $this->conn->prepare("SELECT * FROM gallery WHERE is_active=1 AND category=? ORDER BY sort_order ASC");
            $stmt->execute([$category]);
        } else {
            $stmt = $this->conn->query("SELECT * FROM gallery WHERE is_active=1 ORDER BY sort_order ASC");
        }
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function getCategories() {
        $stmt = $this->conn->query("SELECT DISTINCT category FROM gallery WHERE is_active=1 ORDER BY category ASC");
        $cats = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'data' => $cats]);
    }

    public function create($body) {
        Auth::check();

        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadFile($_FILES['image'], 'gallery');
        }

        $title = $body['title'] ?? ($_POST['title'] ?? '');
        $desc = $body['description'] ?? ($_POST['description'] ?? '');
        $category = $body['category'] ?? ($_POST['category'] ?? 'general');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);

        $stmt = $this->conn->prepare(
            "INSERT INTO gallery (title, description, image_path, category, sort_order) VALUES (?,?,?,?,?)"
        );
        $stmt->execute([$title, $desc, $imagePath, $category, $order]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Delete old image
            $old = $this->conn->prepare("SELECT image_path FROM gallery WHERE id=?");
            $old->execute([$id]);
            $oldRow = $old->fetch();
            if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
                unlink(__DIR__ . '/../../' . $oldRow['image_path']);
            }
            $imagePath = $this->uploadFile($_FILES['image'], 'gallery');
        }

        $title = $body['title'] ?? ($_POST['title'] ?? '');
        $desc = $body['description'] ?? ($_POST['description'] ?? '');
        $category = $body['category'] ?? ($_POST['category'] ?? 'general');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);
        $active = $body['is_active'] ?? ($_POST['is_active'] ?? 1);

        if ($imagePath !== null) {
            $stmt = $this->conn->prepare("UPDATE gallery SET title=?, description=?, image_path=?, category=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$title, $desc, $imagePath, $category, $order, $active, $id]);
        } else {
            $stmt = $this->conn->prepare("UPDATE gallery SET title=?, description=?, category=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$title, $desc, $category, $order, $active, $id]);
        }
        echo json_encode(['success' => true, 'message' => 'Gallery updated.']);
    }

    public function delete($id) {
        Auth::check();
        $old = $this->conn->prepare("SELECT image_path FROM gallery WHERE id=?");
        $old->execute([$id]);
        $oldRow = $old->fetch();
        if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
            unlink(__DIR__ . '/../../' . $oldRow['image_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM gallery WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Gallery item deleted.']);
    }

    private function uploadFile($file, $folder) {
        return ImageHelper::uploadAndCompress($file, $folder);
    }
}
