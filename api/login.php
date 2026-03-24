<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
session_start();

$USERS = [
    'admin'    => 'isac2024!',
    'neslihan' => 'isac2024!',
    'olcay'    => 'isac2024!',
    'oguzcan'  => 'isac2024!',
    'bahri'    => 'isac2024!',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in   = json_decode(file_get_contents('php://input'), true);
    $user = trim($in['username'] ?? '');
    $pass = trim($in['password'] ?? '');
    if (isset($USERS[$user]) && $USERS[$user] === $pass) {
        $_SESSION['user']       = $user;
        $_SESSION['login_time'] = time();
        echo json_encode(['ok' => true, 'user' => $user]);
    } else {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Kullanici adi veya sifre hatali.']);
    }
    exit;
}

if (isset($_SESSION['user'])) {
    if (time() - ($_SESSION['login_time'] ?? 0) > 7200) {
        session_destroy();
        echo json_encode(['ok' => false]);
    } else {
        $_SESSION['login_time'] = time();
        echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
    }
} else {
    echo json_encode(['ok' => false]);
}
