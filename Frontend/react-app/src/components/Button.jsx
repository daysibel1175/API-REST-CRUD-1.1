export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
  fullWidth = false,
}) {
  const baseStyle = {
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

  const variantStyles = {
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

  const finalStyle = { ...variantStyles[variant], ...style };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={finalStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.opacity = "0.9";
          e.target.style.transform = "scale(1.02)";
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = variantStyles[variant].opacity || "1";
        e.target.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}
