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

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 문제 목록 불러오기
  useEffect(() => {
    fetch("http://localhost:4000/questions")
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

  // 답변 제출
  const handleSubmit = async (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);

    const currentQuestion = questions[currentIndex];
    const res = await fetch("http://localhost:4000/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        selectedAnswer: optionIndex,
      }),
    });
    const data = await res.json();
    setResult(data.correct ? "correct" : "wrong");
  };

  // 다음 문제
  const handleNext = () => {
    setSelected(null);
    setResult(null);
    setCurrentIndex((prev) => prev + 1);
  };

  // AI 해설 보기
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

  // 로딩 중
  if (loading) {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#2E75B6", fontSize: "18px" }}>문제를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  // 에러
  if (error) {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#E53E3E", fontSize: "18px" }}>{error}</p>
        </div>
      </main>
    );
  }

  // 문제 다 풀었을 때
  if (currentIndex >= questions.length) {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#1F4E79", fontSize: "24px", fontWeight: "bold" }}>🎉 모든 문제를 풀었어요!</p>
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

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1F4E79" }}>TOPIK 트레이너</h1>
          <span style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "4px 12px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>{currentQuestion.level}급</span>
        </div>

        {/* 문제 카드 */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <p style={{ color: "#2E75B6", fontSize: "14px", marginBottom: "16px" }}>
            문제 {currentIndex + 1} / {questions.length}
          </p>
          <p style={{ fontSize: "20px", color: "#1A1A2E", lineHeight: 1.6, marginBottom: "32px" }}>
            {currentQuestion.question_text}
          </p>

          {/* 선택지 */}
          {options.map((option, i) => {
            let borderColor = "#E0E0E0";
            let bgColor = "white";
            if (selected !== null) {
              if (i + 1 === currentQuestion.correct_answer) {
                borderColor = "#2E7D32";
                bgColor = "#E5F5E5";
              } else if (i + 1 === selected) {
                borderColor = "#E53E3E";
                bgColor = "#FFE5E5";
              }
            }
            return (
              <div
                key={i}
                onClick={() => handleSubmit(i + 1)}
                style={{
                  border: `1px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  borderRadius: "8px",
                  padding: "16px 20px",
                  marginBottom: "12px",
                  cursor: selected !== null ? "default" : "pointer",
                  fontSize: "16px",
                  color: "#1A1A2E",
                }}
              >
                {`${["①", "②", "③", "④"][i]} ${option}`}
              </div>
            );
          })}
        </div>

        {/* 정오 결과 */}
        {result && (
          <div style={{
            backgroundColor: result === "correct" ? "#E5F5E5" : "#FFE5E5",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: result === "correct" ? "#2E7D32" : "#E53E3E",
            fontWeight: "bold",
            fontSize: "16px",
          }}>
            {result === "correct" ? "✅ 정답이에요!" : "❌ 틀렸어요!"}
          </div>
        )}

        {/* 버튼 영역 */}
        {selected !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* 오답일 때만 AI 해설 보기 버튼 표시 */}
            {result === "wrong" && (
              <Button variant="golden" onClick={handleExplain} className="w-full">
                🤖 AI 해설 보기
              </Button>
            )}
            <button
              onClick={handleNext}
              style={{ width: "100%", backgroundColor: "#1F4E79", color: "white", padding: "16px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              다음 문제 →
            </button>
          </div>
        )}

      </div>
    </main>
  );
}