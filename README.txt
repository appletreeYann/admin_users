Admin Users - Aplicación Fullstack de Gestión de Usuarios

Aplicación de administración de usuarios con autenticación JWT, roles diferenciados (Administrador y Superadministrador) y una interfaz construida en React.

Tecnologías Utilizadas

Backend

PHP 8.1+ (XAMPP)

MySQL como base de datos

JWT con la librería firebase/php-jwt

Endpoints RESTful

Frontend

React (con Vite)

Tailwind CSS para estilos

Zustand para gestión de estado

React Router para navegación

React Hook Form para formularios

Headless UI para modales

React Toastify para notificaciones

Instalación

Requisitos previos

PHP 8+ y XAMPP

Node.js 16+

Composer

1. Clonar el repositorio

git clone https://github.com/tuusuario/admin_users.git

2. Configurar el Backend

cd admin_users/backend
composer install

Crear base de datos en MySQL

CREATE DATABASE user_admin;

Crear tabla users

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','superadmin') NOT NULL,
  state VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL
);

Insertar Superadmin inicial

INSERT INTO users (name, email, password, role, state, birthdate) VALUES (
  'Super Admin', 'super@admin.com',
  '<hash-password>', 'superadmin', 'Ciudad de México', '1990-01-01'
);

Puedes generar el hash usando password_hash("123456", PASSWORD_DEFAULT)

Configurar Virtual Host

Agrega en XAMPP httpd-vhosts.conf:

<VirtualHost *:8081>
    DocumentRoot "/ruta/completa/a/admin_users/backend"
    ServerName adminusers.local
    <Directory "/ruta/completa/a/admin_users/backend">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

Y en tu archivo hosts:

127.0.0.1 adminusers.local

Reinicia Apache.

3. Configurar el Frontend

cd ../frontend
npm install
npm run dev

Abre en navegador: http://localhost:5173

Endpoints del Backend

Autenticación

POST /login.php - Login de usuarios

Usuarios

GET /profile.php - Obtener perfil actual

GET /users.php - Listar todos los usuarios (solo superadmin)

POST /register.php - Crear usuario (solo superadmin)

PUT /edit_user.php - Editar usuario

DELETE /delete_user.php - Eliminar usuario (solo superadmin)

Funcionalidades del Frontend

/login

Formulario de inicio de sesión

/profile

Perfil del usuario actual

/users (solo superadmin)

Ver lista de usuarios

Crear nuevo usuario

Editar datos de un usuario

Eliminar usuario

Colección de Postman

Incluida en postman_collection.json

Notas

JWT se guarda en localStorage

Las sesiones expiran automáticamente

Los botones están deshabilitados mientras se hacen peticiones

Autor

Yannick Manzano

