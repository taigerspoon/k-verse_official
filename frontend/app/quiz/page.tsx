"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

type Question = {
  id: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_answer: number;
  level: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("문제를 불러오지 못했어요. 백엔드 서버를 확인해주세요.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);

    const currentQuestion = questions[currentIndex];
    const res = await fetch(`${API_URL}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        question_id: currentQuestion.id,
        selected_answer: optionIndex,
      }),
    });
    const data = await res.json();
    const isCorrect = data.is_correct;
    setResult(isCorrect ? "correct" : "wrong");
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));

    setTimeout(() => setShowResult(true), 300);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelected(null);
    setResult(null);
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleExplain = () => {
    const currentQuestion = questions[currentIndex];
    const options = [
      currentQuestion.option_1,
      currentQuestion.option_2,
      currentQuestion.option_3,
      currentQuestion.option_4,
    ];
    const wrongAnswer = selected !== null ? options[selected - 1] : "";
    const correctAnswer = options[currentQuestion.correct_answer - 1];
    const params = new URLSearchParams({
      question: currentQuestion.question_text,
      wrongAnswer,
      correctAnswer,
    });
    router.push(`/explain?${params.toString()}`);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setResult(null);
    setScore({ correct: 0, wrong: 0 });
    setFinished(false);
    setShowResult(false);
  };

  if (loading) {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#2E75B6", fontSize: "18px" }}>문제를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#E53E3E", fontSize: "18px" }}>{error}</p>
        </div>
      </main>
    );
  }

  if (finished) {
    const total = questions.length;
    const percentage = Math.round((score.correct / total) * 100);
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", paddingTop: "60px" }}>

          <div style={{ fontSize: "64px", marginBottom: "24px" }}>
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "👏" : "💪"}
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "8px" }}>
            퀴즈 완료!
          </h2>
          <p style={{ color: "#666", fontSize: "16px", marginBottom: "40px" }}>
            {total}문제를 모두 풀었어요
          </p>

          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "32px" }}>
            <div style={{ marginBottom: "32px" }}>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>총 점수</p>
              <p style={{ fontSize: "64px", fontWeight: "bold", color: "#F5C518", lineHeight: 1 }}>{percentage}%</p>
            </div>

            <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
              <div style={{ flex: 1, backgroundColor: "#F0FFF4", borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2E7D32" }}>{score.correct}</p>
                <p style={{ color: "#2E7D32", fontSize: "14px", fontWeight: "bold" }}>✅ 정답</p>
              </div>
              <div style={{ flex: 1, backgroundColor: "#FFF5F5", borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#E53E3E" }}>{score.wrong}</p>
                <p style={{ color: "#E53E3E", fontSize: "14px", fontWeight: "bold" }}>❌ 오답</p>
              </div>
            </div>

            <p style={{ color: "#666", fontSize: "15px", marginTop: "24px", lineHeight: 1.6 }}>
              {percentage >= 80
                ? "🎉 훌륭해요! TOPIK 합격이 가까워지고 있어요!"
                : percentage >= 60
                ? "👍 잘 하고 있어요! 조금만 더 연습하면 완벽해요!"
                : "💪 괜찮아요! 다시 풀면서 실력을 올려봐요!"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleRestart}
              style={{ flex: 1, backgroundColor: "#F5C518", color: "#1A1A2E", padding: "16px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              🔄 다시 풀기
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ flex: 1, backgroundColor: "white", color: "#1F4E79", padding: "16px", borderRadius: "8px", border: "1.5px solid #1F4E79", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              🏠 대시보드로
            </button>
          </div>

        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = [
    currentQuestion.option_1,
    currentQuestion.option_2,
    currentQuestion.option_3,
    currentQuestion.option_4,
  ];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <div className="quiz-container" style={{ maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1F4E79" }}>TOPIK 트레이너</h1>
          <span style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "4px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold" }}>
            {currentQuestion.level}급
          </span>
        </div>

        <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#666", fontSize: "13px" }}>문제 {currentIndex + 1} / {questions.length}</span>
          <span style={{ color: "#666", fontSize: "13px" }}>정답 {score.correct}개</span>
        </div>
        <div style={{ backgroundColor: "#E0E0E0", borderRadius: "4px", height: "6px", marginBottom: "32px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            borderRadius: "4px",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #1F4E79, #F5C518)",
            transition: "width 0.4s ease",
          }} />
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <p className="quiz-question" style={{ color: "#1A1A2E", lineHeight: 1.7, marginBottom: "28px", fontWeight: "500" }}>
            {currentQuestion.question_text}
          </p>

          {options.map((option, i) => {
            const optionNum = i + 1;
            const isCorrect = optionNum === currentQuestion.correct_answer;
            const isWrong = selected === optionNum && !isCorrect;

            let bgColor = "white";
            let borderColor = "#E8E8E8";
            let textColor = "#1A1A2E";
            let icon = null;

            if (selected !== null) {
              if (isCorrect) {
                bgColor = "#F0FFF4";
                borderColor = "#2E7D32";
                textColor = "#2E7D32";
                icon = "✓";
              } else if (isWrong) {
                bgColor = "#FFF5F5";
                borderColor = "#E53E3E";
                textColor = "#E53E3E";
                icon = "✗";
              }
            }

            return (
              <div
                key={i}
                className="quiz-option"
                onClick={() => handleSubmit(optionNum)}
                style={{
                  border: `1.5px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  borderRadius: "8px",
                  padding: "14px 20px",
                  marginBottom: "10px",
                  cursor: selected !== null ? "default" : "pointer",
                  fontSize: "15px",
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                  fontWeight: isCorrect && selected !== null ? "bold" : "normal",
                }}
                onMouseEnter={(e) => {
                  if (selected !== null) return;
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F0F4FF";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#2E75B6";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  if (selected !== null) return;
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "white";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#E8E8E8";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <span>{`${["①", "②", "③", "④"][i]} ${option}`}</span>
                {icon && <span style={{ fontWeight: "bold", fontSize: "16px" }}>{icon}</span>}
              </div>
            );
          })}
        </div>

        {showResult && result && (
          <div style={{
            backgroundColor: result === "correct" ? "#F0FFF4" : "#FFF5F5",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "16px",
            border: `1px solid ${result === "correct" ? "#C6F6D5" : "#FED7D7"}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "fadeIn 0.3s ease",
          }}>
            <span style={{ fontSize: "24px" }}>{result === "correct" ? "✅" : "❌"}</span>
            <div>
              <p style={{ fontWeight: "bold", color: result === "correct" ? "#2E7D32" : "#E53E3E", fontSize: "16px" }}>
                {result === "correct" ? "정답입니다!" : "틀렸습니다!"}
              </p>
              <p style={{ color: "#666", fontSize: "13px", marginTop: "2px" }}>
                {result === "correct" ? "훌륭해요! 계속 도전하세요 🎉" : "다음엔 꼭 맞출 수 있어요 💪"}
              </p>
            </div>
          </div>
        )}

        {selected !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {result === "wrong" && (
              <Button variant="golden" onClick={handleExplain} className="w-full">
                🤖 AI 해설 보기
              </Button>
            )}
            <button
              onClick={handleNext}
              style={{ width: "100%", backgroundColor: "#1F4E79", color: "white", padding: "15px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              {currentIndex + 1 >= questions.length ? "결과 보기 →" : "다음 문제 →"}
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  );
}