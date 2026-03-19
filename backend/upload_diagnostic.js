require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const IMAGE_BASE = 'https://lhrkgujebjuljpbnuzxk.supabase.co/storage/v1/object/public/question-images/96/';

const SUBTYPE_MAP = {
  1: '빈칸_초급',
  2: '빈칸_중급',
  3: '유사표현',
  4: '주제찾기_광고표어',
  5: '주제찾기_광고표어',
  6: '주제찾기_신문기사',
  7: '주제찾기_글',
  8: '내용일치_글',
  9: '내용일치_그림',
  10: '순서배열_4문장',
};

const LEVEL_MAP = {
  1: 3, 2: 3, 3: 3, 5: 3, 9: 3,
  4: 4, 6: 4, 7: 4, 8: 4, 10: 4,
};

const IMAGE_MAP = {
  5: IMAGE_BASE + 'q_005.png',
  9: IMAGE_BASE + 'q_009.png',
};

async function upload() {
  const wb = XLSX.readFile('TOPIK_진단평가_2024_96차.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`읽은 행 수: ${rows.length}`);
  console.log('컬럼 목록:', Object.keys(rows[0]));

  const questions = rows.map((row, index) => {
    const num = index + 1;
    return {
      question_type: '읽기',
      question_subtype: SUBTYPE_MAP[num],
      question_text: row['question_text'] || row['문제'] || null,
      option_1: row['option_1'] || row['보기1'] || null,
      option_2: row['option_2'] || row['보기2'] || null,
      option_3: row['option_3'] || row['보기3'] || null,
      option_4: row['option_4'] || row['보기4'] || null,
      correct_answer: row['correct_answer'] || row['정답'] || null,
      explanation_vi: row['explanation_vi'] || row['베트남어해설'] || null,
      passage: row['passage'] || row['지문'] || null,
      image_url: IMAGE_MAP[num] || null,
      level: LEVEL_MAP[num],
      is_diagnostic_fixed: true,
      is_past_exam: true,
      exam_year: 2024,
      exam_round: 96,
      audio_url: null,
    };
  });

  console.log('\n--- 업로드 전 확인 ---');
  questions.forEach((q, i) => {
    console.log(`${i+1}번: subtype=${q.question_subtype}, level=${q.level}, image=${q.image_url ? '있음' : '없음'}, passage=${q.passage ? '있음' : '없음'}`);
  });

  const { error } = await supabase.from('questions').insert(questions);
  if (error) {
    console.error('업로드 실패:', error.message);
  } else {
    console.log('\n✅ 업로드 완료!');
  }
}

upload();