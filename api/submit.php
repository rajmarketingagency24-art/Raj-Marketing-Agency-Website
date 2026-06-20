<?php
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
$formName = trim($_POST['formName'] ?? '');

if (empty($name) || empty($phone) || empty($formName)) {
    echo json_encode(['success' => false, 'message' => 'Name, phone, and formName are required']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$service = trim($_POST['service'] ?? '');
$budget = trim($_POST['budget'] ?? '');
$message = trim($_POST['message'] ?? '');
$source = trim($_POST['source'] ?? '');

$stmt = $pdo->prepare("INSERT INTO leads (form_name, name, phone, email, service, budget, message, source, created_at) VALUES (:form_name, :name, :phone, :email, :service, :budget, :message, :source, NOW())");

$stmt->execute([
    ':form_name' => $formName,
    ':name' => $name,
    ':phone' => $phone,
    ':email' => $email,
    ':service' => $service,
    ':budget' => $budget,
    ':message' => $message,
    ':source' => $source,
]);

echo json_encode(['success' => true, 'redirect' => 'https://rajagency.in/thank-you']);
