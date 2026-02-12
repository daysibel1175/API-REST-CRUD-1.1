import Input from "./Input";
import Button from "./Button";

export default function SearchBar({
  searchInput,
  onSearchInputChange,
  onSearchClick,
  placeholder = "Buscar...",
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        flex: "1",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flex: "1",
        }}
      >
        Buscar:
        <Input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={onSearchInputChange}
        />
      </label>
      <button
        type="button"
        onClick={onSearchClick}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "var(--color-primary)",
          color: "white",
          cursor: "pointer",
          fontSize: "1rem",
          whiteSpace: "nowrap",
        }}
      >
        Buscar
      </button>
    </div>
  );
}
