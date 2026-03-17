"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function ExplainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = searchParams.get("question") || "나는 매일 아침 운동을 ( ) 건강이 많이 좋아졌다.";
  const wrongAnswer = searchParams.get("wrongAnswer") || "하거나";
  const correctAnswer = searchParams.get("correctAnswer") || "하더니";
  const currentIndex = parseInt(searchParams.get("currentIndex") || "0");

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const res = await fetch(`${API_URL}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, wrongAnswer, correctAnswer }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch {
      setError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    router.push(`/quiz?startIndex=${nextIndex}`);
  };

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <div className="explain-container" style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>Explain AI</h1>
          <p style={{ color: "#2E75B6" }}>틀린 문제를 베트남어로 설명해드려요</p>
        </div>

        {/* 틀린 문제 카드 */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px", borderLeft: "4px solid #E53E3E" }}>
          <p style={{ color: "#E53E3E", fontSize: "13px", fontWeight: "bold", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>❌ 틀린 문제</p>
          <p style={{ fontSize: "16px", color: "#1A1A2E", lineHeight: 1.7, marginBottom: "20px" }}>
            {question}
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "140px", backgroundColor: "#FFF5F5", borderRadius: "8px", padding: "12px 16px", border: "1px solid #FED7D7" }}>
              <p style={{ color: "#999", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>내가 선택한 답</p>
              <p style={{ color: "#E53E3E", fontSize: "15px", fontWeight: "bold" }}>✗ {wrongAnswer}</p>
            </div>
            <div style={{ flex: 1, minWidth: "140px", backgroundColor: "#F0FFF4", borderRadius: "8px", padding: "12px 16px", border: "1px solid #C6F6D5" }}>
              <p style={{ color: "#999", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>정답</p>
              <p style={{ color: "#2E7D32", fontSize: "15px", fontWeight: "bold" }}>✓ {correctAnswer}</p>
            </div>
          </div>
        </div>

        {/* AI 설명 요청 버튼 */}
        {!explanation && !loading && (
          <button
            onClick={handleExplain}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(31,78,121,0.3)",
            }}
          >
            🤖 AI 설명 받기 (Tiếng Việt)
          </button>
        )}

        {/* 로딩 스켈레톤 */}
        {loading && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#EBF4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🤖</div>
              <p style={{ color: "#1F4E79", fontWeight: "bold", fontSize: "14px" }}>AI가 설명을 생성하는 중...</p>
            </div>
            {[100, 85, 92, 70].map((width, i) => (
              <div
                key={i}
                style={{
                  height: "14px",
                  backgroundColor: "#F0F4F8",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  width: `${width}%`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div style={{ backgroundColor: "#FFF5F5", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px", border: "1px solid #FED7D7" }}>
            <p style={{ color: "#E53E3E", fontWeight: "bold", marginBottom: "4px" }}>⚠️ 오류가 발생했어요</p>
            <p style={{ color: "#E53E3E", fontSize: "14px" }}>{error}</p>
          </div>
        )}

        {/* AI 설명 결과 */}
        {explanation && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px", borderLeft: "4px solid #2E75B6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#EBF4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🤖</div>
              <div>
                <p style={{ color: "#1F4E79", fontSize: "14px", fontWeight: "bold" }}>AI 설명</p>
                <p style={{ color: "#999", fontSize: "12px" }}>Tiếng Việt</p>
              </div>
            </div>
            <p style={{ color: "#1A1A2E", lineHeight: 1.9, whiteSpace: "pre-wrap", fontSize: "15px" }}>
              {explanation}
            </p>
          </div>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            onClick={handleNextQuestion}
            style={{ flex: 1, backgroundColor: "#F5C518", color: "#1A1A2E", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}
          >
            📝 다음 문제 풀기
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ flex: 1, backgroundColor: "white", color: "#1F4E79", padding: "14px", borderRadius: "8px", border: "1.5px solid #1F4E79", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}
          >
            🏠 대시보드로
          </button>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

    </main>
  );
}

export default function ExplainPage() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
          <p style={{ color: "#2E75B6", fontSize: "18px" }}>로딩 중...</p>
        </div>
      </main>
    }>
      <ExplainContent />
    </Suspense>
  );
}