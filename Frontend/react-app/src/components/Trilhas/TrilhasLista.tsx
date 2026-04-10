import { memo } from "react";
import Button from "../../components/Button";
import { Trilha } from "../../types";

type TrilhasListaProps = {
  trilhas: Trilha[];
  onEdit: (trilha: Trilha) => void;
  onDelete: (id: string) => void;
};

function TrilhasLista({ trilhas, onEdit, onDelete }: TrilhasListaProps) {
  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {trilhas.map((t) => (
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
                  style={{
                    margin: "0.25rem 0",
                    color: "var(--color-muted)",
                  }}
                >
                  <strong>Localización:</strong> {t.localizacao}
                </p>
              )}
              {t.duracao && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "var(--color-muted)",
                  }}
                >
                  <strong>Duración:</strong> {t.duracao}
                </p>
              )}
              {(t as any).km_camino && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "var(--color-muted)",
                  }}
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
                <Button onClick={() => onEdit(t)} style={{ flex: 1 }}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(t._id)}
                  style={{ flex: 1 }}
                >
                  Deletar
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
// memorizando la lista de trilhas con memo para evitar renders innecesarios cuando las props no cambian
const TrilhaListaMemo = memo(TrilhasLista);
export default TrilhaListaMemo;
