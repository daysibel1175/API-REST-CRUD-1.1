export default function LegacyGallery() {
  const images: string[] = [
    "/legacy-images/fotodedaysibel.jpg",
    "/legacy-images/fotodericardo.jpg",
    "/legacy-images/fotodewilfried.jpg",
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
      {images.map((src) => (
        <figure
          key={src}
          style={{
            margin: 0,
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            overflow: "hidden",
            background: "var(--color-bg)",
          }}
        >
          <img
            src={src}
            alt="Foto"
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              display: "block",
            }}
          />
        </figure>
      ))}
    </div>
  );
}
