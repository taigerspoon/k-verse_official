require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;
const client = new Anthropic();

// Supabase 연결
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

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

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});