<?php
require 'vendor/autoload.php';
require 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CORS y headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: DELETE");

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
$secretKey = "super-secreto"; // debe coincidir con tus otros endpoints

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    $authUserRole = $decoded->role ?? null;

    if ($authUserRole !== 'superadmin') {
        http_response_code(403);
        echo json_encode(["message" => "Solo el Super Administrador puede eliminar usuarios"]);
        exit;
    }

    // Leer cuerpo JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["message" => "Falta el campo ID"]);
        exit;
    }

    $id = $data['id'];

    // Verificar si el usuario existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["message" => "Usuario no encontrado"]);
        exit;
    }

    // Eliminar usuario
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(["message" => "Usuario eliminado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al eliminar usuario"]);
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
}
