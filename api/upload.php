<?php
// api/upload.php
// Upload de imagens para o sistema (surveys, eventos, etc.)

header('Content-Type: application/json; charset=utf-8');

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$maxSize      = 10 * 1024 * 1024; // 10 MB
$uploadDir    = __DIR__ . '/../uploads/surveys/';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

if (empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado']);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Erro no upload: código ' . $file['error']]);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Arquivo muito grande. Máximo: 10 MB']);
    exit;
}

// Verificar MIME real (não confiar só no nome)
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.']);
    exit;
}

// Criar pasta se não existir
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Gerar nome único
$ext      = match ($mimeType) {
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    default      => 'jpg',
};
$filename = uniqid('survey_', true) . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao salvar o arquivo no servidor']);
    exit;
}

// URL pública relativa à raiz do site
$publicUrl = '/uploads/surveys/' . $filename;

echo json_encode(['url' => $publicUrl]);
