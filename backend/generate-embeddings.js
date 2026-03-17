require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function generateEmbeddings() {
  // 1. embedding이 없는 문제 전체 가져오기
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text')
    .is('embedding', null);

  if (error) {
    console.error('❌ 문제 조회 오류:', error.message);
    return;
  }

  console.log(`📚 임베딩 생성할 문제 수: ${questions.length}개`);

  // 2. 각 문제 임베딩 생성 및 업데이트
  for (const question of questions) {
    const { data, error: embedError } = await supabase.functions.invoke(
      'ai/embed',
      {
        body: {
          input: question.question_text,
          model: 'gte-small'
        }
      }
    );

    if (embedError) {
      console.error(`❌ 문제 ${question.id} 임베딩 오류:`, embedError.message);
      continue;
    }

    const { error: updateError } = await supabase
      .from('questions')
      .update({ embedding: data.embedding })
      .eq('id', question.id);

    if (updateError) {
      console.error(`❌ 문제 ${question.id} 업데이트 오류:`, updateError.message);
    } else {
      console.log(`✅ 문제 ${question.id} 임베딩 완료`);
    }
  }

  console.log('🎉 전체 임베딩 생성 완료!');
}

generateEmbeddings();