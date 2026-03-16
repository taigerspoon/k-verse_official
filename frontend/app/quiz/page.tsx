export default function QuizPage() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1F4E79" }}>TOPIK 트레이너</h1>
          <span style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "4px 12px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>3급</span>
        </div>

        {/* 문제 카드 */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <p style={{ color: "#2E75B6", fontSize: "14px", marginBottom: "16px" }}>문제 1 / 10</p>
          <p style={{ fontSize: "20px", color: "#1A1A2E", lineHeight: 1.6, marginBottom: "32px" }}>
            다음 빈칸에 들어갈 말로 가장 알맞은 것을 고르십시오.<br />
            <br />
            나는 매일 아침 운동을 ( ) 건강이 많이 좋아졌다.
          </p>

          {/* 선택지 */}
          {["① 하면서", "② 하거나", "③ 하더니", "④ 하도록"].map((option, i) => (
            <div key={i} style={{ border: "1px solid #E0E0E0", borderRadius: "8px", padding: "16px 20px", marginBottom: "12px", cursor: "pointer", fontSize: "16px", color: "#1A1A2E" }}>
              {option}
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button style={{ width: "100%", backgroundColor: "#1F4E79", color: "white", padding: "16px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          다음 문제 →
        </button>

      </div>
    </main>
  );
}