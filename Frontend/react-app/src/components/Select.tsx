import { ChangeEvent, CSSProperties } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options?: SelectOption[];
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  name?: string;
  style?: CSSProperties;
}

export default function Select({
  options = [],
  value = "",
  onChange,
  placeholder = "-- Seleccionar --",
  name = "",
  style = {},
}: SelectProps) {
  const baseStyle: CSSProperties = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: "1rem",
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
