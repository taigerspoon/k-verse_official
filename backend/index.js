require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;
const client = new Anthropic();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'K-Verse 백엔드 서버 작동 중! 🎉' });
});

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