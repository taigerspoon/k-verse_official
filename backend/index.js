require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();
const PORT = 3000;
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

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});