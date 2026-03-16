export default function Home() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>

      {/* Hero 섹션 */}
      <section className="hero-section" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <h2 className="hero-title" style={{ fontWeight: "bold", color: "#1A1A2E", lineHeight: 1.2, marginBottom: "24px" }}>
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
        <div className="features-grid">

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

      {/* Duolingo 비교 섹션 */}
      <section style={{ padding: "80px 40px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "16px" }}>
            왜 Duolingo가 아닌 K-Verse인가요?
          </h3>
          <p style={{ textAlign: "center", color: "#666", fontSize: "18px", marginBottom: "60px" }}>
            TOPIK 합격이 목표라면 K-Verse가 답입니다
          </p>

          <div className="comparison-wrapper">
            <div className="comparison-table" style={{ border: "1px solid #E0E0E0", borderRadius: "8px", overflow: "hidden" }}>

              {/* 헤더 행 */}
              <div style={{ backgroundColor: "#F8FAFC", padding: "20px", fontWeight: "bold", color: "#666", fontSize: "14px", borderBottom: "1px solid #E0E0E0" }}>기능</div>
              <div style={{ backgroundColor: "#F8FAFC", padding: "20px", fontWeight: "bold", color: "#666", fontSize: "14px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>Duolingo</div>
              <div style={{ backgroundColor: "#1F4E79", padding: "20px", fontWeight: "bold", color: "#F5C518", fontSize: "14px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>K-Verse ✨</div>

              {/* 행 1 */}
              <div style={{ padding: "20px", color: "#1A1A2E", fontSize: "15px", borderBottom: "1px solid #E0E0E0" }}>문법 설명</div>
              <div style={{ padding: "20px", color: "#999", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>❌ 패턴 반복만</div>
              <div style={{ padding: "20px", color: "white", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0", backgroundColor: "#2E75B6" }}>✅ 베트남어로 직접 설명</div>

              {/* 행 2 */}
              <div style={{ padding: "20px", color: "#1A1A2E", fontSize: "15px", borderBottom: "1px solid #E0E0E0" }}>TOPIK 준비</div>
              <div style={{ padding: "20px", color: "#999", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>❌ 불가능</div>
              <div style={{ padding: "20px", color: "white", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0", backgroundColor: "#2E75B6" }}>✅ 실전 기출문제 훈련</div>

              {/* 행 3 */}
              <div style={{ padding: "20px", color: "#1A1A2E", fontSize: "15px", borderBottom: "1px solid #E0E0E0" }}>오답 해설</div>
              <div style={{ padding: "20px", color: "#999", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>❌ 없음</div>
              <div style={{ padding: "20px", color: "white", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0", backgroundColor: "#2E75B6" }}>✅ AI가 즉시 설명</div>

              {/* 행 4 */}
              <div style={{ padding: "20px", color: "#1A1A2E", fontSize: "15px", borderBottom: "1px solid #E0E0E0" }}>베트남어 지원</div>
              <div style={{ padding: "20px", color: "#999", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0" }}>❌ 없음</div>
              <div style={{ padding: "20px", color: "white", fontSize: "15px", textAlign: "center", borderBottom: "1px solid #E0E0E0", borderLeft: "1px solid #E0E0E0", backgroundColor: "#2E75B6" }}>✅ 전용 UI 지원</div>

              {/* 행 5 */}
              <div style={{ padding: "20px", color: "#1A1A2E", fontSize: "15px" }}>작문 첨삭</div>
              <div style={{ padding: "20px", color: "#999", fontSize: "15px", textAlign: "center", borderLeft: "1px solid #E0E0E0" }}>❌ 없음</div>
              <div style={{ padding: "20px", color: "white", fontSize: "15px", textAlign: "center", borderLeft: "1px solid #E0E0E0", backgroundColor: "#2E75B6" }}>✅ AI 실시간 교정</div>

            </div>
          </div>
        </div>
      </section>

      {/* 사회적 증거 섹션 */}
      <section style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h3 style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "16px" }}>
          베타 유저들의 이야기
        </h3>
        <p style={{ textAlign: "center", color: "#666", fontSize: "18px", marginBottom: "60px" }}>
          지금 <strong style={{ color: "#1F4E79" }}>127명</strong>이 K-Verse로 TOPIK을 준비하고 있어요
        </p>

        <div className="testimonials-grid">

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "32px", marginBottom: "16px" }}>⭐⭐⭐⭐⭐</p>
            <p style={{ color: "#1A1A2E", lineHeight: 1.8, fontSize: "16px", marginBottom: "20px" }}>
              "Duolingo로 1년 공부했는데 TOPIK은 엄두도 못 냈어요. K-Verse 2달 만에 3급 합격했습니다!"
            </p>
            <p style={{ color: "#2E75B6", fontWeight: "bold", fontSize: "14px" }}>Nguyen Thi Lan · 하노이</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "32px", marginBottom: "16px" }}>⭐⭐⭐⭐⭐</p>
            <p style={{ color: "#1A1A2E", lineHeight: 1.8, fontSize: "16px", marginBottom: "20px" }}>
              "베트남어로 문법을 설명해주는 게 정말 달라요. 왜 틀렸는지 이제 완전히 이해해요."
            </p>
            <p style={{ color: "#2E75B6", fontWeight: "bold", fontSize: "14px" }}>Tran Van Minh · 호치민</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", flex: 1, minWidth: "260px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "32px", marginBottom: "16px" }}>⭐⭐⭐⭐⭐</p>
            <p style={{ color: "#1A1A2E", lineHeight: 1.8, fontSize: "16px", marginBottom: "20px" }}>
              "한국 취업 비자 때문에 TOPIK 4급이 필요했어요. K-Verse 덕분에 3개월 만에 목표 달성!"
            </p>
            <p style={{ color: "#2E75B6", fontWeight: "bold", fontSize: "14px" }}>Le Thi Hoa · 다낭</p>
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