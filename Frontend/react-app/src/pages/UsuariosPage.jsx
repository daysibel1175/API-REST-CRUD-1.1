import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUsuario } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UsuariosPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Redireccionando...</p>;
  }

  const handleDeleteAccount = async () => {
    setError(null);
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await deleteUsuario(user._id);
      logout();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error al deletar cuenta"
      );
    }
  };

  return (
    <section>
      <h2>Mi Cuenta</h2>
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Nombre:</strong> {user.nome}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Edad:</strong> {user.idade}
        </p>
        <p>
          <strong>Contacto:</strong> {user.contato}
        </p>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <button
        onClick={handleDeleteAccount}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Deletar Conta
      </button>
    </section>
  );
}
