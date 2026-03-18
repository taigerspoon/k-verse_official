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

// 문제 전체 목록 (레벨 필터링 가능)
app.get('/questions', async (req, res) => {
  const { level } = req.query;
  let query = supabase.from('questions').select('*');
  if (level) query = query.eq('level', parseInt(level));
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 유저 레벨에 맞는 문제 반환
app.get('/questions/user/:user_id', async (req, res) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('level')
    .eq('id', req.params.user_id)
    .single();
  if (userError) return res.status(500).json({ error: userError.message });
  if (!user) return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', user.level);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ level: user.level, questions: data });
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
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('correct_answer')
    .eq('id', question_id)
    .single();
  if (qError) return res.status(500).json({ error: qError.message });
  const is_correct = selected_answer === question.correct_answer;
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

// 난이도 순서대로 정렬된 읽기 유형 9가지
const READING_SUBTYPES_ORDERED = [
  '빈칸 채우기 (단문)',
  '글의 목적 파악',
  '내용 일치 확인',
  '유사 표현 찾기',
  '빈칸 채우기 (장문)',
  '신문 기사 제목 해석',
  '문단 순서 배열',
  '주제·중심 내용 고르기',
  '문장 삽입 위치 찾기',
];

// 급수 판정 (9문항 기준)
function determineLevel(correctCount, total) {
  const ratio = correctCount / total;
  if (ratio >= 1.0)  return 6; // 9/9
  if (ratio >= 0.67) return 5; // 7~8/9
  if (ratio >= 0.50) return 4; // 5~6/9
  if (ratio >= 0.30) return 3; // 3~4/9
  return 0;                    // 0~2/9 입문
}

// GET /diagnostic/questions
// 읽기 9가지 유형별 1문항씩, 난이도 순 반환
app.get('/diagnostic/questions', async (req, res) => {
  try {
    const questions = [];
    for (const subtype of READING_SUBTYPES_ORDERED) {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_subtype, question_type, question_text, option_1, option_2, option_3, option_4, level')
        .eq('question_type', '읽기')
        .eq('question_subtype', subtype)
        .limit(1)
        .single();

      if (error || !data) {
        questions.push({
          id: null,
          question_subtype: subtype,
          question_type: '읽기',
          question_text: null,
          option_1: null,
          option_2: null,
          option_3: null,
          option_4: null,
          image_url: null,
          passage: null,
          level: null,
        });
      } else {
        questions.push({
          id: data.id,
          question_subtype: data.question_subtype,
          question_type: data.question_type,
          question_text: data.question_text,
          option_1: data.option_1,
          option_2: data.option_2,
          option_3: data.option_3,
          option_4: data.option_4,
          image_url: null,
          passage: null,
          level: data.level,
        });
      }
    }
    res.json({ questions });
  } catch (err) {
    console.error('GET /diagnostic/questions error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /diagnostic
// body: { user_id, answers: [{question_id, selected_answer}, ...] }
app.post('/diagnostic', async (req, res) => {
  try {
    const { user_id, answers } = req.body;
    if (!user_id || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'user_id와 answers 배열이 필요합니다.' });
    }

    const questionIds = answers.map(a => a.question_id);
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, correct_answer, question_subtype')
      .in('id', questionIds);
    if (qError) return res.status(500).json({ error: qError.message });

    const questionMap = {};
    questions.forEach(q => {
      questionMap[q.id] = { correct_answer: q.correct_answer, question_subtype: q.question_subtype };
    });

    // 유형 순서대로 정렬 후 채점
    const sortedAnswers = [...answers].sort((a, b) => {
      const idxA = READING_SUBTYPES_ORDERED.indexOf(questionMap[a.question_id]?.question_subtype || '');
      const idxB = READING_SUBTYPES_ORDERED.indexOf(questionMap[b.question_id]?.question_subtype || '');
      return idxA - idxB;
    });

    let correct_count = 0;
    const subtype_results = [];
    const wrong_subtypes = [];
    const userAnswersToInsert = [];

    for (const answer of sortedAnswers) {
      const qInfo = questionMap[answer.question_id];
      if (!qInfo) continue;
      const is_correct = answer.selected_answer === qInfo.correct_answer;
      if (is_correct) correct_count++;
      else wrong_subtypes.push(qInfo.question_subtype);
      subtype_results.push({ question_subtype: qInfo.question_subtype, is_correct });
      userAnswersToInsert.push({ user_id, question_id: answer.question_id, selected_answer: answer.selected_answer, is_correct });
    }

    const total_count = subtype_results.length;
    const predicted_level = determineLevel(correct_count, total_count);
    const weak_subtypes = wrong_subtypes.slice(0, 3);

    // user_answers 저장
    const { error: insertError } = await supabase.from('user_answers').insert(userAnswersToInsert);
    if (insertError) console.error('user_answers insert error:', insertError);

    // users 레벨 업데이트
    const { error: updateError } = await supabase.from('users').update({ level: predicted_level }).eq('id', user_id);
    if (updateError) console.error('users level update error:', updateError);

    res.json({ user_id, predicted_level, correct_count, total_count, subtype_results, weak_subtypes });
  } catch (err) {
    console.error('POST /diagnostic error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});
