// components/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "대시보드" },
    { href: "/quiz", label: "퀴즈" },
    { href: "/explain", label: "Explain AI" },
  ];

  return (
    <nav
      style={{
        backgroundColor: "#1F4E79",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* 로고 */}
      <Link
        href="/"
        style={{
          color: "#F5C518",
          fontWeight: "bold",
          fontSize: "20px",
          textDecoration: "none",
        }}
      >
        K-Verse
      </Link>

      {/* 메뉴 링크 */}
      <div style={{ display: "flex", gap: "8px" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: pathname === link.href ? "#F5C518" : "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: pathname === link.href ? "bold" : "normal",
              backgroundColor:
                pathname === link.href
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}