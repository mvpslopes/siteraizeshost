<?php
// api/survey_responses.php
// Submissão pública de respostas + leitura de resultados (admin)

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);

// ---------- POST: submissão pública ----------
if ($method === 'POST') {
    $body = json_input();

    $surveyId = isset($body['survey_id']) ? (int)$body['survey_id'] : 0;
    if ($surveyId <= 0) {
        send_json(['error' => 'survey_id é obrigatório'], 400);
    }

    // Verificar que a pesquisa está publicada
    $st = $pdo->prepare("SELECT id, status FROM satisfaction_surveys WHERE id = :id");
    $st->execute(['id' => $surveyId]);
    $survey = $st->fetch();
    if (!$survey) {
        send_json(['error' => 'Pesquisa não encontrada'], 404);
    }
    if ($survey['status'] !== 'publicada') {
        send_json(['error' => 'Esta pesquisa não está disponível para respostas'], 403);
    }

    // Criar o registro de resposta
    $token = bin2hex(random_bytes(16));
    $stmt = $pdo->prepare(
        'INSERT INTO satisfaction_survey_responses (survey_id, respondent_token, submitted_at)
         VALUES (:survey_id, :token, NOW())'
    );
    $stmt->execute(['survey_id' => $surveyId, 'token' => $token]);
    $responseId = (int)$pdo->lastInsertId();

    // Inserir cada resposta individual
    if (!empty($body['answers']) && is_array($body['answers'])) {
        $stAnswer = $pdo->prepare(
            'INSERT INTO satisfaction_survey_answers (response_id, question_id, answer)
             VALUES (:response_id, :question_id, :answer)'
        );
        foreach ($body['answers'] as $a) {
            $qid = isset($a['question_id']) ? (int)$a['question_id'] : 0;
            if ($qid <= 0) continue;
            $stAnswer->execute([
                'response_id' => $responseId,
                'question_id' => $qid,
                'answer'      => isset($a['answer']) ? (string)$a['answer'] : null,
            ]);
        }
    }

    send_json(['success' => true, 'response_id' => $responseId], 201);
}

// ---------- GET: resultados para o painel admin ----------
if ($method === 'GET') {
    $surveyId = isset($qs['survey_id']) ? (int)$qs['survey_id'] : 0;
    if ($surveyId <= 0) {
        send_json(['error' => 'survey_id é obrigatório'], 400);
    }

    // Total de respostas
    $stTotal = $pdo->prepare('SELECT COUNT(*) FROM satisfaction_survey_responses WHERE survey_id = :sid');
    $stTotal->execute(['sid' => $surveyId]);
    $totalResponses = (int)$stTotal->fetchColumn();

    // Perguntas
    $stQ = $pdo->prepare(
        'SELECT * FROM satisfaction_survey_questions WHERE survey_id = :sid ORDER BY display_order, id'
    );
    $stQ->execute(['sid' => $surveyId]);
    $questions = $stQ->fetchAll();

    $stats = [];
    foreach ($questions as $q) {
        $qid  = (int)$q['id'];
        $type = $q['type'];

        // Buscar todas as respostas desta pergunta
        $stA = $pdo->prepare(
            'SELECT a.answer
             FROM satisfaction_survey_answers a
             INNER JOIN satisfaction_survey_responses r ON r.id = a.response_id
             WHERE a.question_id = :qid AND r.survey_id = :sid AND a.answer IS NOT NULL AND a.answer != ""'
        );
        $stA->execute(['qid' => $qid, 'sid' => $surveyId]);
        $rawAnswers = $stA->fetchAll(PDO::FETCH_COLUMN);

        $entry = [
            'question_id'   => $qid,
            'question_text' => $q['text'],
            'type'          => $type,
            'answer_count'  => count($rawAnswers),
        ];

        if ($type === 'nota') {
            $nums = array_map('floatval', $rawAnswers);
            $entry['average']     = count($nums) ? round(array_sum($nums) / count($nums), 2) : null;
            $entry['distribution'] = array_count_values(array_map('strval', array_map('intval', $nums)));
        } elseif ($type === 'nps') {
            $nums = array_map('intval', $rawAnswers);
            $promoters  = count(array_filter($nums, fn($v) => $v >= 9));
            $detractors = count(array_filter($nums, fn($v) => $v <= 6));
            $total      = count($nums);
            $entry['nps_score']   = $total ? round((($promoters - $detractors) / $total) * 100) : null;
            $entry['distribution'] = array_count_values(array_map('strval', $nums));
        } elseif ($type === 'sim_nao') {
            $entry['distribution'] = array_count_values($rawAnswers);
        } elseif ($type === 'multipla_escolha') {
            $entry['distribution'] = array_count_values($rawAnswers);
        } else {
            // texto: retornar últimas 50 respostas
            $entry['text_answers'] = array_slice($rawAnswers, 0, 50);
        }

        $stats[] = $entry;
    }

    send_json([
        'survey_id'       => $surveyId,
        'total_responses' => $totalResponses,
        'stats'           => $stats,
    ]);
}

// ---------- DELETE: limpar todas as respostas de uma pesquisa ----------
if ($method === 'DELETE') {
    $surveyId = isset($qs['survey_id']) ? (int)$qs['survey_id'] : 0;
    if ($surveyId <= 0) {
        send_json(['error' => 'survey_id é obrigatório'], 400);
    }

    $st = $pdo->prepare('SELECT id FROM satisfaction_surveys WHERE id = :id');
    $st->execute(['id' => $surveyId]);
    if (!$st->fetch()) {
        send_json(['error' => 'Pesquisa não encontrada'], 404);
    }

    try {
        $pdo->beginTransaction();

        $countStmt = $pdo->prepare('SELECT COUNT(*) FROM satisfaction_survey_responses WHERE survey_id = :sid');
        $countStmt->execute(['sid' => $surveyId]);
        $deletedResponses = (int)$countStmt->fetchColumn();

        $stmt = $pdo->prepare(
            'DELETE a FROM satisfaction_survey_answers a
             INNER JOIN satisfaction_survey_responses r ON r.id = a.response_id
             WHERE r.survey_id = :sid'
        );
        $stmt->execute(['sid' => $surveyId]);

        $stmt = $pdo->prepare('DELETE FROM satisfaction_survey_responses WHERE survey_id = :sid');
        $stmt->execute(['sid' => $surveyId]);

        $pdo->commit();

        send_json(['success' => true, 'deleted_responses' => $deletedResponses]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        send_json(['error' => 'Erro ao limpar respostas'], 500);
    }
}

send_json(['error' => 'Método não permitido'], 405);
