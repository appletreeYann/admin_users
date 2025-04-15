<?php
require 'vendor/autoload.php';
require 'db.php';

/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CORS y headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

// Si es OPTIONS, terminar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Leer cuerpo JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan campos requeridos."]);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Buscar usuario
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["message" => "Credenciales inválidas"]);
    exit;
}

// Crear JWT
$secretKey = "super-secreto"; // cámbialo en producción
$payload = [
    "sub" => $user['id'],
    "email" => $user['email'],
    "role" => $user['role'],
    "exp" => time() + (60 * 60) // 1 hora
];

$jwt = JWT::encode($payload, $secretKey, 'HS256');

// Respuesta
echo json_encode([
    "token" => $jwt,
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "role" => $user['role'],
        "name" => $user['name']
    ]
]);
