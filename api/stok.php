<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__."/config.php";
authGuard();

$p=$_GET;
$where=["1=1"];
$params=[];

if (!empty($p['durum'])) { $where[]="DURUM = ?";   $params[]=[$p['durum'],SQLSRV_PARAM_IN]; }
if (!empty($p['marka'])) { $where[]="MARKASI = ?"; $params[]=[$p['marka'],SQLSRV_PARAM_IN]; }
if (!empty($p['stok']))  { $where[]="(STOK_ADI LIKE ? OR STOKKODU LIKE ?)"; $params[]=["%{$p['stok']}%",SQLSRV_PARAM_IN]; $params[]=["%{$p['stok']}%",SQLSRV_PARAM_IN]; }

$sql="SELECT DURUM,STOKKODU,STOK_ADI,MARKASI,MODELI,
      STOK_MIKTARI,SIPARIS_KALAN_MIKTARI,TERMIN_MIKTAR,TERMINLI_STOK,
      CARI_1,CARI_2,CARI_3,CARI_4,CARI_5,CARI_6,CARI_7,CARI_8,CARI_9,CARI_10
      FROM TRV_STOK_SIPARIS_DURUM WHERE ".implode(" AND ",$where);

try {
    $rows=runQuery($sql,$params);
    echo json_encode(['rows'=>$rows,'kpi'=>['sayi'=>count($rows),'kritik'=>count(array_filter($rows,fn($r)=>($r['TERMINLI_STOK']??0)<0)),'siparisteVarStokYok'=>count(array_filter($rows,fn($r)=>($r['SIPARIS_KALAN_MIKTARI']??0)>0&&($r['STOK_MIKTARI']??0)<=0)),'stokta'=>count(array_filter($rows,fn($r)=>($r['STOK_MIKTARI']??0)>0))]],JSON_UNESCAPED_UNICODE);
} catch(Exception $e){ http_response_code(500); echo json_encode(['error'=>$e->getMessage()]); }
