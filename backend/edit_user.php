<?php
require 'vendor/autoload.php';
require 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CORS y headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: PUT");

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
$secretKey = "super-secreto";

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
    $authUserId = $decoded->sub ?? null;
    $authUserRole = $decoded->role ?? null;

    if (!$authUserId) {
        http_response_code(401);
        echo json_encode(["message" => "Token inválido"]);
        exit;
    }

    // Leer cuerpo JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'], $data['name'], $data['birthdate'], $data['state'])) {
        http_response_code(400);
        echo json_encode(["message" => "Faltan campos requeridos"]);
        exit;
    }

    $idToUpdate = $data['id'];

    // Solo superadmin puede editar a otros usuarios
    if ($authUserRole !== 'superadmin' && $authUserId != $idToUpdate) {
        http_response_code(403);
        echo json_encode(["message" => "No tienes permisos para editar este usuario"]);
        exit;
    }

    // Campos comunes
    $name = $data['name'];
    $birthdate = $data['birthdate'];
    $state = $data['state'];

    // Verificar si se intenta cambiar el rol
    $roleUpdate = "";
    if (isset($data['role'])) {
        if ($authUserRole !== 'superadmin') {
            http_response_code(403);
            echo json_encode(["message" => "Solo el Super Admin puede cambiar roles"]);
            exit;
        }
        $role = $data['role'];
        if (!in_array($role, ['admin', 'superadmin'])) {
            http_response_code(400);
            echo json_encode(["message" => "Rol inválido"]);
            exit;
        }
        $roleUpdate = ", role = '$role'";
    }

    // Ejecutar actualización
    $sql = "UPDATE users SET name = ?, birthdate = ?, state = ? $roleUpdate WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $params = [$name, $birthdate, $state];
    if ($roleUpdate) $params[] = $idToUpdate;
    else $params[] = $idToUpdate;

    if ($stmt->execute($params)) {
        echo json_encode(["message" => "Usuario actualizado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar"]);
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
}
