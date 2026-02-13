import { ReactNode, CSSProperties, MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "muted" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  style = {},
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 whitespace-nowrap";

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-border text-text hover:opacity-90",
    danger: "bg-red-600 text-white hover:bg-red-700",
    muted: "bg-muted text-white hover:opacity-90",
    outline: "border border-border text-text hover:border-primary",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";
  const disabledClass = disabled
    ? "opacity-60 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  const finalClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      style={style}
    >
      {children}
    </button>
  );
}
