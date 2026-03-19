export default function DiagnosticPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F8FAFC",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        textAlign: "center",
        padding: "48px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        maxWidth: "480px",
        width: "100%",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>📋</div>
        <h1 style={{
          color: "#1F4E79",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}>
          진단 테스트 준비 중
        </h1>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: 1.6 }}>
          곧 K-Verse 진단 테스트가 시작됩니다.
        </p>
      </div>
    </main>
  );
}