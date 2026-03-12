<?php
// api/bar_items.php
// CRUD de itens do bar (estoque e vendas) por evento

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
$eventId = isset($qs['event_id']) ? (int)$qs['event_id'] : 0;

if ($eventId <= 0) {
    send_json(['error' => 'event_id é obrigatório'], 400);
}

$table = 'event_bar_items';

if ($method === 'GET') {
    // Opcionalmente, poderíamos filtrar por fornecedor aqui no futuro (supplier_id),
    // mas por enquanto retornamos todos os itens do evento e deixamos o filtro no frontend.
    $sql = "SELECT i.*, s.name AS supplier_name
            FROM {$table} i
            LEFT JOIN suppliers s ON s.id = i.supplier_id
            WHERE i.event_id = :event_id
            ORDER BY i.category, i.name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['event_id' => $eventId]);
    $items = $stmt->fetchAll();
    send_json(['items' => $items]);
}

if ($method === 'POST') {
    $body = json_input();

    $stmt = $pdo->prepare(
        "INSERT INTO {$table}
        (event_id, supplier_id, name, description, category, unit, quantity_stock, unit_price, unit_cost, quantity_sold, min_stock, created_at, updated_at)
        VALUES
        (:event_id, :supplier_id, :name, :description, :category, :unit, :quantity_stock, :unit_price, :unit_cost, :quantity_sold, :min_stock, NOW(), NOW())"
    );

    $stmt->execute([
        'event_id' => $eventId,
        'supplier_id' => $body['supplier_id'] ?? null,
        'name' => $body['name'] ?? '',
        'description' => $body['description'] ?? null,
        'category' => $body['category'] ?? 'outros',
        'unit' => $body['unit'] ?? 'un',
        'quantity_stock' => $body['quantity_stock'] ?? 0,
        'unit_price' => $body['unit_price'] ?? 0,
        'unit_cost' => $body['unit_cost'] ?? null,
        'quantity_sold' => $body['quantity_sold'] ?? 0,
        'min_stock' => $body['min_stock'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
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
        'supplier_id',
        'name',
        'description',
        'category',
        'unit',
        'quantity_stock',
        'unit_price',
        'unit_cost',
        'quantity_sold',
        'min_stock',
        'closed_at',
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
    $item = $stmt->fetch();

    send_json(['item' => $item]);
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
