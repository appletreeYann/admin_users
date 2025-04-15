<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight (petición OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'vendor/autoload.php';
require 'db.php';
require 'config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


// Obtener token del header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "Token no enviado"]);
    exit;
}

$jwt = str_replace('Bearer ', '', $headers['Authorization']);

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    $userId = $decoded->sub ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["message" => "Token inválido"]);
        exit;
    }

    // Buscar al usuario por ID
    $stmt = $pdo->prepare("SELECT id, email, name, birthdate, state, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["user" => $user]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Usuario no encontrado"]);
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
}
