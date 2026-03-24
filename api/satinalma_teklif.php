<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__."/config.php";
authGuard();

[$bas,$bit]=getDateRange();
$p=$_GET;

$acik  =['Onaylandı','Teklifte'];
$kapali=['Arşiv','Fiyattan Dolayı Kaybedildi','Kaybedildi','Muhasebelendi','Mükerrer','Revize edildi','Sipariş Aktarıldı','Siparişe Aktarıldı'];

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
if (!empty($p['teklif_turu'])){ $where[]="TEKLIF_TURU = ?";     $params[]=[$p['teklif_turu'],SQLSRV_PARAM_IN]; }

$td=$p['teklif_durumu']??'';
if ($td==='acik')   { $ph=implode(',',array_fill(0,count($acik),'?'));   $where[]="TEKLIF_DURUMU IN ($ph)"; foreach($acik   as $d) $params[]=[$d,SQLSRV_PARAM_IN]; }
elseif($td==='kapali'){ $ph=implode(',',array_fill(0,count($kapali),'?')); $where[]="TEKLIF_DURUMU IN ($ph)"; foreach($kapali as $d) $params[]=[$d,SQLSRV_PARAM_IN]; }
elseif($td==='iptal') { $where[]="TEKLIF_DURUMU = ?"; $params[]=['İptal',SQLSRV_PARAM_IN]; }

$sql="SELECT CARIKODU,TICARI_UNVANI,ADI_SOYADI,VERGI_NO,ILI,ILCESI,GRUBU,ARA_GRUBU,ALT_GRUBU,
      TEKLIF_NO,TARIHI,BIRIMI,TEKLIF_DURUMU,STOKKODU,STOK_ADI,MIKTARI,
      DVZ_IND_FIYAT,DVZ_IND_TUTAR,DOVIZ_BIRIMI,EUR_FIYAT,DEPO_ADI,DOVIZ_SATIS,MARKASI,MODELI,TEKLIF_TURU
      FROM TRV_SATINALMA_TEKLIF_RAPORU WHERE ".implode(" AND ",$where)." ORDER BY TARIHI DESC";

try {
    $rows=runQuery($sql,$params);
    $toplam=array_sum(array_column($rows,'DVZ_IND_TUTAR'));
    $acikS =count(array_filter($rows,fn($r)=>in_array($r['TEKLIF_DURUMU']??'',$acik)));
    $kapS  =count(array_filter($rows,fn($r)=>in_array($r['TEKLIF_DURUMU']??'',$kapali)));
    echo json_encode(['rows'=>$rows,'kpi'=>['toplam'=>round($toplam,2),'sayi'=>count($rows),'acik'=>$acikS,'kapali'=>$kapS]],JSON_UNESCAPED_UNICODE);
} catch(Exception $e){ http_response_code(500); echo json_encode(['error'=>$e->getMessage()]); }
