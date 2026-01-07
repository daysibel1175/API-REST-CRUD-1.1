import { useEffect, useState } from "react";
import { fetcher } from "../services/api";

export default function GruposPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetcher("/grupos")
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

  if (loading) return <p>Carregando grupos...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <section>
      <h2>Grupos</h2>
      {data.length === 0 ? (
        <p>Nenhum grupo encontrado.</p>
      ) : (
        <ul>
          {data.map((g) => (
            <li key={g._id}>
              <strong>Familiar:</strong> {g.familiar ? "Sim" : "Não"}
              {g.guia ? ` — Guia: ${g.guia.nome || g.guia}` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
