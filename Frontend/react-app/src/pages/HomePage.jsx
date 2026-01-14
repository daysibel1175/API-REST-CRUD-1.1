import LegacyGallery from "../components/LegacyGallery.jsx";

export default function HomePage() {
  return (
    <section>
      <header
        style={{
          padding: "2rem 1rem",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          background: "var(--color-bg)",
        }}
      >
        <img
          src="/legacy-images/icono da API.png"
          alt="Logo"
          style={{ width: 96, height: 96, objectFit: "contain" }}
        />
        <h1 style={{ marginTop: "1rem", color: "var(--color-text)" }}>
          Bem-vindo(a) ao Trilhas Brasil
        </h1>
        <p style={{ color: "var(--color-muted)" }}>
          Use o menu para navegar entre Trilhas, Guias, Grupos e Usuários.
        </p>
      </header>

      <LegacyGallery />
    </section>
  );
}
