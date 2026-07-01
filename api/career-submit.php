<?php
/*
Schema: ALTER TABLE leads ADD COLUMN resume_path VARCHAR(500) DEFAULT '' AFTER message;
*/
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
    exit;
}

$host = 'localhost';
$dbname = 'rajagency_leads';
$username = 'rajagency_user';
$password = 'YOUR_PASSWORD_HERE';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$position = trim($_POST['position'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($phone) || empty($email) || empty($position)) {
    echo json_encode(['success' => false, 'message' => 'Name, phone, email, and position are required']);
    exit;
}

$resumePath = '';
if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../uploads/resumes/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $ext = strtolower(pathinfo($_FILES['resume']['name'], PATHINFO_EXTENSION));
    $allowed = ['pdf', 'doc', 'docx'];
    if (!in_array($ext, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Only PDF, DOC, DOCX allowed']);
        exit;
    }
    $filename = uniqid('resume_') . '.' . $ext;
    $dest = $uploadDir . $filename;
    if (move_uploaded_file($_FILES['resume']['tmp_name'], $dest)) {
        $resumePath = 'uploads/resumes/' . $filename;
    }
}

$stmt = $pdo->prepare("INSERT INTO leads (form_name, name, phone, email, service, message, resume_path, created_at) VALUES (:form_name, :name, :phone, :email, :service, :message, :resume_path, NOW())");

$stmt->execute([
    ':form_name' => 'Career',
    ':name' => $name,
    ':phone' => $phone,
    ':email' => $email,
    ':service' => $position,
    ':message' => $message,
    ':resume_path' => $resumePath,
]);

echo json_encode(['success' => true, 'redirect' => 'https://rajagency.in/thank-you']);
