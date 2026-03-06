<?php
// api/financial_items.php
// CRUD de itens financeiros (receitas e despesas) por evento

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
$eventId = isset($qs['event_id']) ? (int)$qs['event_id'] : 0;

if ($eventId <= 0) {
    send_json(['error' => 'event_id é obrigatório'], 400);
}

if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT * FROM event_financial_items WHERE event_id = :event_id ORDER BY id'
    );
    $stmt->execute(['event_id' => $eventId]);
    $items = $stmt->fetchAll();
    send_json(['items' => $items]);
}

if ($method === 'POST') {
    $body = json_input();

    $stmt = $pdo->prepare(
        'INSERT INTO event_financial_items
        (event_id, type, nature, name, description, category, base_amount, percentage_over_revenue, payment_status, due_date, payment_date, partner, notes, created_at, updated_at)
        VALUES
        (:event_id, :type, :nature, :name, :description, :category, :base_amount, :porc, :payment_status, :due_date, :payment_date, :partner, :notes, NOW(), NOW())'
    );

    $stmt->execute([
        'event_id' => $eventId,
        'type' => $body['type'] ?? 'receita',
        'nature' => $body['nature'] ?? 'fixa',
        'name' => $body['name'] ?? '',
        'description' => $body['description'] ?? null,
        'category' => $body['category'] ?? null,
        'base_amount' => $body['base_amount'] ?? null,
        'porc' => $body['percentage_over_revenue'] ?? null,
        'payment_status' => $body['payment_status'] ?? 'previsto',
        'due_date' => $body['due_date'] ?? null,
        'payment_date' => $body['payment_date'] ?? null,
        'partner' => $body['partner'] ?? null,
        'notes' => $body['notes'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM event_financial_items WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $item = $stmt->fetch();

    send_json(['item' => $item], 201);
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
        'type',
        'nature',
        'name',
        'description',
        'category',
        'base_amount',
        'percentage_over_revenue',
        'payment_status',
        'due_date',
        'payment_date',
        'partner',
        'notes',
    ] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql =
        'UPDATE event_financial_items SET ' .
        implode(', ', $fields) .
        ', updated_at = NOW() WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM event_financial_items WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $item = $stmt->fetch();

    send_json(['item' => $item]);
}

if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM event_financial_items WHERE id = :id');
    $stmt->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

