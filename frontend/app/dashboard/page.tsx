export default function DashboardPage() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1F4E79" }}>K-Verse</h1>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#1F4E79", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>U</span>
          </div>
        </div>

        {/* 환영 메시지 */}
        <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "8px" }}>안녕하세요! 👋</h2>
        <p style={{ color: "#2E75B6", marginBottom: "40px" }}>오늘도 한국어 공부 시작해볼까요?</p>

        {/* 메뉴 카드 3개 */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "240px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🤖</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>Explain AI</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>틀린 문제를 베트남어로 설명받기</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "240px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>📝</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>TOPIK 트레이너</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>기출문제로 실전 연습하기</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "240px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>📊</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>내 학습 현황</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>점수 그래프와 진도 확인하기</p>
          </div>

        </div>
      </div>
    </main>
  );
}