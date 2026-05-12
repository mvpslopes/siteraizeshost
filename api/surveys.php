<?php
// api/surveys.php
// CRUD de pesquisas de satisfação

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);

// ---------- GET ----------
if ($method === 'GET') {
    // /api/surveys.php?slug=xxx  → retorna pesquisa pública pelo slug (sem auth)
    if (!empty($qs['slug'])) {
        $slug = trim($qs['slug']);
        $stmt = $pdo->prepare(
            'SELECT s.*, e.name AS event_name, e.event_date AS start_date, e.event_date AS end_date, e.location
             FROM satisfaction_surveys s
             LEFT JOIN events e ON e.id = s.event_id
             WHERE s.slug = :slug'
        );
        $stmt->execute(['slug' => $slug]);
        $survey = $stmt->fetch();
        if (!$survey) {
            send_json(['error' => 'Pesquisa não encontrada'], 404);
        }
        // Buscar perguntas
        $sq = $pdo->prepare(
            'SELECT * FROM satisfaction_survey_questions WHERE survey_id = :sid ORDER BY display_order, id'
        );
        $sq->execute(['sid' => $survey['id']]);
        $questions = $sq->fetchAll();
        foreach ($questions as &$q) {
            if ($q['options']) {
                $q['options'] = json_decode($q['options'], true);
            }
        }
        unset($q);
        $survey['questions'] = $questions;
        send_json(['survey' => $survey]);
    }

    // /api/surveys.php?id=xxx → retorna uma pesquisa com perguntas (admin)
    if (!empty($qs['id'])) {
        $id = (int)$qs['id'];
        $stmt = $pdo->prepare(
            'SELECT s.*, e.name AS event_name
             FROM satisfaction_surveys s
             LEFT JOIN events e ON e.id = s.event_id
             WHERE s.id = :id'
        );
        $stmt->execute(['id' => $id]);
        $survey = $stmt->fetch();
        if (!$survey) {
            send_json(['error' => 'Pesquisa não encontrada'], 404);
        }
        $sq = $pdo->prepare(
            'SELECT * FROM satisfaction_survey_questions WHERE survey_id = :sid ORDER BY display_order, id'
        );
        $sq->execute(['sid' => $id]);
        $questions = $sq->fetchAll();
        foreach ($questions as &$q) {
            if ($q['options']) {
                $q['options'] = json_decode($q['options'], true);
            }
        }
        unset($q);
        $survey['questions'] = $questions;
        send_json(['survey' => $survey]);
    }

    // /api/surveys.php?event_id=xxx → lista pesquisas de um evento
    if (!empty($qs['event_id'])) {
        $eventId = (int)$qs['event_id'];
        $stmt = $pdo->prepare(
            'SELECT s.*, e.name AS event_name,
                (SELECT COUNT(*) FROM satisfaction_survey_responses r WHERE r.survey_id = s.id) AS response_count
             FROM satisfaction_surveys s
             LEFT JOIN events e ON e.id = s.event_id
             WHERE s.event_id = :event_id
             ORDER BY s.created_at DESC'
        );
        $stmt->execute(['event_id' => $eventId]);
        send_json(['surveys' => $stmt->fetchAll()]);
    }

    // Lista todas as pesquisas
    $stmt = $pdo->query(
        'SELECT s.*, e.name AS event_name,
            (SELECT COUNT(*) FROM satisfaction_survey_responses r WHERE r.survey_id = s.id) AS response_count
         FROM satisfaction_surveys s
         LEFT JOIN events e ON e.id = s.event_id
         ORDER BY s.created_at DESC'
    );
    send_json(['surveys' => $stmt->fetchAll()]);
}

// ---------- POST ----------
if ($method === 'POST') {
    $body = json_input();

    if (empty($body['event_id']) || empty($body['title'])) {
        send_json(['error' => 'event_id e title são obrigatórios'], 400);
    }

    // Gerar slug se não enviado
    $slug = !empty($body['slug'])
        ? slugify($body['slug'])
        : slugify($body['title']);

    // Garantir unicidade do slug
    $slug = ensure_unique_slug($pdo, $slug, 0);

    $stmt = $pdo->prepare(
        'INSERT INTO satisfaction_surveys
            (event_id, title, description, slug, hero_image_url, status, created_by, created_at, updated_at)
         VALUES
            (:event_id, :title, :description, :slug, :hero_image_url, :status, :created_by, NOW(), NOW())'
    );
    $stmt->execute([
        'event_id'       => (int)$body['event_id'],
        'title'          => $body['title'],
        'description'    => $body['description'] ?? null,
        'slug'           => $slug,
        'hero_image_url' => $body['hero_image_url'] ?? null,
        'status'         => $body['status'] ?? 'rascunho',
        'created_by'     => $body['created_by'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();

    // Inserir perguntas padrão se não vier questions
    if (empty($body['questions'])) {
        insert_default_questions($pdo, $id);
    } else {
        foreach ($body['questions'] as $i => $q) {
            insert_question($pdo, $id, $q, $i);
        }
    }

    $stmt = $pdo->prepare('SELECT * FROM satisfaction_surveys WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $survey = $stmt->fetch();

    send_json(['survey' => $survey], 201);
}

// ---------- PUT ----------
if ($method === 'PUT' || $method === 'PATCH') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    $body = json_input();
    $fields = [];
    $params = ['id' => $id];

    foreach (['event_id', 'title', 'description', 'hero_image_url', 'status'] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "{$field} = :{$field}";
            $params[$field] = $body[$field];
        }
    }

    // Slug recalculado se title ou slug mudar
    if (!empty($body['slug'])) {
        $newSlug = ensure_unique_slug($pdo, slugify($body['slug']), $id);
        $fields[] = 'slug = :slug';
        $params['slug'] = $newSlug;
    }

    if ($fields) {
        $sql = 'UPDATE satisfaction_surveys SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    $stmt = $pdo->prepare('SELECT * FROM satisfaction_surveys WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $survey = $stmt->fetch();

    send_json(['survey' => $survey]);
}

// ---------- DELETE ----------
if ($method === 'DELETE') {
    $id = isset($qs['id']) ? (int)$qs['id'] : 0;
    if ($id <= 0) {
        send_json(['error' => 'ID inválido'], 400);
    }

    // Cascata manual
    $stmt = $pdo->prepare(
        'DELETE a FROM satisfaction_survey_answers a
         INNER JOIN satisfaction_survey_responses r ON r.id = a.response_id
         WHERE r.survey_id = :id'
    );
    $stmt->execute(['id' => $id]);

    $pdo->prepare('DELETE FROM satisfaction_survey_responses WHERE survey_id = :id')->execute(['id' => $id]);
    $pdo->prepare('DELETE FROM satisfaction_survey_questions WHERE survey_id = :id')->execute(['id' => $id]);
    $pdo->prepare('DELETE FROM satisfaction_surveys WHERE id = :id')->execute(['id' => $id]);

    send_json(['success' => true]);
}

send_json(['error' => 'Método não permitido'], 405);

// ---------- Helpers ----------

function slugify(string $text): string {
    $text = mb_strtolower(trim($text), 'UTF-8');
    $from = ['á','à','ã','â','ä','é','è','ê','ë','í','ì','î','ï','ó','ò','õ','ô','ö','ú','ù','û','ü','ç','ñ'];
    $to   = ['a','a','a','a','a','e','e','e','e','i','i','i','i','o','o','o','o','o','u','u','u','u','c','n'];
    $text = str_replace($from, $to, $text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return trim($text, '-');
}

function ensure_unique_slug(PDO $pdo, string $slug, int $currentId): string {
    $base = $slug;
    $n = 1;
    while (true) {
        $st = $pdo->prepare('SELECT id FROM satisfaction_surveys WHERE slug = :slug AND id != :id');
        $st->execute(['slug' => $slug, 'id' => $currentId]);
        if (!$st->fetch()) break;
        $slug = $base . '-' . $n++;
    }
    return $slug;
}

function insert_question(PDO $pdo, int $surveyId, array $q, int $order): void {
    $opts = null;
    if (!empty($q['options']) && is_array($q['options'])) {
        $opts = json_encode($q['options'], JSON_UNESCAPED_UNICODE);
    }
    $stmt = $pdo->prepare(
        'INSERT INTO satisfaction_survey_questions
            (survey_id, text, type, options, required, display_order, created_at)
         VALUES
            (:survey_id, :text, :type, :options, :required, :display_order, NOW())'
    );
    $stmt->execute([
        'survey_id'     => $surveyId,
        'text'          => $q['text'] ?? '',
        'type'          => $q['type'] ?? 'nota',
        'options'       => $opts,
        'required'      => isset($q['required']) ? (int)$q['required'] : 1,
        'display_order' => $q['display_order'] ?? $order,
    ]);
}

function insert_default_questions(PDO $pdo, int $surveyId): void {
    $defaults = [
        ['text' => 'Como você avalia sua experiência geral no evento?',        'type' => 'nota'],
        ['text' => 'Como você avalia a organização do evento?',                'type' => 'nota'],
        ['text' => 'Como você avalia a estrutura e o local do evento?',        'type' => 'nota'],
        ['text' => 'Como você avalia o atendimento da equipe?',                'type' => 'nota'],
        ['text' => 'Você recomendaria um evento da Raízes para outra pessoa?', 'type' => 'nps'],
        ['text' => 'O que você mais gostou no evento?',                        'type' => 'texto', 'required' => 0],
        ['text' => 'O que podemos melhorar para os próximos eventos?',         'type' => 'texto', 'required' => 0],
    ];
    foreach ($defaults as $i => $q) {
        insert_question($pdo, $surveyId, $q, $i);
    }
}
