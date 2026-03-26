const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel dosyalarının bulunduğu klasör
const excelFolder = './dashboard-excel';
// JSON çıktı klasörü
const jsonFolder = './src/data';

// JSON çıktı klasörünü oluştur
if (!fs.existsSync(jsonFolder)) {
  fs.mkdirSync(jsonFolder, { recursive: true });
}

// Excel dosyalarını işle
const excelFiles = [
  { file: 'crm.xlsx', name: 'crmData' },
  { file: 'satış-raporu.xlsx', name: 'salesReportData' },
  { file: 'siparis-raporu.xlsx', name: 'orderReportData' },
  { file: 'teklif-raporu.xlsx', name: 'offerReportData' },
  { file: 'SATINALMA-TEKLIF.xlsx', name: 'purchasingOfferData' },
  { file: 'satınalma-fatura-raporu.xlsx', name: 'purchasingInvoiceData' },
  { file: 'stok-sipariş-raporu.xlsx', name: 'stockOrderData' }
];

excelFiles.forEach(({ file, name }) => {
  try {
    const filePath = path.join(excelFolder, file);
    const workbook = XLSX.readFile(filePath);
    
    // Tüm sheet'leri al
    const sheetNames = workbook.SheetNames;
    const result = {};
    
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // İlk satırı başlık olarak kullanıp verileri formatla
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        const rows = jsonData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        result[sheetName] = {
          headers: headers,
          data: rows,
          totalRows: rows.length
        };
      }
    });
    
    // JSON dosyasını yaz
    const jsonPath = path.join(jsonFolder, `${name}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8');
    
    console.log(`✅ ${file} -> ${name}.json dönüştürüldü`);
    console.log(`   - Sheet sayısı: ${sheetNames.length}`);
    console.log(`   - Toplam satır: ${Object.values(result).reduce((sum, sheet) => sum + sheet.totalRows, 0)}`);
    
  } catch (error) {
    console.error(`❌ ${file} işlenirken hata:`, error.message);
  }
});

console.log('\n🎉 Excel\'den JSON dönüşümü tamamlandı!');
