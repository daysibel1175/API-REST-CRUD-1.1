export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  name = "",
  style = {},
}) {
  const baseStyle = {
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
      style={{
        ...baseStyle,
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--color-primary)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--color-border)";
      }}
    />
  );
}
