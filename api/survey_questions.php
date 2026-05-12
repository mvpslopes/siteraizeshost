<?php
// api/survey_questions.php
// CRUD de perguntas de uma pesquisa

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);

$surveyId = isset($qs['survey_id']) ? (int)$qs['survey_id'] : 0;
if ($surveyId <= 0) {
    send_json(['error' => 'survey_id é obrigatório'], 400);
}

// ---------- GET ----------
if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT * FROM satisfaction_survey_questions WHERE survey_id = :sid ORDER BY display_order, id'
    );
    $stmt->execute(['sid' => $surveyId]);
    $questions = $stmt->fetchAll();
    foreach ($questions as &$q) {
        if ($q['options']) {
            $q['options'] = json_decode($q['options'], true);
        }
    }
    unset($q);
    send_json(['questions' => $questions]);
}

// ---------- POST ----------
if ($method === 'POST') {
    $body = json_input();

    if (empty($body['text'])) {
        send_json(['error' => 'text é obrigatório'], 400);
    }

    $opts = null;
    if (!empty($body['options']) && is_array($body['options'])) {
        $opts = json_encode($body['options'], JSON_UNESCAPED_UNICODE);
    }

    // Próxima ordem
    $st = $pdo->prepare('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM satisfaction_survey_questions WHERE survey_id = :sid');
    $st->execute(['sid' => $surveyId]);
    $nextOrder = (int)$st->fetchColumn();

    $stmt = $pdo->prepare(
        'INSERT INTO satisfaction_survey_questions
            (survey_id, text, type, options, required, display_order, created_at)
         VALUES
            (:survey_id, :text, :type, :options, :required, :display_order, NOW())'
    );
    $stmt->execute([
        'survey_id'     => $surveyId,
        'text'          => $body['text'],
        'type'          => $body['type'] ?? 'nota',
        'options'       => $opts,
        'required'      => isset($body['required']) ? (int)$body['required'] : 1,
        'display_order' => $body['display_order'] ?? $nextOrder,
    ]);

    $id = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM satisfaction_survey_questions WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $question = $stmt->fetch();
    if ($question['options']) {
        $question['options'] = json_decode($question['options'], true);
    }

    send_json(['question' => $question], 201);
}

// ---------- PUT (atualiza uma ou reordena todas) ----------
if ($method === 'PUT' || $method === 'PATCH') {
    $body = json_input();

    // Reordenação em lote: { "reorder": [{ "id": 1, "display_order": 0 }, ...] }
    if (!empty($body['reorder']) && is_array($body['reorder'])) {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('UPDATE satisfaction_survey_questions SET display_order = :o WHERE id = :id AND survey_id = :sid');
        foreach ($body['reorder'] as $item) {
            $stmt->execute([
                'o'   => (int)$item['display_order'],
                'id'  => (int)$item['id'],
                'sid' => $surveyId,
            ]);
        }
        $pdo->commit();
        $stAll = $pdo->prepare('SELECT * FROM satisfaction_survey_questions WHERE survey_id = :sid ORDER BY display_order, id');
        $stAll->execute(['sid' => $surveyId]);
        send_json(['questions' => $stAll->fetchAll()]);
    }

    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $fields = [];
    $params = ['id' => $id];

    $opts = null;
    foreach (['text', 'type', 'required', 'display_order'] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }
    if (array_key_exists('options', $body)) {
        $opts = (!empty($body['options']) && is_array($body['options']))
            ? json_encode($body['options'], JSON_UNESCAPED_UNICODE)
            : null;
        $fields[] = 'options = :options';
        $params['options'] = $opts;
    }

    if (!$fields) {
        send_json(['error' => 'Nada para atualizar'], 400);
    }

    $sql = 'UPDATE satisfaction_survey_questions SET ' . implode(', ', $fields) . ' WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM satisfaction_survey_questions WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $question = $stmt->fetch();
    if ($question['options']) {
        $question['options'] = json_decode($question['options'], true);
    }

    send_json(['question' => $question]);
}

// ---------- DELETE ----------
if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $pdo->prepare('DELETE FROM satisfaction_survey_answers WHERE question_id = :id')->execute(['id' => $id]);
    $pdo->prepare('DELETE FROM satisfaction_survey_questions WHERE id = :id AND survey_id = :sid')
        ->execute(['id' => $id, 'sid' => $surveyId]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);
