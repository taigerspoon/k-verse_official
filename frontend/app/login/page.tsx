export default function LoginPage() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "48px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        {/* 로고 영역 */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", backgroundColor: "#1F4E79", borderRadius: "16px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>📚</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>K-Verse</h1>
          <p style={{ color: "#2E75B6", fontSize: "15px", lineHeight: 1.6 }}>
            베트남 학습자를 위한<br />AI 한국어 코치
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: "1px solid #F0F0F0", marginBottom: "32px" }} />

        {/* 로그인 안내 */}
        <p style={{ color: "#666", fontSize: "14px", textAlign: "center", marginBottom: "20px" }}>
          아래 버튼으로 간편하게 시작하세요
        </p>

        {/* 구글 로그인 버튼 */}
        <button
          style={{
            width: "100%",
            backgroundColor: "white",
            color: "#1A1A2E",
            padding: "14px 20px",
            borderRadius: "8px",
            border: "1.5px solid #E0E0E0",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* 구글 로고 SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Google로 시작하기
        </button>

        {/* TOPIK 집중반 버튼 */}
        <button
          style={{
            width: "100%",
            backgroundColor: "#F5C518",
            color: "#1A1A2E",
            padding: "14px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          🎯 TOPIK 집중반 시작하기
        </button>

        {/* 이용약관 */}
        <p style={{ color: "#999", textAlign: "center", fontSize: "13px", lineHeight: 1.6 }}>
          계속하면 <span style={{ color: "#2E75B6", cursor: "pointer" }}>이용약관</span> 및{" "}
          <span style={{ color: "#2E75B6", cursor: "pointer" }}>개인정보처리방침</span>에<br />
          동의하는 것으로 간주됩니다
        </p>

      </div>
    </main>
  );
}