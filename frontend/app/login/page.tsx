export default function LoginPage() {
  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "48px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px", textAlign: "center" }}>K-Verse</h1>
        <p style={{ color: "#2E75B6", textAlign: "center", marginBottom: "32px" }}>베트남 학습자를 위한 AI 한국어 코치</p>
        
        <button style={{ width: "100%", backgroundColor: "#F5C518", color: "#1A1A2E", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          Google로 시작하기
        </button>
        
        <p style={{ color: "#999", textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          계속하면 이용약관에 동의하는 것으로 간주됩니다
        </p>
      </div>
    </main>
  );
}