<?php
// api/config.php
// Configuração básica de conexão com MySQL e helpers de JSON

header('Content-Type: application/json; charset=utf-8');

// Ajuste estes dados se necessário para o ambiente local/produção
$DB_HOST = 'localhost';
$DB_NAME = 'u179630068_raizes_bd';
$DB_USER = 'u179630068_raizes_user';
$DB_PASS = '=Vi4u*Nc+N';

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados.']);
    exit;
}

/**
 * Lê o corpo JSON da requisição e devolve como array.
 */
function json_input(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }

    return $data;
}

/**
 * Envia uma resposta JSON com código HTTP.
 */
function send_json($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

