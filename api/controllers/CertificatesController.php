<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class CertificatesController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM certificates WHERE is_active=1 ORDER BY sort_order ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function create($body) {
        Auth::check();

        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadFile($_FILES['image'], 'certificates');
        }

        $name  = $body['name'] ?? ($_POST['name'] ?? '');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);

        $stmt = $this->conn->prepare("INSERT INTO certificates (name, image_path, sort_order) VALUES (?,?,?)");
        $stmt->execute([$name, $imagePath, $order]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $old = $this->conn->prepare("SELECT image_path FROM certificates WHERE id=?");
            $old->execute([$id]);
            $oldRow = $old->fetch();
            if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
                unlink(__DIR__ . '/../../' . $oldRow['image_path']);
            }
            $imagePath = $this->uploadFile($_FILES['image'], 'certificates');
        }

        $name   = $body['name'] ?? ($_POST['name'] ?? '');
        $order  = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);
        $active = $body['is_active'] ?? ($_POST['is_active'] ?? 1);

        if ($imagePath !== null) {
            $stmt = $this->conn->prepare("UPDATE certificates SET name=?, image_path=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$name, $imagePath, $order, $active, $id]);
        } else {
            $stmt = $this->conn->prepare("UPDATE certificates SET name=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$name, $order, $active, $id]);
        }
        echo json_encode(['success' => true, 'message' => 'Certificate updated.']);
    }

    public function delete($id) {
        Auth::check();
        $old = $this->conn->prepare("SELECT image_path FROM certificates WHERE id=?");
        $old->execute([$id]);
        $oldRow = $old->fetch();
        if ($oldRow && $oldRow['image_path'] && file_exists(__DIR__ . '/../../' . $oldRow['image_path'])) {
            unlink(__DIR__ . '/../../' . $oldRow['image_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM certificates WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Certificate deleted.']);
    }

    private function uploadFile($file, $folder) {
        return ImageHelper::uploadAndCompress($file, $folder);
    }
}
