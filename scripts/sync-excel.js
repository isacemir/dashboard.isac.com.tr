const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = path.join(__dirname, '../dashboard-excel');
const JSON_DIR = path.join(__dirname, '../public/data');

if (!fs.existsSync(JSON_DIR)) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

const files = [
  { name: 'satis-raporu.xlsx', target: 'satis' },
  { name: 'siparis-raporu.xlsx', target: 'siparis' },
  { name: 'teklif-raporu.xlsx', target: 'teklif' },
  { name: 'SATINALMA-TEKLIF.xlsx', target: 'satinalma_teklif' },
  { name: 'satınalma-fatura-raporu.xlsx', target: 'satinalma_fatura' },
  { name: 'stok-sipariş-raporu.xlsx', target: 'stok' },
  { name: 'crm.xlsx', target: 'crm' }
];

// Excel serial number → "YYYY-MM-DD HH:MM" string
function excelDateToStr(serial) {
  if (!serial || typeof serial !== 'number') return serial;
  // Excel epoch: Dec 30, 1899
  const ms = (serial - 25569) * 86400 * 1000;
  const d = new Date(ms);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

// Helper for group and sum (similar to the one in components.jsx)
function groupSum(rows, keyFn, valFn) {
  const m = {};
  rows.forEach(r => {
    const k = keyFn(r);
    if (!k) return;
    m[k] = (m[k] || 0) + (valFn(r) || 0);
  });
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([name, val]) => ({ name, val }));
}

function processFile(file) {
  const filePath = path.join(EXCEL_DIR, file.name);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file.name}`);
    return;
  }

  console.log(`Processing ${file.name}...`);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

  // Basic KPI calculation
  let kpi = { sayi: rows.length };
  let charts = {};

  if (file.target === 'satis') {
    kpi.toplam = rows.reduce((s, r) => s + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0);
    kpi.iptal = rows.filter(r => r.IPTAL == 1 || r.IPTAL == "1").reduce((s, r) => s + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0);
    kpi.teslim = kpi.toplam - kpi.iptal;
    kpi.kalan = 0;
    
    // Trend for SALES (by Month) - Safety for numeric dates
    charts.trend = groupSum(rows, r => String(r.TARIHI || "").slice(0, 7), r => parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0).sort((a,b)=>a.name.localeCompare(b.name));
    charts.bolge = groupSum(rows, r => r.GRUBU, r => parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0).slice(0, 7);
  } else if (file.target === 'siparis') {
    kpi.teslim = rows.reduce((s, r) => s + (parseFloat(r.TESLIM_EUR_TUTAR) || 0), 0);
    kpi.kalan = rows.reduce((s, r) => s + (parseFloat(r.KALAN_EUR_TUTAR) || 0), 0);
    kpi.iptal = 0; // No explicit iptal tutar found
    kpi.toplam = rows.reduce((s, r) => s + (parseFloat(r.DVZ_IND_TUTAR) || 0), 0);
    
    charts.trend = groupSum(rows, r => String(r.TARIHI || "").slice(0, 7), r => parseFloat(r.DVZ_IND_TUTAR) || 0).sort((a,b)=>a.name.localeCompare(b.name));
    charts.bolge = groupSum(rows, r => r.GRUBU, r => parseFloat(r.DVZ_IND_TUTAR) || 0).slice(0, 7);
  } else if (file.target === 'teklif' || file.target === 'satinalma_teklif') {
    const tutar = (r) => (parseFloat(r.DVZ_IND_TUTAR) || 0);
    kpi.toplam = rows.reduce((sum, r) => sum + tutar(r), 0);
    kpi.acik = rows.filter(r => r.TEKLIF_DURUMU === 'Teklifte' || r.TEKLIF_DURUMU === 'Açık').length;
    kpi.kapali = rows.filter(r => r.TEKLIF_DURUMU === 'Onaylandı' || r.TEKLIF_DURUMU === 'Siparişe Aktarıldı' || r.TEKLIF_DURUMU === 'Sipariş Aktarıldı').length;

    // Chart Data
    charts.durum = [
      { name: "Açık", val: kpi.acik },
      { name: "Kapalı", val: kpi.kapali },
      { name: "İptal", val: rows.filter(r => r.TEKLIF_DURUMU === 'İptal').length }
    ];
    charts.marka = groupSum(rows, r => r.MARKASI, tutar).slice(0, 7);
  } else if (file.target === 'crm') {
    // Sadece CARIKODU dolu olan gerçek müşteri kayıtlarını al
    const filtered = rows.filter(r => r.CARIKODU);
    rows.length = 0;
    filtered.forEach(r => rows.push(r));

    // Tarih sütunlarını Excel serial'dan string'e çevir
    rows.forEach(r => {
      if (r.BASLAMA)              r.BASLAMA              = excelDateToStr(r.BASLAMA);
      if (r.BITIS)                r.BITIS                = excelDateToStr(r.BITIS);
      if (r.EV_KAYIT_TARIHI)      r.EV_KAYIT_TARIHI      = excelDateToStr(r.EV_KAYIT_TARIHI);
      if (r.EV_DEGISTIRME_TARIHI) r.EV_DEGISTIRME_TARIHI = excelDateToStr(r.EV_DEGISTIRME_TARIHI);
    });
    kpi.sayi = rows.length; // filtrelenmiş sayı
    kpi.yapildi = rows.filter(r => r.DURUMU === 'Yapıldı' || r.DURUMU === 'Tamamlandı').length;
    kpi.yapilacak = rows.filter(r => r.DURUMU === 'Yapılacak').length;
    kpi.firsat = rows.filter(r => !!r.FIRSATADI).length;

    charts.aktivite = groupSum(rows, r => r.TIPI, r => 1).slice(0, 7);
  } else if (file.target === 'stok') {
    kpi.stokta = rows.filter(r => (parseFloat(r.STOK_MIKTARI) || 0) > 0).length;
    kpi.kritik = rows.filter(r => ["KRİTİK STOK", "SIFIR BAKİYE - SATIN ALMA YOK"].includes(r.DURUM || "")).length;
    kpi.siparisteVarStokYok = rows.filter(r => (parseFloat(r.SIPARIS_KALAN_MIKTARI) || 0) > 0 && (parseFloat(r.STOK_MIKTARI) || 0) <= 0).length;
    
    charts.kategori = groupSum(rows, r => r.ALT_GRUBU, r => 1).slice(0, 7);
    charts.durum = groupSum(rows, r => r.DURUM, r => 1);
    charts.marka = groupSum(rows, r => r.MARKASI, r => (parseFloat(r.SIPARIS_KALAN_MIKTARI) || 0)).slice(0, 7);
  } else if (file.target === 'satinalma_fatura') {
    kpi.toplam = rows.reduce((sum, r) => sum + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0);
    
    charts.ciro = groupSum(rows, r => `${r.YIL || ""}-${String(r.AY || "").padStart(2, "0")}`, r => (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0)).sort((a,b) => a.name.localeCompare(b.name));
    charts.marka = groupSum(rows, r => r.MARKASI, r => (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0)).slice(0, 7);
  }

  // Save Summary (KPIs + Chart Data)
  const summary = { kpi, charts, lastSync: new Date().toISOString() };
  fs.writeFileSync(path.join(JSON_DIR, `${file.target}_summary.json`), JSON.stringify(summary, null, 2));
  
  // Save Rows (Full Data)
  fs.writeFileSync(path.join(JSON_DIR, `${file.target}_rows.json`), JSON.stringify({ rows }, null, 0)); // No pretty print for rows to save space

  console.log(`Saved summary and rows for ${file.target}`);
}

files.forEach(processFile);
console.log('Sync complete.');
