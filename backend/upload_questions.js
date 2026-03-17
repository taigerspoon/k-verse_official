require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function readExcel(filePath) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

async function upload(filePath) {
  const rows = readExcel(filePath);
  console.log(`📂 ${filePath}: ${rows.length}개 문제`);

  const { error } = await supabase.from('questions').insert(rows);
  if (error) {
    console.error('❌ 오류:', error.message);
  } else {
    console.log('✅ 업로드 완료!');
  }
}

async function main() {
 await upload('TOPIK_2023_91차_읽기_v3.xlsx');
await upload('TOPIK_2024_96차_읽기_v3.xlsx');
}

main();