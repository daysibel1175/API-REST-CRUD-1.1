import { ChangeEvent, CSSProperties } from "react";

type InputVariant = "default" | "filled" | "error";
type InputSize = "sm" | "md" | "lg";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: CSSProperties;
  className?: string;
  required?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
}

export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  name = "",
  style = {},
  className = "",
  required = false,
  variant = "default",
  size = "md",
  fullWidth = true,
}: InputProps) {
  const baseClasses =
    "rounded-md border text-text bg-bg placeholder:text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40";

  const sizeClasses: Record<InputSize, string> = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg",
  };

  const variantClasses: Record<InputVariant, string> = {
    default: "border-border",
    filled: "border-transparent bg-muted/10",
    error: "border-red-500 focus:ring-red-500/40",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  const finalClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={finalClassName}
      style={style}
    />
  );
}
