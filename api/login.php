<?php
// api/login.php
// Autenticação básica contra a tabela "users"

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Método não permitido'], 405);
}

$body = json_input();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if ($email === '' || $password === '') {
    send_json(['error' => 'Email e senha são obrigatórios'], 400);
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email AND is_active = 1 LIMIT 1');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    send_json(['error' => 'Email ou senha inválidos'], 401);
}

if (!password_verify($password, $user['password_hash'])) {
    send_json(['error' => 'Email ou senha inválidos'], 401);
}

// Nunca devolve o hash para o front
unset($user['password_hash']);

send_json(['user' => $user]);

