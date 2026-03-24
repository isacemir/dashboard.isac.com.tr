<?php
define("DB_SERVER",   "46.31.149.222,14346");
define("DB_DATABASE", "WOLVOX9_ISTANBULSENSORLER_2026_WOLVOX");
define("DB_USER",     "sa");
define("DB_PASS",     "347862Abc");   // ← sadece bunu değiştir

function authGuard() {
    session_start();
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode(['error' => 'Oturum acmaniz gerekiyor.']);
        exit;
    }
    if (time() - ($_SESSION['login_time'] ?? 0) > 7200) {
        session_destroy();
        http_response_code(401);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode(['error' => 'Oturum suresi doldu.']);
        exit;
    }
    $_SESSION['login_time'] = time();
}

// Hızlı tarih filtresi → [start, end] döner (Y-m-d formatında)
function getDateRange() {
    $quick = $_GET['quick_date'] ?? '';
    $bas   = $_GET['tarih_bas']  ?? '';
    $bit   = $_GET['tarih_bit']  ?? '';

    switch ($quick) {
        case 'bugun':
            return [date('Y-m-d'), date('Y-m-d')];
        case 'dun':
            $d = date('Y-m-d', strtotime('-1 day'));
            return [$d, $d];
        case 'bu_hafta':
            // Pazartesi - Pazar
            $pzt = date('Y-m-d', strtotime('monday this week'));
            $paz = date('Y-m-d', strtotime('sunday this week'));
            return [$pzt, $paz];
        case 'bu_ay':
            return [
                date('Y-m-01'),
                date('Y-m-t'),
            ];
        case 'bu_yil':
            return [date('Y-01-01'), date('Y-12-31')];
        default:
            return [
                $bas ?: date('Y-m-d', strtotime('-365 days')),
                $bit ?: date('Y-m-d'),
            ];
    }
}

function getConn() {
    $conn = sqlsrv_connect(DB_SERVER, [
        "Database"               => DB_DATABASE,
        "UID"                    => DB_USER,
        "PWD"                    => DB_PASS,
        "CharacterSet"           => "UTF-8",
        "TrustServerCertificate" => true,
    ]);
    if (!$conn) throw new Exception(print_r(sqlsrv_errors(), true));
    return $conn;
}

function runQuery($sql, $params = []) {
    $conn = getConn();
    $stmt = empty($params)
        ? sqlsrv_query($conn, $sql)
        : sqlsrv_query($conn, $sql, $params);
    if ($stmt === false) throw new Exception(print_r(sqlsrv_errors(), true));
    $rows = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        foreach ($row as $k => $v) {
            if ($v instanceof DateTime) $row[$k] = $v->format('Y-m-d H:i');
            elseif (is_null($v))       $row[$k] = null;
        }
        $rows[] = $row;
    }
    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);
    return $rows;
}
