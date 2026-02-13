import { useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import { createUsuario, getUsuarioByEmail } from "../services/api.ts";
import { useAuth } from "../context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginForm {
  nome: string;
  idade: string;
  contato: string;
  email: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<LoginForm>({
    nome: "",
    idade: "",
    contato: "",
    email: "",
  });

  if (!isOpen) return null;

  const handleReset = (): void => {
    setForm({ nome: "", idade: "", contato: "", email: "" });
    setError(null);
    setIsRegistering(false);
  };

  const handleClose = (): void => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (isRegistering) {
        // Registrar nuevo usuario
        const payload = {
          nome: form.nome.trim(),
          idade: Number(form.idade),
          contato: Number(form.contato),
          email: form.email.trim(),
        };

        const userData = await createUsuario(payload);
        login(userData);
        handleReset();
        onClose();
      } else {
        // Login: buscar usuario existente
        const userData = await getUsuarioByEmail(form.email.trim());
        if (!userData) {
          setError("Usuario no encontrado. ¿Deseas registrarte?");
          return;
        }
        login(userData);
        handleReset();
        onClose();
      }
    } catch (err: any) {
      const message = isRegistering
        ? "Error al registrar"
        : "Error al iniciar sesión";
      setError(err.response?.data?.message || err.message || message);
    } finally {
      setSaving(false);
    }
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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "400px",
          maxWidth: "500px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid var(--color-border)",
          position: "relative",
        }}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
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

        <h2>{isRegistering ? "Registrar" : "Iniciar sesión"}</h2>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
              }}
            />
          </div>

          {isRegistering && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  required
                  placeholder="Nombre"
                  value={form.nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  required
                  type="number"
                  placeholder="Edad"
                  value={form.idade}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, idade: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  required
                  type="number"
                  placeholder="Contacto"
                  value={form.contato}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, contato: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "0.5rem",
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? "Procesando..."
                : isRegistering
                  ? "Registrar"
                  : "Iniciar sesión"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: "0.5rem",
                backgroundColor: "var(--color-muted)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
              setForm({ nome: "", idade: "", contato: "", email: form.email });
            }}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "transparent",
              color: "var(--color-primary)",
              border: "1px solid var(--color-primary)",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {isRegistering
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </form>
      </div>
    </div>
  );
}
