<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__."/config.php";
authGuard();

[$bas,$bit]=getDateRange();
$p=$_GET;

$where=["BASLAMA BETWEEN ? AND ?"];
$params=[[$bas." 00:00:00",SQLSRV_PARAM_IN],[$bit." 23:59:59",SQLSRV_PARAM_IN]];

if (!empty($p['musteri']))  { $where[]="TICARI_UNVANI LIKE ?"; $params[]=["%{$p['musteri']}%",SQLSRV_PARAM_IN]; }
if (!empty($p['tipi']))     { $where[]="TIPI = ?";              $params[]=[$p['tipi'],SQLSRV_PARAM_IN]; }
if (!empty($p['durum']))    { $where[]="DURUMU = ?";            $params[]=[$p['durum'],SQLSRV_PARAM_IN]; }
if (!empty($p['sahip']))    { $where[]="AKTIVITE_SAHIBI = ?";   $params[]=[$p['sahip'],SQLSRV_PARAM_IN]; }

$sql="SELECT CARIKODU,TICARI_UNVANI,KONU,AKTIVITE_KODU,TIPI,DURUMU,
      AKTIVITE_SAHIBI,BASLAMA,BITIS,GORUSME_SURESI,ACIKLAMA_NOTLAR,
      ILI_1,GRUBU,CARI_AKTIF,FIRSATADI
      FROM VW_CRM_AKTIVITE WHERE ".implode(" AND ",$where)." ORDER BY BASLAMA DESC";

try {
    $rows=runQuery($sql,$params);
    // Sahibi bazlı sayım
    $sahipStat=[];
    foreach($rows as $r){
        $s=$r['AKTIVITE_SAHIBI']??'Belirsiz';
        if(!isset($sahipStat[$s])) $sahipStat[$s]=['toplam'=>0,'yapildi'=>0,'yapilacak'=>0];
        $sahipStat[$s]['toplam']++;
        if(($r['DURUMU']??'')==='Yapıldı')    $sahipStat[$s]['yapildi']++;
        if(($r['DURUMU']??'')==='Yapılacak')  $sahipStat[$s]['yapilacak']++;
    }
    echo json_encode(['rows'=>$rows,'kpi'=>['sayi'=>count($rows),'yapildi'=>count(array_filter($rows,fn($r)=>($r['DURUMU']??'')==='Yapıldı')),'yapilacak'=>count(array_filter($rows,fn($r)=>($r['DURUMU']??'')==='Yapılacak')),'firsat'=>count(array_filter($rows,fn($r)=>!empty($r['FIRSATADI']))),'sahip_stat'=>$sahipStat]],JSON_UNESCAPED_UNICODE);
} catch(Exception $e){ http_response_code(500); echo json_encode(['error'=>$e->getMessage()]); }
