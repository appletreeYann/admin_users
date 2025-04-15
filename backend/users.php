<?php
require 'vendor/autoload.php';
require 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CORS y headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener token del header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "Token no enviado"]);
    exit;
}

$jwt = str_replace('Bearer ', '', $headers['Authorization']);
$secretKey = "super-secreto"; // Debe coincidir con los otros archivos

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    $userId = $decoded->sub ?? null;
    $userRole = $decoded->role ?? null;

    if (!$userId || $userRole !== 'superadmin') {
        http_response_code(403);
        echo json_encode(["message" => "Acceso denegado"]);
        exit;
    }

    // Consultar todos los usuarios
    $stmt = $pdo->query("SELECT id, email, name, birthdate, state, role FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["users" => $users]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
}
