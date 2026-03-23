"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      icon: "🤖",
      title: "Explain AI",
      desc: "틀린 문제를 베트남어로 설명받기",
      badge: "인기",
      badgeColor: "#E53E3E",
      href: "/explain",
    },
    {
      icon: "📝",
      title: "TOPIK 트레이너",
      desc: "기출문제로 실전 연습하기",
      badge: "추천",
      badgeColor: "#1F4E79",
      href: "/quiz",
    },
    {
      icon: "📊",
      title: "내 학습 현황",
      desc: "점수 그래프와 진도 확인하기",
      badge: null,
      badgeColor: null,
      href: "/dashboard",
    },
  ];

  return (
    <main style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* 환영 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          <div>
            <p style={{ color: "#B3CDE8", fontSize: "14px", marginBottom: "8px" }}>오늘도 화이팅! 🔥</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
              안녕하세요! 👋
            </h2>
            <p style={{ color: "#B3CDE8", fontSize: "16px" }}>
              TOPIK 합격까지 함께 달려요!
            </p>
          </div>

          {/* 오늘의 학습 현황 */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#F5C518", fontSize: "28px", fontWeight: "bold" }}>0</p>
              <p style={{ color: "#B3CDE8", fontSize: "13px" }}>오늘 푼 문제</p>
            </div>
            <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#F5C518", fontSize: "28px", fontWeight: "bold" }}>0%</p>
              <p style={{ color: "#B3CDE8", fontSize: "13px" }}>정답률</p>
            </div>
          </div>
        </div>

        {/* 학습 시작 버튼 */}
        <div style={{ marginBottom: "40px" }}>
          <button
            onClick={() => router.push("/quiz")}
            style={{
              backgroundColor: "#F5C518",
              color: "#1A1A2E",
              padding: "16px 40px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(245,197,24,0.4)",
            }}
          >
            🚀 오늘의 학습 시작하기
          </button>
        </div>

        {/* 메뉴 카드 제목 */}
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1A1A2E", marginBottom: "20px" }}>
          학습 메뉴
        </h3>

        {/* 메뉴 카드 3개 */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => router.push(card.href)}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "32px",
                flex: 1,
                minWidth: "240px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                cursor: "pointer",
                border: "1.5px solid transparent",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1.5px solid #2E75B6";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1.5px solid transparent";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* 뱃지 */}
              {card.badge && (
                <span style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: card.badgeColor!,
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}>
                  {card.badge}
                </span>
              )}
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1F4E79", marginBottom: "8px" }}>{card.title}</h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}