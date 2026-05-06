import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/theme.css";
import { usePalette } from "./hooks/usePalette";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const GruposPage = lazy(() => import("./pages/GruposPage"));
const GuiasPage = lazy(() => import("./pages/GuiasPage"));
const UsuariosPage = lazy(() => import("./pages/UsuariosPage"));
const TrilhasPage = lazy(() => import("./pages/TrilhasPage"));

function App() {
  usePalette("/img/icono-da-API.webp");
  return (
    <AuthProvider>
      <div className="mt-[100px] flex h-[85vh] w-full flex-col">
        <Navbar />
        <main className="mx-auto box-border h-full w-full max-w-[1280px] flex-1 p-8">
          <Suspense fallback={<p>Carregando...</p>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trilhas" element={<TrilhasPage />} />
              <Route path="/guias" element={<GuiasPage />} />
              <Route path="/grupos" element={<GruposPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
