import { useEffect, useState } from "react";
import { createGuia, deleteGuia, fetcher, updateGuia } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchBar from "../components/SearchBar";

export default function GuiasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    contato: "",
  });

  useEffect(() => {
    let mounted = true;
    fetcher("/guias")
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

  if (loading) return <p>Carregando guias...</p>;
  if (error) return <p>Erro: {error}</p>;

  const filtered = data.filter((g) => {
    if (!searchTerm) return true;

    // Función para normalizar texto (remover acentos)
    const normalize = (text) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    const term = normalize(searchTerm);

    // Busca por palabra completa que comienza con el término
    const searchInWords = (text) => {
      if (!text) return false;
      return normalize(text.toString())
        .split(/\s+/)
        .some((word) => word.startsWith(term));
    };

    return searchInWords(g.nome);
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionError(null);
    setSaving(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        contato: Number(form.contato),
      };

      if (editingId) {
        // Atualizar guia existente
        await updateGuia(editingId, payload);
        setData((prev) =>
          prev.map((g) =>
            g._id === editingId ? { ...g, ...payload, _id: editingId } : g
          )
        );
      } else {
        // Criar novo guia
        const created = await createGuia(payload);
        setData((prev) => [created, ...prev]);
      }
      setForm({ nome: "", contato: "" });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || "Erro ao adicionar"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setForm({ nome: "", contato: "" });
    setEditingId(null);
    setActionError(null);
    setIsModalOpen(false);
  };

  const handleEdit = (guia) => {
    setEditingId(guia._id);
    setForm({
      nome: guia.nome,
      contato: guia.contato,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // Abrir modal de confirmação
    setDeleteConfirmId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setActionError(null);
    try {
      await deleteGuia(deleteConfirmId);
      setData((prev) => prev.filter((g) => g._id !== deleteConfirmId));
      setIsDeleteConfirmOpen(false);
      setDeleteConfirmId(null);
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || "Erro ao deletar"
      );
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteConfirmId(null);
  };

  return (
    <section>
      <h2>Guias</h2>
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
          placeholder="Buscar guia..."
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
        title={editingId ? "Editar Guia" : "Adicionar Novo Guia"}
        size="medium"
      >
        {actionError && (
          <p style={{ color: "#dc3545", marginBottom: "1rem" }}>
            {actionError}
          </p>
        )}

        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              required
              name="nome"
              placeholder="Nome do guia"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              required
              name="contato"
              type="number"
              placeholder="Contato (número)"
              value={form.contato}
              onChange={(e) => setForm({ ...form, contato: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button type="submit" disabled={saving} style={{ flex: 1 }}>
              {saving
                ? editingId
                  ? "Atualizando..."
                  : "Adicionando..."
                : editingId
                ? "Atualizar guia"
                : "Adicionar guia"}
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
        <p>Nenhum guia encontrado.</p>
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
              <strong>{g.nome}</strong> — contato: {g.contato}
              {g.trilha ? ` — trilha: ${g.trilha.nome || g.trilha}` : ""}
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
        message="Tem certeza de que deseja deletar este guia? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
      />
    </section>
  );
}
