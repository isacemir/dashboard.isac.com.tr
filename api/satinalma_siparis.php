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
if (!empty($p['il']))          { $where[]="ILI = ?";              $params[]=[$p['il'],SQLSRV_PARAM_IN]; }
if (!empty($p['siparis_turu'])){ $where[]="SIPARIS_TURU = ?";    $params[]=[$p['siparis_turu'],SQLSRV_PARAM_IN]; }

$sd=$p['siparis_durumu']??'';
if ($sd==='kapali') $where[]="TESLIM_EUR_TUTAR > 0";
elseif($sd==='iptal') $where[]="IPTAL_EUR_TUTAR > 0";
elseif($sd==='acik')  $where[]="KALAN_EUR_TUTAR > 0";

$sql="SELECT CARIKODU,TICARI_UNVANI,ADI_SOYADI,ILI,ILCESI,GRUBU,ARA_GRUBU,ALT_GRUBU,
      SIPARISI_ACAN,SIPARIS_NO,TARIHI,VADESI,BIRIMI,SIPARIS_DURUMU,TESLIM_TARIHI,
      STOKKODU,STOK_ADI,MIKTARI,MIKTARI_TESLIM,MIKTARI_IPTAL,MIKTARI_KALAN,
      DVZ_IND_FIYAT,DVZ_IND_TUTAR,DOVIZ_BIRIMI,EUR_FIYAT,
      TESLIM_EUR_TUTAR,IPTAL_EUR_TUTAR,KALAN_EUR_TUTAR,
      DEPO_ADI,DOVIZ_SATIS,STOK_BLOKE,MARKASI,MODELI,SIPARIS_TURU
      FROM TRV_SATINALMA_SIPARIS_RAPORU WHERE ".implode(" AND ",$where)." ORDER BY TARIHI DESC";

try {
    $rows=runQuery($sql,$params);
    $teslim=array_sum(array_column($rows,'TESLIM_EUR_TUTAR'));
    $iptal =array_sum(array_column($rows,'IPTAL_EUR_TUTAR'));
    $kalan =array_sum(array_column($rows,'KALAN_EUR_TUTAR'));
    echo json_encode(['rows'=>$rows,'kpi'=>['teslim'=>round($teslim,2),'iptal'=>round($iptal,2),'kalan'=>round($kalan,2),'toplam'=>round($teslim+$kalan-$iptal,2),'sayi'=>count($rows)]],JSON_UNESCAPED_UNICODE);
} catch(Exception $e){ http_response_code(500); echo json_encode(['error'=>$e->getMessage()]); }
