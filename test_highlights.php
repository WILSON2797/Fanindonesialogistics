<?php
require 'api/config/database.php';
$db = new Database();
$conn = $db->getConnection();
$conn->query("INSERT IGNORE INTO warehouse_highlights (warehouse_id, icon, text) VALUES (1, 'bi-shield-check', '24/7 Security Monitoring'), (1, 'bi-lightning-charge-fill', 'Modern Facilities')");
echo "Done";
