import { ReactNode, MouseEvent, CSSProperties } from "react";

type ModalSize = "small" | "medium" | "large";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles: Record<ModalSize, CSSProperties> = {
    small: { minWidth: "300px", maxWidth: "400px" },
    medium: { minWidth: "400px", maxWidth: "500px" },
    large: { minWidth: "500px", maxWidth: "700px" },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          padding: "2rem",
          borderRadius: "8px",
          maxHeight: "90vh",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid var(--color-border)",
          position: "relative",
          ...sizeStyles[size],
        }}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {title && (
          <h2 style={{ margin: "0 0 1rem 0", color: "var(--color-text)" }}>
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--color-text)",
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
