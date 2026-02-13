import { useEffect, useState } from "react";
import {
  createGrupo,
  deleteGrupo,
  fetcher,
  updateGrupo,
} from "../services/api.ts";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchBar from "../components/SearchBar";
import { Grupo, Guia } from "../types";

interface GrupoForm {
  guia: string;
  familiar: boolean;
}

export default function GruposPage() {
  const [data, setData] = useState<Grupo[]>([]);
  const [guias, setGuias] = useState<Guia[]>([]);
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
  const [isGuiaDropdownOpen, setIsGuiaDropdownOpen] = useState<boolean>(false);
  const [form, setForm] = useState<GrupoForm>({
    guia: "",
    familiar: false,
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([fetcher<Grupo[]>("/grupos"), fetcher<Guia[]>("/guias")])
      .then(([gruposRes, guiasRes]) => {
        if (mounted) {
          setData(gruposRes);
          setGuias(guiasRes);
        }
      })
      .catch((err) => setError(err.message || "Erro ao carregar"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown="guia"]')) {
        setIsGuiaDropdownOpen(false);
      }
    };
    if (isGuiaDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isGuiaDropdownOpen]);

  if (loading) return <p>Carregando grupos...</p>;
  if (error) return <p>Erro: {error}</p>;

  const filtered = data.filter((g) => {
    if (!searchTerm) return true;

    // Función para normalizar texto (remover acentos)
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    const term = normalize(searchTerm);
    const guiaObj = typeof g.guia === "string" ? null : g.guia;
    const guiaName = normalize(guiaObj?.nome || "");

    // Busca por palabra completa que comienza con el término
    const searchInWords = (text: string) => {
      if (!text) return false;
      return text.split(/\s+/).some((word) => word.startsWith(term));
    };

    return searchInWords(guiaName);
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setSaving(true);
    try {
      const payload = {
        guia: form.guia,
        familiar: form.familiar,
      };

      if (editingId) {
        // Atualizar grupo existente
        await updateGrupo(editingId, payload);
        setData((prev) =>
          prev.map((g) =>
            g._id === editingId ? { ...g, ...payload, _id: editingId } : g,
          ),
        );
      } else {
        // Criar novo grupo
        const created = await createGrupo(payload);
        setData((prev) => [created, ...prev]);
      }
      setForm({ guia: "", familiar: false });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Erro ao adicionar",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setForm({ guia: "", familiar: false });
    setEditingId(null);
    setActionError(null);
    setIsModalOpen(false);
  };

  const handleEdit = (grupo: Grupo) => {
    setEditingId(grupo._id);
    const guiaId = typeof grupo.guia === "string" ? grupo.guia : grupo.guia._id;
    setForm({
      guia: guiaId,
      familiar: grupo.familiar,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // Abrir modal de confirmação
    setDeleteConfirmId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setActionError(null);
    try {
      await deleteGrupo(deleteConfirmId);
      setData((prev) => prev.filter((g) => g._id !== deleteConfirmId));
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

  const getGuiaName = (guia: string | Guia): string => {
    if (typeof guia === "string") return guia;
    return guia.nome;
  };

  return (
    <section>
      <h2>Grupos</h2>
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
          placeholder="Buscar grupo..."
        />
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Editar Grupo" : "Adicionar Novo Grupo"}
        size="medium"
      >
        {actionError && (
          <p style={{ color: "#dc3545", marginBottom: "1rem" }}>
            {actionError}
          </p>
        )}

        <form onSubmit={handleAdd}>
          <div
            style={{ marginBottom: "1rem", position: "relative" }}
            data-dropdown="guia"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsGuiaDropdownOpen(!isGuiaDropdownOpen);
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                fontSize: "1rem",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {form.guia
                ? guias.find((g) => g._id === form.guia)?.nome ||
                  "Selecionar um guia"
                : "Selecionar um guia"}
            </button>
            {isGuiaDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  maxHeight: "150px",
                  overflowY: "auto",
                  zIndex: 1002,
                }}
              >
                {guias.map((g) => (
                  <div
                    key={g._id}
                    onClick={() => {
                      setForm({ ...form, guia: g._id });
                      setIsGuiaDropdownOpen(false);
                    }}
                    style={{
                      padding: "0.5rem",
                      cursor: "pointer",
                      backgroundColor:
                        form.guia === g._id
                          ? "var(--color-primary)"
                          : "transparent",
                      color:
                        form.guia === g._id ? "white" : "var(--color-text)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (form.guia !== g._id) {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-border)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (form.guia !== g._id) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {g.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.familiar}
                onChange={(e) =>
                  setForm({ ...form, familiar: e.target.checked })
                }
              />
              Familiar
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button type="submit" disabled={saving} style={{ flex: 1 }}>
              {saving
                ? editingId
                  ? "Atualizando..."
                  : "Adicionando..."
                : editingId
                  ? "Atualizar grupo"
                  : "Adicionar grupo"}
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

      {filtered.length === 0 ? (
        <p>Nenhum grupo encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((g) => (
            <li
              key={g._id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <strong>Familiar:</strong> {g.familiar ? "Sim" : "Não"}
              {g.guia ? ` — Guia: ${getGuiaName(g.guia)}` : ""}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <Button onClick={() => handleEdit(g)} style={{ flex: 1 }}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(g._id)}
                  style={{ flex: 1 }}
                >
                  Deletar
                </Button>
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
        message="Tem certeza de que deseja deletar este grupo? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
      />
    </section>
  );
}
