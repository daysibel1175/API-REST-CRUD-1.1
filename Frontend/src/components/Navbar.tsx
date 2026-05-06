import { NavLink } from "react-router-dom";
import { Suspense, useState } from "react";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { lazy } from "react";

const LoginModal = lazy(() => import("./LoginModal"));

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleNavItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand" aria-label="Trilhas Brasil">
          <picture>
            <source media="(max-width: 699px)" srcSet="/img/logo-mobile.jpg" />
            <img
              src="/img/icono-da-API_172x50.webp"
              alt="Trilhas Brasil"
              className="navbar__brandLogo"
              fetchPriority="high"
            />
          </picture>
        </div>

        <button
          type="button"
          className="navbar__menuButton"
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul
          className={`navbar__links ${isMenuOpen ? "navbar__links--open" : ""}`}
        >
          <li>
            <NavLink to="/" end onClick={handleNavItemClick}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/trilhas" onClick={handleNavItemClick}>
              Trilhas
            </NavLink>
          </li>
          <li>
            <NavLink to="/guias" onClick={handleNavItemClick}>
              Guias
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/grupos" onClick={handleNavItemClick}>
                Grupos
              </NavLink>
            </li>
          )}
          <li>
            {user ? (
              <>
                <NavLink to="/usuarios" onClick={handleNavItemClick}>
                  Mi Cuenta ({user.nome})
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    handleNavItemClick();
                  }}
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
                onClick={() => {
                  setShowLoginModal(true);
                  handleNavItemClick();
                }}
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
      {showLoginModal && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        </Suspense>
      )}
    </>
  );
}
