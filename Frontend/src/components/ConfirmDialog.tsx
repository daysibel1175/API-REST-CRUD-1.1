import { MouseEvent } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

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
        zIndex: 1001,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid var(--color-border)",
          position: "relative",
        }}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 1rem 0", color: "var(--color-text)" }}>
          {title}
        </h2>
        {message && (
          <p style={{ margin: "0 0 1.5rem 0", color: "var(--color-muted)" }}>
            {message}
          </p>
        )}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button variant="danger" onClick={onConfirm} style={{ flex: 1 }}>
            {confirmText}
          </Button>
          <Button variant="muted" onClick={onCancel} style={{ flex: 1 }}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
