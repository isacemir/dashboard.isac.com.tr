<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__."/config.php";
authGuard();

[$bas,$bit]=getDateRange();
$p=$_GET;

$where=["TARIHI BETWEEN ? AND ?"];
$params=[[$bas,SQLSRV_PARAM_IN],[$bit,SQLSRV_PARAM_IN]];

if (!empty($p['musteri']))     { $where[]="TICARI_UNVANI LIKE ?"; $params[]=["%{$p['musteri']}%",SQLSRV_PARAM_IN]; }
if (!empty($p['stok_search'])){ $where[]="STOKKODU LIKE ?";      $params[]=["%{$p['stok_search']}%",SQLSRV_PARAM_IN]; }
if (!empty($p['bolge']))       { $where[]="GRUBU = ?";            $params[]=[$p['bolge'],SQLSRV_PARAM_IN]; }
if (!empty($p['personel']))    { $where[]="ARA_GRUBU = ?";        $params[]=[$p['personel'],SQLSRV_PARAM_IN]; }
if (!empty($p['kategori']))    { $where[]="ALT_GRUBU = ?";        $params[]=[$p['kategori'],SQLSRV_PARAM_IN]; }
if (!empty($p['marka']))       { $where[]="MARKASI = ?";          $params[]=[$p['marka'],SQLSRV_PARAM_IN]; }
if (!empty($p['model']))       { $where[]="MODELI = ?";           $params[]=[$p['model'],SQLSRV_PARAM_IN]; }
if (!empty($p['il']))          { $where[]="ILI_1 = ?";            $params[]=[$p['il'],SQLSRV_PARAM_IN]; }

$sql="SELECT CARIKODU,TICARI_UNVANI,GRUBU,ARA_GRUBU,ALT_GRUBU,MARKASI,MODELI,
      ILI_1,FATURA_NO,TARIHI,STOKKODU,STOK_ADI,MIKTARI,
      DVZ_IND_FIYAT,DVZ_IND_TUTAR,IKINCI_DVZ_IND_FIYAT,IKINCI_DVZ_IND_TUTAR
      FROM TRV_SATINALMA_FATURA_RAPORU WHERE ".implode(" AND ",$where)." ORDER BY TARIHI DESC";

try {
    $rows=runQuery($sql,$params);
    $toplam=array_sum(array_column($rows,'IKINCI_DVZ_IND_TUTAR'));
    echo json_encode(['rows'=>$rows,'kpi'=>['toplam'=>round($toplam,2),'sayi'=>count($rows)]],JSON_UNESCAPED_UNICODE);
} catch(Exception $e){ http_response_code(500); echo json_encode(['error'=>$e->getMessage()]); }
