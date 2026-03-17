require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();
const PORT = 4000;
const client = new Anthropic();

// Supabase 연결
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'K-Verse 백엔드 서버 작동 중! 🎉' });
});

// 문제 전체 목록
app.get('/questions', async (req, res) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 문제 1개 상세
app.get('/questions/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Explain AI
app.post('/explain', async (req, res) => {
  const { question, wrongAnswer, correctAnswer } = req.body;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `당신은 한국어 선생님입니다. 베트남어로 설명해주세요.
문제: ${question}
학생의 오답: ${wrongAnswer}
정답: ${correctAnswer}
왜 틀렸는지, 정답이 왜 맞는지 친절하게 설명해주세요.`
      }
    ]
  });

  res.json({ explanation: message.content[0].text });
});
// 답변 제출
app.post('/answers', async (req, res) => {
  const { user_id, question_id, selected_answer } = req.body;

  // 정답 가져오기
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('correct_answer')
    .eq('id', question_id)
    .single();

  if (qError) return res.status(500).json({ error: qError.message });

  // is_correct 자동 계산
  const is_correct = selected_answer === question.correct_answer;

  // user_answers에 저장
  const { data, error } = await supabase
    .from('user_answers')
    .insert([{ user_id, question_id, selected_answer, is_correct }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, is_correct, data });
});

// 점수 조회
app.get('/scores/:user_id', async (req, res) => {
  const { data, error } = await supabase
    .from('user_answers')
    .select('is_correct')
    .eq('user_id', req.params.user_id);

  if (error) return res.status(500).json({ error: error.message });

  const total = data.length;
  const correct = data.filter(a => a.is_correct).length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 1000) / 10;

  res.json({ total, correct, accuracy });
});

// ─────────────────────────────────────────
// 진단 테스트
// ─────────────────────────────────────────

// 레벨 판정 기준 (나중에 쉽게 수정 가능)
const DIAGNOSTIC_CONFIG = {
  totalQuestions: 30,
  levels: [
    { level: '입문', min: 0,  max: 8  },
    { level: '3급',  min: 9,  max: 14 },
    { level: '4급',  min: 15, max: 20 },
    { level: '5급',  min: 21, max: 25 },
    { level: '6급',  min: 26, max: 30 },
  ]
};

function determineLevel(correctCount) {
  for (const entry of DIAGNOSTIC_CONFIG.levels) {
    if (correctCount >= entry.min && correctCount <= entry.max) {
      return entry.level;
    }
  }
  return '입문';
}

// POST /diagnostic
// body: { user_id, answers: [{question_id, selected_answer}, ...] }
app.post('/diagnostic', async (req, res) => {
  const { user_id, answers } = req.body;

  // 유효성 검사
  if (!user_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'user_id와 answers 배열이 필요합니다.' });
  }
  if (answers.length !== DIAGNOSTIC_CONFIG.totalQuestions) {
    return res.status(400).json({ error: `답변은 정확히 ${DIAGNOSTIC_CONFIG.totalQuestions}개여야 합니다.` });
  }

  // 문제 정답 가져오기
  const questionIds = answers.map(a => a.question_id);
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, correct_answer')
    .in('id', questionIds);

  if (qError) return res.status(500).json({ error: qError.message });

  // 채점
  const answerMap = {};
  questions.forEach(q => { answerMap[q.id] = q.correct_answer; });

  let correctCount = 0;
  const userAnswersToInsert = answers.map(a => {
    const is_correct = a.selected_answer === answerMap[a.question_id];
    if (is_correct) correctCount++;
    return {
      user_id,
      question_id: a.question_id,
      selected_answer: a.selected_answer,
      is_correct
    };
  });

  // user_answers에 저장
  const { error: insertError } = await supabase
    .from('user_answers')
    .insert(userAnswersToInsert);

  if (insertError) return res.status(500).json({ error: insertError.message });

  // 레벨 판정
  const resultLevel = determineLevel(correctCount);

  // users 테이블 level 업데이트
  const { error: updateError } = await supabase
    .from('users')
    .update({ level: resultLevel })
    .eq('id', user_id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  // 결과 반환
  res.json({
    success: true,
    result: {
      correct: correctCount,
      total: DIAGNOSTIC_CONFIG.totalQuestions,
      percentage: Math.round((correctCount / DIAGNOSTIC_CONFIG.totalQuestions) * 100),
      level: resultLevel
    }
  });
});

// GET /diagnostic/questions
// 읽기 문제 30개 랜덤 출제
app.get('/diagnostic/questions', async (req, res) => {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, option_1, option_2, option_3, option_4, level')
    .eq('question_type', '읽기')
    .limit(100); // 풀에서 랜덤 추출

  if (error) return res.status(500).json({ error: error.message });

  // 랜덤 셔플 후 30개 추출
  const shuffled = data.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, DIAGNOSTIC_CONFIG.totalQuestions);

  res.json({ questions: selected });
});

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});