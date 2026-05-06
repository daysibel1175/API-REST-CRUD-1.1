import { ChangeEvent, CSSProperties } from "react";

type InputVariant = "default" | "filled" | "error";
type InputSize = "sm" | "md" | "lg";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  style?: CSSProperties;
  className?: string;
  required?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  onKeyPress,
  name = "",
  style = {},
  className = "",
  required = false,
  variant = "default",
  size = "md",
  fullWidth = true,
  disabled = false,
}: InputProps) {
  const sizeClasses: Record<InputSize, string> = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg",
  };

  const baseStyle: CSSProperties = {
    width: fullWidth ? "100%" : "auto",
    boxSizing: "border-box",
    borderRadius: "0.375rem",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem",
    padding:
      size === "sm"
        ? "0.375rem 0.625rem"
        : size === "lg"
          ? "0.625rem 1rem"
          : "0.5rem 0.75rem",
    transition: "all 0.2s ease",
    outline: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none" as any,
  };

  const combinedStyle: CSSProperties = {
    ...baseStyle,
    ...style,
  };

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      required={required}
      disabled={disabled}
      className={className}
      style={combinedStyle}
    />
  );
}
