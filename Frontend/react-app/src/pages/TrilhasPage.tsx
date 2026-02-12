import { useEffect, useState } from "react";
import {
  createTrilha,
  deleteTrilha,
  fetcher,
  updateTrilha,
} from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import { Trilha } from "../types";

interface TrilhaForm {
  nome: string;
  tipo_de_trilha: string;
  localizacao: string;
  descricao: string;
  dica: string;
  duracao: string;
  km_camino: string;
  img: string;
}

export default function TrilhasPage() {
  const [data, setData] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<TrilhaForm>({
    nome: "",
    tipo_de_trilha: "",
    localizacao: "",
    descricao: "",
    dica: "",
    duracao: "",
    km_camino: "",
    img: "",
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetcher<Trilha[]>("/trilhas")
      .then((res) => {
        if (mounted) {
          setData(res);
        }
      })
      .catch((err) => setError(err.message || "Erro ao carregar"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Carregando trilhas...</p>;
  if (error) return <p>Erro: {error}</p>;

  const getUniqueFilterValues = (field: keyof Trilha): string[] => {
    const values = data.map((t) => t[field]).filter(Boolean) as string[];
    return [...new Set(values)].sort();
  };

  const filtered = data.filter((t) => {
    // Aplicar búsqueda en tiempo real
    let matchesSearch = true;
    if (searchTerm) {
      const normalize = (text: string) => {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      };

      const term = normalize(searchTerm);
      const searchInWords = (text: string | undefined) => {
        if (!text) return false;
        return normalize(text)
          .split(/\s+/)
          .some((word) => word.startsWith(term));
      };

      matchesSearch =
        searchInWords(t.nome) ||
        searchInWords(t.tipo_de_trilha) ||
        searchInWords(t.localizacao);
    }

    // Aplicar filtros avanzados
    let matchesFilter = true;
    if (selectedFilter && filterValue) {
      if (selectedFilter === "localizacao") {
        matchesFilter = t.localizacao === filterValue;
      } else if (selectedFilter === "tipo_de_trilha") {
        matchesFilter = t.tipo_de_trilha === filterValue;
      } else if (selectedFilter === "duracao") {
        matchesFilter = t.duracao === filterValue;
      } else if (selectedFilter === "km_camino") {
        matchesFilter = (t as any).km_camino === filterValue;
      }
    }

    return matchesSearch && matchesFilter;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, img: "" });
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleCloseModal = () => {
    setForm({
      nome: "",
      tipo_de_trilha: "",
      localizacao: "",
      descricao: "",
      dica: "",
      duracao: "",
      km_camino: "",
      img: "",
    });
    setEditingId(null);
    setActionError(null);
    setIsModalOpen(false);
  };

  const handleEdit = (trilha: Trilha) => {
    setEditingId(trilha._id);
    setForm({
      nome: trilha.nome,
      tipo_de_trilha: trilha.tipo_de_trilha,
      localizacao: trilha.localizacao || "",
      descricao: trilha.descricao || "",
      dica: trilha.dica || "",
      duracao: trilha.duracao || "",
      km_camino: (trilha as any).km_camino || "",
      img: trilha.img || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setSaving(true);

    try {
      if (editingId) {
        // Atualizar trilha existente
        await updateTrilha(editingId, form);
        setData((prev) =>
          prev.map((t) =>
            t._id === editingId ? { ...t, ...form, _id: editingId } : t,
          ),
        );
      } else {
        // Criar nova trilha
        const result = await createTrilha(form);
        setData((prev) => [...prev, result]);
      }
      setForm({
        nome: "",
        tipo_de_trilha: "",
        localizacao: "",
        descricao: "",
        dica: "",
        duracao: "",
        km_camino: "",
        img: "",
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Erro ao salvar",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Abrir modal de confirmação
    setDeleteConfirmId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setActionError(null);
    try {
      await deleteTrilha(deleteConfirmId);
      setData((prev) => prev.filter((t) => t._id !== deleteConfirmId));
      setIsDeleteConfirmOpen(false);
      setDeleteConfirmId(null);
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Erro ao deletar",
      );
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteConfirmId(null);
  };

  return (
    <section>
      <h2>Trilhas</h2>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <SearchBar
          searchInput={searchInput}
          onSearchInputChange={(e) => {
            setSearchInput(e.target.value);
            setSearchTerm(e.target.value.trim());
          }}
          onSearchClick={() => setSearchTerm(searchInput.trim())}
          placeholder="Buscar trilhas..."
        />
        <button
          type="button"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
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
          🔽 Filtros
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
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
          + Adicionar
        </button>
      </div>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        selectedFilter={selectedFilter}
        onFilterChange={(filter) => {
          setSelectedFilter(filter);
          setFilterValue("");
        }}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        filterOptions={[
          {
            value: "localizacao",
            label: "Localización",
            values: getUniqueFilterValues("localizacao"),
          },
          {
            value: "tipo_de_trilha",
            label: "Tipo de Trilha",
            values: getUniqueFilterValues("tipo_de_trilha"),
          },
          {
            value: "duracao",
            label: "Duración",
            values: getUniqueFilterValues("duracao"),
          },
          {
            value: "km_camino",
            label: "KM de Camino",
            values: getUniqueFilterValues("km_camino" as keyof Trilha),
          },
        ]}
        onClearFilters={() => {
          setSelectedFilter(null);
          setFilterValue("");
        }}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingId ? "Editar Trilha" : "Adicionar Nova Trilha"}
          size="medium"
        >
          {actionError && (
            <p style={{ color: "#dc3545", marginBottom: "1rem" }}>
              {actionError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                required
                name="nome"
                placeholder="Nome da trilha"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="tipo_de_trilha"
                placeholder="Tipo de trilha (opcional)"
                value={form.tipo_de_trilha}
                onChange={(e) =>
                  setForm({ ...form, tipo_de_trilha: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="localizacao"
                placeholder="Localización (opcional)"
                value={form.localizacao}
                onChange={(e) =>
                  setForm({ ...form, localizacao: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="duracao"
                placeholder="Duración (opcional)"
                value={form.duracao}
                onChange={(e) => setForm({ ...form, duracao: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="km_camino"
                placeholder="KM de camino (opcional)"
                value={form.km_camino}
                onChange={(e) =>
                  setForm({ ...form, km_camino: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="descricao"
                placeholder="Descripción (opcional)"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                name="dica"
                placeholder="Dica (opcional)"
                value={form.dica}
                onChange={(e) => setForm({ ...form, dica: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="file"
                id="fileInput"
                name="img"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: "none",
                }}
              />
              <label
                htmlFor="fileInput"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-bg)";
                }}
              >
                {form.img ? "Cambiar imagen" : "Seleccionar imagen"}
              </label>
            </div>

            {form.img && (
              <div
                style={{
                  marginBottom: "1rem",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <img
                  src={form.img}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                  }}
                />
                <Button
                  variant="danger"
                  onClick={handleRemoveImage}
                  style={{
                    width: "100%",
                    marginTop: "0.5rem",
                  }}
                >
                  Eliminar imagen
                </Button>
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <Button type="submit" disabled={saving} style={{ flex: 1 }}>
                {saving
                  ? editingId
                    ? "Actualizando..."
                    : "Agregando..."
                  : editingId
                    ? "Actualizar trilha"
                    : "Agregar trilha"}
              </Button>
              <Button
                type="button"
                variant="muted"
                onClick={handleCloseModal}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {filtered.length === 0 ? (
        <p>Nenhuma trilha encontrada.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((t) => (
            <li
              key={t._id}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                backgroundColor: "var(--color-bg)",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              {t.img ? (
                <img
                  src={t.img}
                  alt={t.nome}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "250px",
                    height: "250px",
                    backgroundColor: "var(--color-border)",
                    borderRadius: "8px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-muted)",
                  }}
                >
                  Sin imagen
                </div>
              )}
              <div style={{ flex: 1, marginBottom: "0.5rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{t.nome}</h3>
                <p style={{ margin: "0.25rem 0", color: "var(--color-muted)" }}>
                  <strong>Tipo:</strong> {t.tipo_de_trilha}
                </p>
                {t.localizacao && (
                  <p
                    style={{ margin: "0.25rem 0", color: "var(--color-muted)" }}
                  >
                    <strong>Localización:</strong> {t.localizacao}
                  </p>
                )}
                {t.duracao && (
                  <p
                    style={{ margin: "0.25rem 0", color: "var(--color-muted)" }}
                  >
                    <strong>Duración:</strong> {t.duracao}
                  </p>
                )}
                {(t as any).km_camino && (
                  <p
                    style={{ margin: "0.25rem 0", color: "var(--color-muted)" }}
                  >
                    <strong>KM de camino:</strong> {(t as any).km_camino}
                  </p>
                )}
                {t.descricao && (
                  <p style={{ margin: "0.5rem 0", lineHeight: "1.5" }}>
                    <strong>Descripción:</strong> {t.descricao}
                  </p>
                )}
                {t.dica && (
                  <p
                    style={{
                      margin: "0.5rem 0",
                      lineHeight: "1.5",
                      backgroundColor: "var(--color-border)",
                      padding: "0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    <strong>Dicas:</strong> {t.dica}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button onClick={() => handleEdit(t)} style={{ flex: 1 }}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(t._id)}
                    style={{ flex: 1 }}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirmar exclusão"
        message="Tem certeza de que deseja deletar esta trilha? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
      />
    </section>
  );
}
