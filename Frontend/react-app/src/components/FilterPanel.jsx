import Button from "./Button";
import Select from "./Select";

export default function FilterPanel({
  isOpen,
  selectedFilter,
  onFilterChange,
  filterValue,
  onFilterValueChange,
  filterOptions = [],
  onClearFilters,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "var(--color-primary)",
        borderRadius: "8px",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label
          style={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            color: "white",
          }}
        >
          Filtrar por:
        </label>
        <select
          value={selectedFilter || ""}
          onChange={(e) => onFilterChange(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
            fontSize: "1rem",
          }}
        >
          <option value="">-- Seleccionar --</option>
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {selectedFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              color: "white",
            }}
          >
            Selecciona:
          </label>
          <select
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
              fontSize: "1rem",
            }}
          >
            <option value="">-- Todas --</option>
            {filterOptions
              .find((opt) => opt.value === selectedFilter)
              ?.values?.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      )}

      {(selectedFilter || filterValue) && (
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "white",
            color: "#dc3545",
            cursor: "pointer",
            fontSize: "1rem",
            whiteSpace: "nowrap",
            fontWeight: "500",
          }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
