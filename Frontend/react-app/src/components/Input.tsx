import { ChangeEvent, FocusEvent, CSSProperties } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: CSSProperties;
  required?: boolean;
}

export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  name = "",
  style = {},
  required = false,
}: InputProps) {
  const baseStyle: CSSProperties = {
    width: "100%",
    padding: "0.5rem",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: "1rem",
    transition: "border-color 0.2s ease",
  };

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        ...baseStyle,
        ...style,
      }}
      onFocus={(e: FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "var(--color-primary)";
      }}
      onBlur={(e: FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    />
  );
}
