<?php
require_once __DIR__ . '/../middleware/Auth.php';

class AuthController {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    public function login($body) {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $username = $body['username'] ?? '';
        $password = $body['password'] ?? '';
        if (!$username || !$password) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi.']);
            return;
        }
        $stmt = $this->conn->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_id']   = $admin['id'];
            $_SESSION['admin_name'] = $admin['name'];
            echo json_encode(['success' => true, 'name' => $admin['name']]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Username atau password salah.']);
        }
    }

    public function logout() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out.']);
    }

    public function check() {
        echo json_encode(['logged_in' => Auth::isLoggedIn(), 'name' => $_SESSION['admin_name'] ?? null]);
    }

    public function changePassword($body) {
        Auth::check(); // Pastikan sudah login
        $adminId = $_SESSION['admin_id'];
        
        $oldPass = $body['current_password'] ?? '';
        $newPass = $body['new_password'] ?? '';
        
        if (!$oldPass || !$newPass) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password lama dan baru wajib diisi.']);
            return;
        }

        // 1. Ambil data admin saat ini
        $stmt = $this->conn->prepare("SELECT password FROM admins WHERE id = ?");
        $stmt->execute([$adminId]);
        $admin = $stmt->fetch();

        // 2. Verifikasi password lama
        if (!$admin || !password_verify($oldPass, $admin['password'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Password lama salah.']);
            return;
        }

        // 3. Update password baru (Hashing)
        $hashed = password_hash($newPass, PASSWORD_DEFAULT);
        $update = $this->conn->prepare("UPDATE admins SET password = ? WHERE id = ?");
        $update->execute([$hashed, $adminId]);

        echo json_encode(['success' => true, 'message' => 'Password berhasil diperbarui.']);
    }
}
