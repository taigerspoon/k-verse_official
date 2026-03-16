// components/Button.tsx

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "golden";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50";

  const variants = {
    primary: "bg-[#1F4E79] text-white hover:bg-[#163d61]",
    secondary: "bg-[#2E75B6] text-white hover:bg-[#245d91]",
    golden: "bg-[#F5C518] text-[#1A1A2E] hover:bg-[#e0b015]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}