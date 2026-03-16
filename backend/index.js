const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'K-Verse 백엔드 서버 작동 중! 🎉' });
});

app.listen(PORT, () => {
  console.log(`서버 시작! http://localhost:${PORT}`);
});