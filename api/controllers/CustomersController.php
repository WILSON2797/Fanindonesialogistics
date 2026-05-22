<?php
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../helpers/ImageHelper.php';

class CustomersController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM customers WHERE is_active=1 ORDER BY sort_order ASC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM customers WHERE id=? AND is_active=1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Customer not found.']);
        }
    }

    public function create($body) {
        Auth::check();

        $logoPath = '';
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $logoPath = $this->uploadFile($_FILES['logo'], 'customers');
        }

        $stmt = $this->conn->prepare(
            "INSERT INTO customers (name, logo_path, website_url, sort_order) VALUES (?,?,?,?)"
        );
        $name = $body['name'] ?? ($_POST['name'] ?? '');
        $website = $body['website_url'] ?? ($_POST['website_url'] ?? '');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);

        $stmt->execute([$name, $logoPath, $website, $order]);
        echo json_encode(['success' => true, 'id' => $this->conn->lastInsertId()]);
    }

    public function update($id, $body) {
        Auth::check();

        // Check if new logo uploaded
        $logoPath = null;
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            // Delete old logo
            $old = $this->conn->prepare("SELECT logo_path FROM customers WHERE id=?");
            $old->execute([$id]);
            $oldRow = $old->fetch();
            if ($oldRow && $oldRow['logo_path'] && file_exists(__DIR__ . '/../../' . $oldRow['logo_path'])) {
                unlink(__DIR__ . '/../../' . $oldRow['logo_path']);
            }
            $logoPath = $this->uploadFile($_FILES['logo'], 'customers');
        }

        $name = $body['name'] ?? ($_POST['name'] ?? '');
        $website = $body['website_url'] ?? ($_POST['website_url'] ?? '');
        $order = $body['sort_order'] ?? ($_POST['sort_order'] ?? 0);
        $active = $body['is_active'] ?? ($_POST['is_active'] ?? 1);

        if ($logoPath !== null) {
            $stmt = $this->conn->prepare("UPDATE customers SET name=?, logo_path=?, website_url=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$name, $logoPath, $website, $order, $active, $id]);
        } else {
            $stmt = $this->conn->prepare("UPDATE customers SET name=?, website_url=?, sort_order=?, is_active=? WHERE id=?");
            $stmt->execute([$name, $website, $order, $active, $id]);
        }
        echo json_encode(['success' => true, 'message' => 'Customer updated.']);
    }

    public function delete($id) {
        Auth::check();
        // Delete logo file
        $old = $this->conn->prepare("SELECT logo_path FROM customers WHERE id=?");
        $old->execute([$id]);
        $oldRow = $old->fetch();
        if ($oldRow && $oldRow['logo_path'] && file_exists(__DIR__ . '/../../' . $oldRow['logo_path'])) {
            unlink(__DIR__ . '/../../' . $oldRow['logo_path']);
        }
        $stmt = $this->conn->prepare("DELETE FROM customers WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Customer deleted.']);
    }

    private function uploadFile($file, $folder) {
        return ImageHelper::uploadAndCompress($file, $folder);
    }
}
