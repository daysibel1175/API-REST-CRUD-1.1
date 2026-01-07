export default function HomePage() {
  return (
    <section>
      <header
        style={{
          padding: "2rem 1rem",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          background: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/legacy-images/icono%20da%20API.png"
          alt="Trilhas Brasil"
          style={{
            width: "min(70vw, 320px)",
            height: "auto",
            maxHeight: 380,
            objectFit: "contain",
            display: "block",
          }}
        />
      </header>
    </section>
  );
}
