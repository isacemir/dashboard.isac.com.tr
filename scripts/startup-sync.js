const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if data files exist
const dataDir = path.join(__dirname, '../public/data');
const requiredFiles = [
  'satis_summary.json',
  'siparis_summary.json', 
  'teklif_summary.json',
  'satinalma_teklif_summary.json',
  'satinalma_fatura_summary.json',
  'stok_summary.json',
  'crm_summary.json'
];

const needsSync = !fs.existsSync(dataDir) || 
  requiredFiles.some(file => !fs.existsSync(path.join(dataDir, file)));

if (needsSync) {
  console.log('🔄 Data files missing or outdated. Running sync...');
  try {
    execSync('node scripts/sync-excel.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Sync completed successfully');
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
} else {
  console.log('✅ Data files are up to date');
}
