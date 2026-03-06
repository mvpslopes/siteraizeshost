<?php
// api/scenario_items.php
// Valor previsto por item por cenário (comparativo)

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
$scenarioId = isset($qs['scenario_id']) ? (int)$qs['scenario_id'] : 0;

if ($scenarioId <= 0) {
    send_json(['error' => 'scenario_id é obrigatório'], 400);
}

// Resgata evento do cenário
$stmt = $pdo->prepare('SELECT event_id FROM event_scenarios WHERE id = :id');
$stmt->execute(['id' => $scenarioId]);
$scenario = $stmt->fetch();
if (!$scenario) {
    send_json(['error' => 'Cenário não encontrado'], 404);
}
$eventId = (int)$scenario['event_id'];

if ($method === 'GET') {
    // Itens do evento
    $stmt = $pdo->prepare(
        'SELECT id, event_id, type, name, description, base_amount
         FROM event_financial_items WHERE event_id = :event_id ORDER BY type, id'
    );
    $stmt->execute(['event_id' => $eventId]);
    $items = $stmt->fetchAll();

    // Valores previstos do cenário (se existir tabela)
    $expectedByItem = [];
    $tableExists = $pdo->query("SHOW TABLES LIKE 'event_scenario_items'")->rowCount() > 0;
    if ($tableExists) {
        $stmt = $pdo->prepare(
            'SELECT financial_item_id, expected_amount FROM event_scenario_items WHERE scenario_id = :scenario_id'
        );
        $stmt->execute(['scenario_id' => $scenarioId]);
        while ($row = $stmt->fetch()) {
            $expectedByItem[(int)$row['financial_item_id']] = (float)$row['expected_amount'];
        }
    }

    $list = [];
    foreach ($items as $item) {
        $list[] = [
            'financial_item_id' => (int)$item['id'],
            'type' => $item['type'],
            'name' => $item['name'],
            'description' => $item['description'] ?? '',
            'base_amount' => $item['base_amount'] !== null ? (float)$item['base_amount'] : 0,
            'expected_amount' => $expectedByItem[(int)$item['id']] ?? null,
        ];
    }

    send_json(['items' => $list]);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $body = json_input();
    $inputItems = $body['items'] ?? [];
    if (!is_array($inputItems)) {
        send_json(['error' => 'items deve ser um array'], 400);
    }

    $tableExists = $pdo->query("SHOW TABLES LIKE 'event_scenario_items'")->rowCount() > 0;
    if (!$tableExists) {
        send_json(['error' => 'Tabela event_scenario_items não existe. Execute schema_scenario_items.sql'], 500);
    }

    $pdo->beginTransaction();
    try {
        foreach ($inputItems as $row) {
            $finId = isset($row['financial_item_id']) ? (int)$row['financial_item_id'] : 0;
            $amount = isset($row['expected_amount']) ? (float)$row['expected_amount'] : 0;
            if ($finId <= 0) {
                continue;
            }
            $stmt = $pdo->prepare(
                'INSERT INTO event_scenario_items (scenario_id, financial_item_id, expected_amount)
                 VALUES (:scenario_id, :financial_item_id, :expected_amount)
                 ON DUPLICATE KEY UPDATE expected_amount = :expected_amount2'
            );
            $stmt->execute([
                'scenario_id' => $scenarioId,
                'financial_item_id' => $finId,
                'expected_amount' => $amount,
                'expected_amount2' => $amount,
            ]);
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        send_json(['error' => $e->getMessage()], 500);
    }

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);
