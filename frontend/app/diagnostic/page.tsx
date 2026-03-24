"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://k-verse-production.up.railway.app";

type Question = {
  id: number;
  question_subtype: string;
  question_type: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  image_url: string | null;
  passage: string | null;
  level: number;
};

type Answer = {
  question_id: number;
  selected_answer: number;
};

export default function DiagnosticPage() {
  const router = useRouter();

  const [stage, setStage] = useState<"start" | "quiz" | "submitting">("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/diagnostic/questions`);
      if (!res.ok) throw new Error("API 오류");
      const data = await res.json();
      setQuestions(data.questions || []);
      setStage("quiz");
    } catch {
      setError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (optionNum: number) => {
    setSelected(optionNum);
    setShowNext(true);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const currentQuestion = questions[currentIndex];
    const newAnswers = [...answers, { question_id: currentQuestion.id, selected_answer: selected }];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= questions.length) {
      setStage("submitting");
      try {
        const res = await fetch(`${API_URL}/diagnostic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, answers: newAnswers }),
        });
        if (!res.ok) throw new Error("제출 오류");
        const result = await res.json();
        sessionStorage.setItem("diagnosticResult", JSON.stringify(result));
        router.push("/diagnostic/result");
      } catch {
        setError("결과 제출 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
        setStage("quiz");
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowNext(false);
  };

  if (stage === "start") {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "56px 48px", maxWidth: "480px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "24px" }}>📋</div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1F4E79", marginBottom: "16px" }}>
            K-Verse 레벨 진단
          </h1>
          <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
            <p style={{ color: "#2E75B6", fontSize: "16px", marginBottom: "8px", fontWeight: "bold" }}>
              📖 읽기 10문항 &nbsp;|&nbsp; ⏱ 약 5~8분 소요
            </p>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6 }}>
              풀이 중 정답 / 해설은 표시되지 않습니다
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: "#FFF5F5", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", border: "1px solid #FED7D7" }}>
              <p style={{ color: "#E53E3E", fontSize: "14px" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            style={{ width: "100%", backgroundColor: "#F5C518", color: "#1A1A2E", padding: "18px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "문제 불러오는 중..." : "진단 시작하기 →"}
          </button>
        </div>
      </main>
    );
  }

  if (stage === "submitting") {
    return (
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>⏳</div>
          <p style={{ color: "#1F4E79", fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>결과 분석 중...</p>
          <p style={{ color: "#666", fontSize: "15px" }}>잠시만 기다려주세요</p>
        </div>
      </main>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const options = [currentQuestion.option_1, currentQuestion.option_2, currentQuestion.option_3, currentQuestion.option_4];
  const progress = ((currentIndex) / questions.length) * 100;
  const isLast = currentIndex + 1 >= questions.length;

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>

        {/* 상단 진행 표시 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1F4E79" }}>K-Verse 레벨 진단</h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ color: "#666", fontSize: "13px" }}>문제 {currentIndex + 1} / {questions.length}</span>
        </div>

        {/* 프로그레스 바 */}
        <div style={{ backgroundColor: "#E0E0E0", borderRadius: "4px", height: "6px", marginBottom: "32px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            borderRadius: "4px",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #1F4E79, #F5C518)",
            transition: "width 0.4s ease",
          }} />
        </div>

        {/* 문제 카드 */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
        
          {/* 문제 텍스트 */}
          <p style={{ color: "#1A1A2E", lineHeight: 1.7, marginBottom: "28px", fontWeight: "500", fontSize: "16px" }}
            dangerouslySetInnerHTML={{ __html: currentQuestion.question_text?.replace(/\n/g, '<br>') ?? '' }}
          />

          {/* 지문 (passage) */}
          {currentQuestion.passage && (
            <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", padding: "20px", marginBottom: "24px", border: "1.5px solid #1F4E79" }}>
              <p style={{ color: "#444", fontSize: "15px", lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: currentQuestion.passage?.replace(/\n/g, '<br>') ?? '' }}
              />
            </div>
          )}

          {/* 이미지 */}
          {currentQuestion.image_url && (
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentQuestion.image_url} alt="문제 이미지" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            </div>
          )}

          {/* 선택지 */}
          {options.map((option, i) => {
            const optionNum = i + 1;
            const isSelected = selected === optionNum;

            let bgColor = "white";
            let borderColor = "#E8E8E8";
            let textColor = "#1A1A2E";

            if (isSelected) {
              bgColor = "#EFF6FF";
              borderColor = "#1F4E79";
              textColor = "#1F4E79";
            }

            return (
              <div
                key={i}
                onClick={() => handleSelect(optionNum)}
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
                  fontWeight: isSelected ? "bold" : "normal",
                }}
                onMouseEnter={(e) => {
                  if (selected !== null) return;
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F0F4FF";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#2E75B6";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  if (selected !== null) {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    return;
                  }
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "white";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#E8E8E8";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: `${["①", "②", "③", "④"][i]} ${option?.replace(/\n/g, '<br>') ?? ''}` }} />
                {isSelected && <span style={{ fontSize: "16px" }}>✔</span>}
              </div>
            );
          })}
        </div>

        {/* 다음 문제 / 결과 보기 버튼 */}
        {showNext && (
          <button
            onClick={handleNext}
            style={{ width: "100%", backgroundColor: "#1F4E79", color: "white", padding: "15px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
          >
            {isLast ? "결과 보기 →" : "다음 문제 →"}
          </button>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div style={{ backgroundColor: "#FFF5F5", borderRadius: "8px", padding: "12px 16px", marginTop: "16px", border: "1px solid #FED7D7" }}>
            <p style={{ color: "#E53E3E", fontSize: "14px" }}>{error}</p>
          </div>
        )}

      </div>
    </main>
  );
}