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

// 항목별 서브타입 매핑
const CATEGORY_MAP = {
  '빈칸': ['빈칸_초급', '빈칸_중급', '유사표현'],
  '주제': ['주제찾기_광고표어', '주제찾기_신문기사', '주제찾기_글'],
  '내용일치': ['내용일치_그림', '내용일치_글'],
  '순서배열': ['순서배열_4문장', '순서배열_문장삽입'],
};

// 약점 동률 우선순위: 빈칸 > 주제 > 내용일치 > 순서배열
const WEAK_PRIORITY = ['빈칸', '주제', '내용일치', '순서배열'];
// 강점 동률 우선순위: 순서배열 > 내용일치 > 주제 > 빈칸
const STRONG_PRIORITY = ['순서배열', '내용일치', '주제', '빈칸'];

// GET /diagnostic/questions
app.get('/diagnostic/questions', async (req, res) => {
  try {
    const allSubtypes = Object.values(CATEGORY_MAP).flat();
    const questions = [];

    for (const subtype of allSubtypes) {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_type, question_subtype, question_text, option_1, option_2, option_3, option_4, level, image_url, passage, audio_url')
        .eq('question_subtype', subtype)
        .eq('is_diagnostic_fixed', true)
        .limit(1)
        .single();

      if (error || !data) {
        questions.push({
          id: null,
          question_type: '읽기',
          question_subtype: subtype,
          question_text: null,
          option_1: null, option_2: null, option_3: null, option_4: null,
          level: null, image_url: null, passage: null, audio_url: null,
        });
      } else {
        questions.push(data);
      }
    }

    res.json({ questions });
  } catch (err) {
    console.error('GET /diagnostic/questions error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /diagnostic
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

    // 채점
    const userAnswersToInsert = [];
    const categoryCorrect = { '빈칸': 0, '주제': 0, '내용일치': 0, '순서배열': 0 };
    const categoryWrong = { '빈칸': [], '주제': [], '내용일치': [], '순서배열': [] };

    for (const answer of answers) {
      const qInfo = questionMap[answer.question_id];
      if (!qInfo) continue;
      const is_correct = answer.selected_answer === qInfo.correct_answer;
      userAnswersToInsert.push({ user_id, question_id: answer.question_id, selected_answer: answer.selected_answer, is_correct });

      for (const [category, subtypes] of Object.entries(CATEGORY_MAP)) {
        if (subtypes.includes(qInfo.question_subtype)) {
          if (is_correct) categoryCorrect[category]++;
          else categoryWrong[category].push(qInfo.question_subtype);
          break;
        }
      }
    }

    // 항목별 점수 계산
    const scores = {
      '빈칸': Math.round((categoryCorrect['빈칸'] / 3) * 100),
      '주제': Math.round((categoryCorrect['주제'] / 3) * 100),
      '내용일치': Math.round((categoryCorrect['내용일치'] / 2) * 100),
      '순서배열': Math.round((categoryCorrect['순서배열'] / 2) * 100),
    };

    const totalCorrect = Object.values(categoryCorrect).reduce((a, b) => a + b, 0);
    const totalCount = answers.length;

    // perfect 케이스
    if (totalCorrect === totalCount) {
      const { error: insertError } = await supabase.from('user_answers').insert(userAnswersToInsert);
      if (insertError) console.error('user_answers insert error:', insertError);
      return res.json({ case: 'perfect', correct_count: 10, strongest: null, weakest: null, scores, sample_question: null });
    }

    // zero 케이스
    if (totalCorrect === 0) {
      const { error: insertError } = await supabase.from('user_answers').insert(userAnswersToInsert);
      if (insertError) console.error('user_answers insert error:', insertError);
      return res.json({ case: 'zero', correct_count: 0, strongest: null, weakest: null, scores, sample_question: null });
    }

    // normal 케이스 - 강점/약점 선정
    const maxScore = Math.max(...Object.values(scores));
    const minScore = Math.min(...Object.values(scores));

    const strongest = STRONG_PRIORITY.find(c => scores[c] === maxScore);
    const weakest = WEAK_PRIORITY.find(c => scores[c] === minScore);

    // 샘플 문제 선정
    let sample_question = null;
    const wrongSubtypesInWeakest = categoryWrong[weakest];

    if (wrongSubtypesInWeakest.length > 0) {
      const randomSubtype = wrongSubtypesInWeakest[Math.floor(Math.random() * wrongSubtypesInWeakest.length)];
      const { data: sampleData } = await supabase
        .from('questions')
        .select('id, question_type, question_subtype, question_text, option_1, option_2, option_3, option_4, correct_answer, explanation_vi, image_url, passage, level')
        .eq('question_subtype', randomSubtype)
        .eq('is_diagnostic_fixed', false)
        .limit(10);

      if (sampleData && sampleData.length > 0) {
        sample_question = sampleData[Math.floor(Math.random() * sampleData.length)];
      }
    }

    if (!sample_question) {
      const weakestSubtypes = CATEGORY_MAP[weakest];
      const { data: fallbackData } = await supabase
        .from('questions')
        .select('id, question_type, question_subtype, question_text, option_1, option_2, option_3, option_4, correct_answer, explanation_vi, image_url, passage, level')
        .in('question_subtype', weakestSubtypes)
        .eq('is_diagnostic_fixed', false)
        .limit(10);

      if (fallbackData && fallbackData.length > 0) {
        sample_question = fallbackData[Math.floor(Math.random() * fallbackData.length)];
      }
    }

    // user_answers 저장
    const { error: insertError } = await supabase.from('user_answers').insert(userAnswersToInsert);
    if (insertError) console.error('user_answers insert error:', insertError);

   res.json({ case: 'normal', correct_count: totalCorrect, strongest, weakest, scores, sample_question });

  } catch (err) {
    console.error('POST /diagnostic error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});