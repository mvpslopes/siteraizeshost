<?php
// api/suppliers.php
// Cadastro geral de fornecedores

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);

$table = 'suppliers';

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM {$table} ORDER BY name");
    $suppliers = $stmt->fetchAll();
    send_json(['suppliers' => $suppliers]);
}

if ($method === 'POST') {
    $body = json_input();

    if (empty($body['name'])) {
        send_json(['error' => 'Nome do fornecedor é obrigatório'], 400);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO {$table}
        (name, category, document, legal_name, address, responsible_name, email, phone, bank_info, notes, status, created_at, updated_at)
        VALUES
        (:name, :category, :document, :legal_name, :address, :responsible_name, :email, :phone, :bank_info, :notes, :status, NOW(), NOW())"
    );

    $stmt->execute([
        'name' => $body['name'],
        'category' => $body['category'] ?? null,
        'document' => $body['document'] ?? null,
        'legal_name' => $body['legal_name'] ?? null,
        'address' => $body['address'] ?? null,
        'responsible_name' => $body['responsible_name'] ?? null,
        'email' => $body['email'] ?? null,
        'phone' => $body['phone'] ?? null,
        'bank_info' => $body['bank_info'] ?? null,
        'notes' => $body['notes'] ?? null,
        'status' => $body['status'] ?? 'ativo',
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $supplier = $stmt->fetch();

    send_json(['supplier' => $supplier], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $body = json_input();
    $fields = [];
    $params = ['id' => $id];

    foreach ([
        'name',
        'category',
        'document',
        'legal_name',
        'address',
        'responsible_name',
        'email',
        'phone',
        'bank_info',
        'notes',
        'status',
    ] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql = "UPDATE {$table} SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $supplier = $stmt->fetch();

    send_json(['supplier' => $supplier]);
}

if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
    $stmt->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

