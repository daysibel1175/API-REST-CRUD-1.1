import img from "../../dist/legacy-images/baixados.webp"
export default function HomePage(): JSX.Element {
  return (
    <section>
      <header
        style={{
          padding: "2rem 1rem",
          background: "var(--color-bg)",
        }}
      >
        <img
          src={img}
          alt="Logo"
          style={{ width: "96%", height: "96%", objectFit: "contain" }}
        />
        <h1 style={{ marginTop: "1rem", color: "var(--color-text)" }}>
          Bem-vindo(a) ao Trilhas Brasil
        </h1>
        <p style={{ color: "var(--color-muted)" }}>
          Use o menu para navegar entre Trilhas, Guias, Grupos e Usuários.
        </p>
      </header>
    </section>
  );
}
