import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/theme.css";
import { usePalette } from "./hooks/usePalette";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TrilhasPage from "./pages/TrilhasPage";
import GuiasPage from "./pages/GuiasPage";
import GruposPage from "./pages/GruposPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  usePalette("/legacy-images/icono%20da%20API.png");
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
