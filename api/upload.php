<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config.php';
authGuard();

require_once __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$TARGETS = [
    'satis'             => 'satis-raporu.xlsx',
    'siparis'           => 'siparis-raporu.xlsx',
    'teklif'            => 'teklif-raporu.xlsx',
    'satinalma_teklif'  => 'SATINALMA-TEKLIF.xlsx',
    'satinalma_fatura'  => 'satinalma-fatura-raporu.xlsx',
    'stok'              => 'stok-siparis-raporu.xlsx',
    'crm'               => 'crm.xlsx',
];

$target = trim($_POST['target'] ?? '');
if (!$target || !isset($TARGETS[$target])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Geçersiz hedef belirtildi.']);
    exit;
}

if (empty($_FILES['excel']) || $_FILES['excel']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Dosya yüklenemedi.']);
    exit;
}

$ext = strtolower(pathinfo($_FILES['excel']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ['xlsx', 'xls'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Sadece .xlsx veya .xls dosyaları kabul edilir.']);
    exit;
}

// Save uploaded file to dashboard-excel/
$excelDir = dirname(__DIR__) . '/dashboard-excel';
if (!is_dir($excelDir)) mkdir($excelDir, 0755, true);
$destPath = $excelDir . '/' . $TARGETS[$target];
if (!move_uploaded_file($_FILES['excel']['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Excel dosyası kaydedilemedi.']);
    exit;
}

// Convert Excel to JSON
try {
    $spreadsheet = IOFactory::load($destPath);
    $sheet = $spreadsheet->getActiveSheet();
    $rawRows = $sheet->toArray(null, true, true, false);

    // First row as headers
    $headers = array_shift($rawRows);
    $headers = array_map(fn($h) => trim((string)$h), $headers);
    $rows = [];
    foreach ($rawRows as $raw) {
        $row = [];
        foreach ($headers as $i => $h) {
            if ($h === '') continue;
            $row[$h] = $raw[$i] ?? null;
        }
        $rows[] = $row;
    }

    // Build KPI + Charts (mirrors sync-excel.js logic)
    $kpi = ['sayi' => count($rows)];
    $charts = [];

    function groupSum(array $rows, callable $keyFn, callable $valFn): array {
        $m = [];
        foreach ($rows as $r) {
            $k = $keyFn($r);
            if (!$k) continue;
            $m[$k] = ($m[$k] ?? 0) + ($valFn($r) ?? 0);
        }
        arsort($m);
        $out = [];
        foreach ($m as $name => $val) $out[] = ['name' => $name, 'val' => $val];
        return $out;
    }

    if ($target === 'satis') {
        $kpi['toplam'] = array_sum(array_map(fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0), $rows));
        $kpi['iptal']  = array_sum(array_map(fn($r) => ($r['IPTAL'] == 1) ? floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0) : 0, $rows));
        $kpi['teslim'] = $kpi['toplam'] - $kpi['iptal'];
        $kpi['kalan']  = 0;
        $trend = groupSum($rows, fn($r) => substr((string)($r['TARIHI'] ?? ''), 0, 7), fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0));
        usort($trend, fn($a,$b) => strcmp($a['name'], $b['name']));
        $charts['trend'] = $trend;
        $charts['bolge'] = array_slice(groupSum($rows, fn($r) => $r['GRUBU'] ?? null, fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0)), 0, 7);
    } elseif ($target === 'siparis') {
        $kpi['teslim'] = array_sum(array_map(fn($r) => floatval($r['TESLIM_EUR_TUTAR'] ?? 0), $rows));
        $kpi['kalan']  = array_sum(array_map(fn($r) => floatval($r['KALAN_EUR_TUTAR'] ?? 0), $rows));
        $kpi['iptal']  = 0;
        $kpi['toplam'] = array_sum(array_map(fn($r) => floatval($r['DVZ_IND_TUTAR'] ?? 0), $rows));
        $trend = groupSum($rows, fn($r) => substr((string)($r['TARIHI'] ?? ''), 0, 7), fn($r) => floatval($r['DVZ_IND_TUTAR'] ?? 0));
        usort($trend, fn($a,$b) => strcmp($a['name'], $b['name']));
        $charts['trend'] = $trend;
        $charts['bolge'] = array_slice(groupSum($rows, fn($r) => $r['GRUBU'] ?? null, fn($r) => floatval($r['DVZ_IND_TUTAR'] ?? 0)), 0, 7);
    } elseif ($target === 'teklif' || $target === 'satinalma_teklif') {
        $kpi['toplam'] = array_sum(array_map(fn($r) => floatval($r['DVZ_IND_TUTAR'] ?? 0), $rows));
        $open = ['Teklifte', 'Açık'];
        $closed = ['Onaylandı', 'Siparişe Aktarıldı', 'Sipariş Aktarıldı'];
        $kpi['acik']   = count(array_filter($rows, fn($r) => in_array($r['TEKLIF_DURUMU'] ?? '', $open)));
        $kpi['kapali'] = count(array_filter($rows, fn($r) => in_array($r['TEKLIF_DURUMU'] ?? '', $closed)));
        $charts['durum'] = [
            ['name' => 'Açık',   'val' => $kpi['acik']],
            ['name' => 'Kapalı', 'val' => $kpi['kapali']],
            ['name' => 'İptal',  'val' => count(array_filter($rows, fn($r) => ($r['TEKLIF_DURUMU'] ?? '') === 'İptal'))],
        ];
        $charts['marka'] = array_slice(groupSum($rows, fn($r) => $r['MARKASI'] ?? null, fn($r) => floatval($r['DVZ_IND_TUTAR'] ?? 0)), 0, 7);
    } elseif ($target === 'crm') {
        $kpi['yapildi']   = count(array_filter($rows, fn($r) => ($r['DURUMU'] ?? '') === 'Yapıldı'));
        $kpi['yapilacak'] = count(array_filter($rows, fn($r) => ($r['DURUMU'] ?? '') === 'Yapılacak'));
        $kpi['firsat']    = count(array_filter($rows, fn($r) => !empty($r['FIRSATADI'])));
        $charts['aktivite'] = array_slice(groupSum($rows, fn($r) => $r['AKTIVITE_TIPI'] ?? null, fn($r) => 1), 0, 7);
    } elseif ($target === 'stok') {
        $kpi['stokta']            = count(array_filter($rows, fn($r) => floatval($r['STOK_MIKTARI'] ?? 0) > 0));
        $kpi['kritik']            = count(array_filter($rows, fn($r) => in_array($r['DURUM'] ?? '', ['KRİTİK STOK', 'SIFIR BAKİYE - SATIN ALMA YOK'])));
        $kpi['siparisteVarStokYok'] = count(array_filter($rows, fn($r) => floatval($r['SIPARIS_KALAN_MIKTARI'] ?? 0) > 0 && floatval($r['STOK_MIKTARI'] ?? 0) <= 0));
        $charts['kategori'] = array_slice(groupSum($rows, fn($r) => $r['ALT_GRUBU'] ?? null, fn($r) => 1), 0, 7);
        $charts['durum']    = groupSum($rows, fn($r) => $r['DURUM'] ?? null, fn($r) => 1);
        $charts['marka']    = array_slice(groupSum($rows, fn($r) => $r['MARKASI'] ?? null, fn($r) => floatval($r['SIPARIS_KALAN_MIKTARI'] ?? 0)), 0, 7);
    } elseif ($target === 'satinalma_fatura') {
        $kpi['toplam'] = array_sum(array_map(fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0), $rows));
        $ciro = groupSum($rows, fn($r) => sprintf('%s-%02d', $r['YIL'] ?? '', intval($r['AY'] ?? 0)), fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0));
        usort($ciro, fn($a,$b) => strcmp($a['name'], $b['name']));
        $charts['ciro']  = $ciro;
        $charts['marka'] = array_slice(groupSum($rows, fn($r) => $r['MARKASI'] ?? null, fn($r) => floatval($r['IKINCI_DVZ_IND_TUTAR'] ?? 0)), 0, 7);
    }

    $summary = ['kpi' => $kpi, 'charts' => $charts, 'lastSync' => date('c')];

    $dataDir = dirname(__DIR__) . '/public/data';
    if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

    file_put_contents($dataDir . "/{$target}_summary.json", json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    file_put_contents($dataDir . "/{$target}_rows.json",    json_encode(['rows' => $rows], JSON_UNESCAPED_UNICODE));

    echo json_encode(['ok' => true, 'message' => ucfirst($target) . ' verileri başarıyla güncellendi.', 'rows' => count($rows), 'lastSync' => $summary['lastSync']]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Dönüştürme hatası: ' . $e->getMessage()]);
}
