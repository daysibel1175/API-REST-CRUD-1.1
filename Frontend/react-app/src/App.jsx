import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/theme.css";
import { usePalette } from "./hooks/usePalette";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import TrilhasPage from "./pages/TrilhasPage.jsx";
import GuiasPage from "./pages/GuiasPage.jsx";
import GruposPage from "./pages/GruposPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";

function App() {
  usePalette("/legacy-images/icono%20da%20API.png");
  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trilhas" element={<TrilhasPage />} />
          <Route path="/guias" element={<GuiasPage />} />
          <Route path="/grupos" element={<GruposPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
