import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand" aria-label="Trilhas Brasil">
          <img
            src="/legacy-images/icono%20da%20API.png"
            alt="Trilhas Brasil"
            className="navbar__brandLogo"
          />
        </div>
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/trilhas">Trilhas</NavLink>
          </li>
          <li>
            <NavLink to="/guias">Guias</NavLink>
          </li>
          <li>
            <NavLink to="/grupos">Grupos</NavLink>
          </li>
          <li>
            {user ? (
              <>
                <NavLink to="/usuarios">Mi Cuenta ({user.nome})</NavLink>
                <button
                  onClick={logout}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "var(--color-text)",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
