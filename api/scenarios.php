<?php
// api/scenarios.php
// CRUD de cenários de faturamento por evento

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
$eventId = isset($qs['event_id']) ? (int)$qs['event_id'] : 0;

if ($eventId <= 0) {
    send_json(['error' => 'event_id é obrigatório'], 400);
}

if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT * FROM event_scenarios WHERE event_id = :event_id ORDER BY expected_revenue'
    );
    $stmt->execute(['event_id' => $eventId]);
    $scenarios = $stmt->fetchAll();
    send_json(['scenarios' => $scenarios]);
}

if ($method === 'POST') {
    $body = json_input();
    $expectedRevenue = (float)($body['expected_revenue'] ?? 0);

    // Código e nome automáticos: próximo letter A, B, C...
    $stmt = $pdo->prepare(
        'SELECT code FROM event_scenarios WHERE event_id = :event_id ORDER BY id'
    );
    $stmt->execute(['event_id' => $eventId]);
    $existing = $stmt->fetchAll();
    $maxOrd = ord('A') - 1;
    foreach ($existing as $row) {
        $c = strtoupper(substr($row['code'] ?? '', 0, 1));
        if ($c >= 'A' && $c <= 'Z') {
            $maxOrd = max($maxOrd, ord($c));
        }
    }
    $nextOrd = $maxOrd + 1;
    $code = $nextOrd <= ord('Z') ? chr($nextOrd) : 'A';
    $customName = trim($body['name'] ?? '');
    $name = $customName !== '' ? $customName : ('Cenário ' . $code);

    $stmt = $pdo->prepare(
        'INSERT INTO event_scenarios (event_id, code, name, expected_revenue, created_at, updated_at)
         VALUES (:event_id, :code, :name, :expected_revenue, NOW(), NOW())'
    );

    $stmt->execute([
        'event_id' => $eventId,
        'code' => $code,
        'name' => $name,
        'expected_revenue' => $expectedRevenue,
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM event_scenarios WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $scenario = $stmt->fetch();

    send_json(['scenario' => $scenario], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $body = json_input();
    $fields = [];
    $params = ['id' => $id];

    foreach (['code', 'name', 'expected_revenue'] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql =
        'UPDATE event_scenarios SET ' .
        implode(', ', $fields) .
        ', updated_at = NOW() WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM event_scenarios WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $scenario = $stmt->fetch();

    send_json(['scenario' => $scenario]);
}

if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM event_scenarios WHERE id = :id');
    $stmt->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

