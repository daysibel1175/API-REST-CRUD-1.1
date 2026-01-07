import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <img
          src="/legacy-images/icono%20da%20API.png"
          alt="Trilhas Brasil"
          className="navbar__brandLogo"
        />
        <span>Trilhas Brasil</span>
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
          <NavLink to="/usuarios">Usuários</NavLink>
        </li>
      </ul>
    </nav>
  );
}
