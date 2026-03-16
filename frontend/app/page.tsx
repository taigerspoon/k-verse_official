export default function Home() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* 헤더 */}
      <header style={{ backgroundColor: "#1F4E79", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>K-Verse</h1>
        <button style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "10px 24px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          무료로 시작하기
        </button>
      </header>

      {/* Hero 섹션 */}
      <section style={{ textAlign: "center", padding: "120px 40px 80px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "52px", fontWeight: "bold", color: "#1A1A2E", lineHeight: 1.2, marginBottom: "24px" }}>
          TOPIK 합격,<br />AI와 함께
        </h2>
        <p style={{ fontSize: "20px", color: "#2E75B6", marginBottom: "48px", lineHeight: 1.6 }}>
          베트남 학습자를 위한 AI 한국어 코치<br />
          틀린 문제를 베트남어로 바로 설명해드려요
        </p>
        <button style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "18px 48px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}>
          무료로 시작하기 →
        </button>
      </section>

      {/* 핵심 기능 3가지 */}
      <section style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h3 style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "60px" }}>
          K-Verse만의 핵심 기능
        </h3>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "40px 32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤖</div>
            <h4 style={{ fontSize: "20px", fontWeight: "bold", color: "#1F4E79", marginBottom: "12px" }}>Explain AI</h4>
            <p style={{ color: "#666", lineHeight: 1.7, fontSize: "16px" }}>틀린 문제를 베트남어로 바로 설명. 왜 틀렸는지 이해하고 넘어가세요.</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "40px 32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📝</div>
            <h4 style={{ fontSize: "20px", fontWeight: "bold", color: "#1F4E79", marginBottom: "12px" }}>TOPIK 트레이너</h4>
            <p style={{ color: "#666", lineHeight: 1.7, fontSize: "16px" }}>실제 TOPIK 기출문제로 훈련. 3급~4급 합격을 목표로 체계적으로 준비하세요.</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "40px 32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✍️</div>
            <h4 style={{ fontSize: "20px", fontWeight: "bold", color: "#1F4E79", marginBottom: "12px" }}>쓰기 AI 첨삭</h4>
            <p style={{ color: "#666", lineHeight: 1.7, fontSize: "16px" }}>작문을 제출하면 AI가 교정하고 모범 답안을 제시해드려요.</p>
          </div>

        </div>
      </section>

      {/* 최종 CTA */}
      <section style={{ backgroundColor: "#1F4E79", padding: "80px 40px", textAlign: "center" }}>
        <h3 style={{ fontSize: "36px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          지금 무료로 시작하세요
        </h3>
        <p style={{ color: "#B3CDE8", fontSize: "18px", marginBottom: "40px" }}>
          베타 유저 500명 모집 중
        </p>
        <button style={{ backgroundColor: "#F5C518", color: "#1A1A2E", padding: "18px 48px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}>
          무료로 시작하기 →
        </button>
      </section>

    </main>
  );
}