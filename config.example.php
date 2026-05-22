<?php
// config.example.php
// Copy file ini menjadi config.php di server cPanel Anda
// Lalu ubah isinya sesuai dengan kredensial database server Anda

// Keamanan: Mencegah file ini diakses langsung dari browser
if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    header("HTTP/1.1 403 Forbidden");
    exit("Akses Ditolak.");
}

return [
    'db_host' => 'localhost',
    'db_name' => 'nama_database_cpanel_anda',
    'db_user' => 'user_database_cpanel_anda',
    'db_pass' => 'password_database_cpanel_anda'
];
