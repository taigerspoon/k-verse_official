// components/Card.tsx

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const paddings = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: paddings[padding],
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}