"use client";

import { useState } from "react";

export default function ExplainPage() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 테스트용 데이터
  const testData = {
    question: "나는 매일 아침 운동을 ( ) 건강이 많이 좋아졌다.",
    wrongAnswer: "하거나",
    correctAnswer: "하더니",
  };

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const res = await fetch("http://localhost:4000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch {
      setError("AI 설명을 불러오지 못했어요. 백엔드 서버를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* 헤더 */}
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>Explain AI</h1>
        <p style={{ color: "#2E75B6", marginBottom: "40px" }}>틀린 문제를 베트남어로 설명해드려요</p>

        {/* 틀린 문제 */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <p style={{ color: "#E53E3E", fontSize: "14px", fontWeight: "bold", marginBottom: "12px" }}>❌ 틀린 문제</p>
          <p style={{ fontSize: "16px", color: "#1A1A2E", lineHeight: 1.6, marginBottom: "16px" }}>
            {testData.question}
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ backgroundColor: "#FFE5E5", color: "#E53E3E", padding: "6px 16px", borderRadius: "8px", fontSize: "14px" }}>내 답: {testData.wrongAnswer}</span>
            <span style={{ backgroundColor: "#E5F5E5", color: "#2E7D32", padding: "6px 16px", borderRadius: "8px", fontSize: "14px" }}>정답: {testData.correctAnswer}</span>
          </div>
        </div>

        {/* AI 설명 요청 버튼 */}
        {!explanation && !loading && (
          <button
            onClick={handleExplain}
            style={{ width: "100%", backgroundColor: "#1F4E79", color: "white", padding: "16px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginBottom: "24px" }}
          >
            🤖 AI 설명 받기
          </button>
        )}

        {/* 로딩 */}
        {loading && (
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px", textAlign: "center" }}>
            <p style={{ color: "#2E75B6", fontSize: "16px" }}>🤖 AI가 설명을 생성하는 중...</p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div style={{ backgroundColor: "#FFE5E5", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
            <p style={{ color: "#E53E3E" }}>{error}</p>
          </div>
        )}

        {/* AI 설명 결과 */}
        {explanation && (
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#1F4E79", fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>🤖 AI 설명 (Tiếng Việt)</p>
            <p style={{ color: "#1A1A2E", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {explanation}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}