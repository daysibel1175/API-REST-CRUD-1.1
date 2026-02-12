import { ReactNode, CSSProperties, MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "muted";

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: CSSProperties;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
  fullWidth = false,
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    padding: "0.65rem 1.25rem",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.95rem",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    width: fullWidth ? "100%" : "auto",
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      ...baseStyle,
      backgroundColor: "var(--color-primary)",
      color: "white",
      opacity: disabled ? 0.6 : 1,
    },
    secondary: {
      ...baseStyle,
      backgroundColor: "var(--color-border)",
      color: "var(--color-text)",
      opacity: disabled ? 0.6 : 1,
    },
    danger: {
      ...baseStyle,
      backgroundColor: "#dc3545",
      color: "white",
      opacity: disabled ? 0.6 : 1,
    },
    muted: {
      ...baseStyle,
      backgroundColor: "var(--color-muted)",
      color: "white",
      opacity: disabled ? 0.6 : 1,
    },
  };

  const finalStyle: CSSProperties = { ...variantStyles[variant], ...style };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={finalStyle}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "scale(1.02)";
        }
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.opacity = String(
          variantStyles[variant].opacity || 1,
        );
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}
