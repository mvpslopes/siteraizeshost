<?php
// api/bar_sales.php
// Lançamentos de vendas do bar (cada venda é um registro; estoque do produto é outro conceito)

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
$eventId = isset($qs['event_id']) ? (int)$qs['event_id'] : 0;

if ($eventId <= 0) {
    send_json(['error' => 'event_id é obrigatório'], 400);
}

$table = 'event_bar_sales';
$itemsTable = 'event_bar_items';

if ($method === 'GET') {
    $barItemId = isset($qs['bar_item_id']) ? (int)$qs['bar_item_id'] : null;

    $sql = "SELECT s.*, i.name AS item_name, i.unit AS item_unit
            FROM {$table} s
            INNER JOIN {$itemsTable} i ON i.id = s.bar_item_id AND i.event_id = s.event_id
            WHERE s.event_id = :event_id";
    $params = ['event_id' => $eventId];
    if ($barItemId !== null) {
        $sql .= " AND s.bar_item_id = :bar_item_id";
        $params['bar_item_id'] = $barItemId;
    }
    $sql .= " ORDER BY s.sold_at DESC, s.id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $sales = $stmt->fetchAll();
    send_json(['sales' => $sales]);
}

if ($method === 'POST') {
    $body = json_input();
    $barItemId = isset($body['bar_item_id']) ? (int)$body['bar_item_id'] : 0;
    $quantity = isset($body['quantity']) ? (float)$body['quantity'] : 0;

    if ($barItemId <= 0 || $quantity <= 0) {
        send_json(['error' => 'bar_item_id e quantity (positivo) são obrigatórios'], 400);
    }

    // Buscar o item para pegar unit_price e garantir que pertence ao evento
    $stmt = $pdo->prepare("SELECT id, unit_price, quantity_stock, quantity_sold FROM {$itemsTable} WHERE id = :id AND event_id = :event_id");
    $stmt->execute(['id' => $barItemId, 'event_id' => $eventId]);
    $item = $stmt->fetch();
    if (!$item) {
        send_json(['error' => 'Item do bar não encontrado'], 404);
    }

    $unitPrice = isset($body['unit_price']) && is_numeric($body['unit_price'])
        ? (float)$body['unit_price']
        : (float)$item['unit_price'];
    $total = round($quantity * $unitPrice, 2);

    $soldAt = null;
    if (!empty($body['sold_at'])) {
        $parsed = strtotime($body['sold_at']);
        if ($parsed !== false) {
            $soldAt = date('Y-m-d H:i:s', $parsed);
        }
    }
    if ($soldAt === null) {
        $soldAt = date('Y-m-d H:i:s');
    }

    $pdo->beginTransaction();
    try {
    $stmt = $pdo->prepare(
        "INSERT INTO {$table} (event_id, bar_item_id, quantity, unit_price, total, sold_at, created_at)
             VALUES (:event_id, :bar_item_id, :quantity, :unit_price, :total, :sold_at, NOW())"
    );
    $stmt->execute([
        'event_id' => $eventId,
        'bar_item_id' => $barItemId,
        'quantity' => $quantity,
        'unit_price' => $unitPrice,
        'total' => $total,
        'sold_at' => $soldAt,
    ]);

        $saleId = (int)$pdo->lastInsertId();

        // Atualizar quantity_sold no item (para resumo e compatibilidade)
        $newSold = (float)$item['quantity_sold'] + $quantity;
        $stmt = $pdo->prepare("UPDATE {$itemsTable} SET quantity_sold = :qty, updated_at = NOW() WHERE id = :id");
        $stmt->execute(['qty' => $newSold, 'id' => $barItemId]);

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        send_json(['error' => 'Erro ao registrar venda: ' . $e->getMessage()], 500);
    }

    $stmt = $pdo->prepare(
        "SELECT s.*, i.name AS item_name, i.unit AS item_unit FROM {$table} s
         INNER JOIN {$itemsTable} i ON i.id = s.bar_item_id AND i.event_id = s.event_id
         WHERE s.id = :id"
    );
    $stmt->execute(['id' => $saleId]);
    $sale = $stmt->fetch();
    send_json(['sale' => $sale], 201);
}

if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID da venda inválido'], 400);
    }

    $stmt = $pdo->prepare("SELECT bar_item_id, quantity FROM {$table} WHERE id = :id AND event_id = :event_id");
    $stmt->execute(['id' => $id, 'event_id' => $eventId]);
    $sale = $stmt->fetch();
    if (!$sale) {
        send_json(['error' => 'Venda não encontrada'], 404);
    }

    $stmt = $pdo->prepare("SELECT quantity_sold FROM {$itemsTable} WHERE id = :id");
    $stmt->execute(['id' => $sale['bar_item_id']]);
    $item = $stmt->fetch();
    $newSold = $item ? max(0, (float)$item['quantity_sold'] - (float)$sale['quantity']) : 0;

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
        $stmt->execute(['id' => $id]);

        $stmt = $pdo->prepare("UPDATE {$itemsTable} SET quantity_sold = :qty, updated_at = NOW() WHERE id = :id");
        $stmt->execute(['qty' => $newSold, 'id' => $sale['bar_item_id']]);

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        send_json(['error' => 'Erro ao excluir venda: ' . $e->getMessage()], 500);
    }
    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);
