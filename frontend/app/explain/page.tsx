import Button from "@/components/Button";

export default function ExplainPage() {
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
            나는 매일 아침 운동을 ( ) 건강이 많이 좋아졌다.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ backgroundColor: "#FFE5E5", color: "#E53E3E", padding: "6px 16px", borderRadius: "8px", fontSize: "14px" }}>내 답: ② 하거나</span>
            <span style={{ backgroundColor: "#E5F5E5", color: "#2E7D32", padding: "6px 16px", borderRadius: "8px", fontSize: "14px" }}>정답: ③ 하더니</span>
          </div>
        </div>

        {/* AI 설명 */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <p style={{ color: "#1F4E79", fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>🤖 AI 설명 (Tiếng Việt)</p>
          <p style={{ color: "#1A1A2E", lineHeight: 1.8, marginBottom: "16px" }}>
            <strong>-하더니</strong> được dùng khi hành động ở vế trước dẫn đến kết quả ở vế sau.
          </p>
          <p style={{ color: "#666", lineHeight: 1.8, fontSize: "14px" }}>
            💡 <strong>-하거나</strong> có nghĩa là "hoặc là", dùng để liệt kê các lựa chọn — không phù hợp ở đây vì câu này thể hiện quan hệ nhân quả.
          </p>
        </div>

        {/* 버튼 테스트 */}
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="primary">프라이머리 버튼</Button>
          <Button variant="secondary">세컨더리 버튼</Button>
          <Button variant="golden">골든 버튼</Button>
        </div>

      </div>
    </main>
  );
}