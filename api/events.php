<?php
// api/events.php
// CRUD de eventos

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM events ORDER BY event_date DESC');
    $events = $stmt->fetchAll();
    send_json(['events' => $events]);
}

if ($method === 'POST') {
    $body = json_input();

    $stmt = $pdo->prepare(
        'INSERT INTO events 
        (name, type, description, location, event_date, responsible_name, responsible_contact, image_url, observations, status, created_by, created_at, updated_at)
        VALUES
        (:name, :type, :description, :location, :event_date, :responsible_name, :responsible_contact, :image_url, :observations, :status, :created_by, NOW(), NOW())'
    );

    $stmt->execute([
        'name' => $body['name'] ?? '',
        'type' => $body['type'] ?? 'exposicao',
        'description' => $body['description'] ?? null,
        'location' => $body['location'] ?? '',
        'event_date' => $body['event_date'] ?? date('Y-m-d H:i:s'),
        'responsible_name' => $body['responsible_name'] ?? '',
        'responsible_contact' => $body['responsible_contact'] ?? '',
        'image_url' => $body['image_url'] ?? null,
        'observations' => $body['observations'] ?? null,
        'status' => $body['status'] ?? 'rascunho',
        'created_by' => $body['created_by'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM events WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $event = $stmt->fetch();

    send_json(['event' => $event], 201);
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

    foreach ([
        'name',
        'type',
        'description',
        'location',
        'event_date',
        'responsible_name',
        'responsible_contact',
        'image_url',
        'observations',
        'status',
        'chosen_scenario_id',
    ] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql = 'UPDATE events SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM events WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $event = $stmt->fetch();

    send_json(['event' => $event]);
}

if ($method === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;

    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM events WHERE id = :id');
    $stmt->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

