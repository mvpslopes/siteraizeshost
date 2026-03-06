<?php
// api/users.php
// CRUD de usuários - acesso restrito ao perfil Root

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$roleHeader = $_SERVER['HTTP_X_USER_ROLE'] ?? '';

if ($roleHeader !== 'root') {
    send_json(['error' => 'Apenas usuários Root podem gerenciar usuários'], 403);
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, email, full_name, role, is_active, created_at, updated_at FROM users ORDER BY full_name');
    $users = $stmt->fetchAll();
    send_json(['users' => $users]);
}

if ($method === 'POST') {
    $body = json_input();
    $full_name = trim($body['full_name'] ?? '');
    $email = trim($body['email'] ?? '');
    $role = $body['role'] ?? 'admin';
    $password = $body['password'] ?? '';

    if ($full_name === '' || $email === '' || $password === '') {
        send_json(['error' => 'Nome, e-mail e senha são obrigatórios'], 400);
    }

    if (!in_array($role, ['root', 'admin'], true)) {
        send_json(['error' => 'Perfil inválido'], 400);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare(
        'INSERT INTO users (email, full_name, role, password_hash, is_active, created_at, updated_at)
         VALUES (:email, :full_name, :role, :hash, 1, NOW(), NOW())'
    );

    try {
        $stmt->execute([
            'email' => $email,
            'full_name' => $full_name,
            'role' => $role,
            'hash' => $hash,
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            send_json(['error' => 'Já existe um usuário com este e-mail'], 409);
        }
        send_json(['error' => 'Erro ao criar usuário'], 500);
    }

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT id, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $created = $stmt->fetch();

    send_json(['user' => $created], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;

    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $body = json_input();
    $fields = [];
    $params = ['id' => $id];

    if (isset($body['full_name'])) {
        $fields[] = 'full_name = :full_name';
        $params['full_name'] = trim($body['full_name']);
    }

    if (isset($body['email'])) {
        $fields[] = 'email = :email';
        $params['email'] = trim($body['email']);
    }

    if (isset($body['role']) && in_array($body['role'], ['root', 'admin'], true)) {
        $fields[] = 'role = :role';
        $params['role'] = $body['role'];
    }

    if (!empty($body['password'])) {
        $fields[] = 'password_hash = :hash';
        $params['hash'] = password_hash($body['password'], PASSWORD_BCRYPT);
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql = 'UPDATE users SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = :id';
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute($params);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            send_json(['error' => 'Já existe um usuário com este e-mail'], 409);
        }
        send_json(['error' => 'Erro ao atualizar usuário'], 500);
    }

    $stmt = $pdo->prepare('SELECT id, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $updated = $stmt->fetch();

    send_json(['user' => $updated]);
}

if ($method === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;

    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    // Opcional: proteger o root padrão (por exemplo, id = 1)
    if ($id === 1) {
        send_json(['error' => 'Não é permitido excluir o usuário root padrão'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id');
    $stmt->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

