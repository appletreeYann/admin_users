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

// Token JWT
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "Token no enviado"]);
    exit;
}

$jwt = str_replace('Bearer ', '', $headers['Authorization']);

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    $userRole = $decoded->role ?? null;

    if ($userRole !== 'superadmin') {
        http_response_code(403);
        echo json_encode(["message" => "Solo el Super Administrador puede registrar usuarios"]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
    exit;
}

// Leer body JSON
$data = json_decode(file_get_contents("php://input"), true);

$required = ['email', 'password', 'name', 'birthdate', 'state', 'role'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "Falta el campo: $field"]);
        exit;
    }
}

$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$name = $data['name'];
$birthdate = $data['birthdate'];
$state = $data['state'];
$role = $data['role'];

// Validar rol permitido
if (!in_array($role, ['admin', 'superadmin'])) {
    http_response_code(400);
    echo json_encode(["message" => "Rol no válido"]);
    exit;
}

// Revisar si ya existe
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["message" => "El usuario ya existe"]);
    exit;
}

// Insertar nuevo usuario
$stmt = $pdo->prepare("INSERT INTO users (email, password, name, birthdate, state, role) VALUES (?, ?, ?, ?, ?, ?)");

if ($stmt->execute([$email, $password, $name, $birthdate, $state, $role])) {
    http_response_code(201);
    echo json_encode(["message" => "Usuario creado con éxito"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error al crear el usuario"]);
}
