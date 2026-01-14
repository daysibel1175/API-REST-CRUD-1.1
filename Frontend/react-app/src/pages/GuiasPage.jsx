import { useEffect, useState } from 'react'
import { fetcher } from '../services/api'

export default function GuiasPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetcher('/guias')
      .then((res) => { if (mounted) { setData(res); } })
      .catch((err) => setError(err.message || 'Erro ao carregar'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <p>Carregando guias...</p>
  if (error) return <p>Erro: {error}</p>

  return (
    <section>
      <h2>Guias</h2>
      {data.length === 0 ? (
        <p>Nenhum guia encontrado.</p>
      ) : (
        <ul>
          {data.map((g) => (
            <li key={g._id}>
              <strong>{g.nome}</strong> — contato: {g.contato}
              {g.trilha ? ` — trilha: ${g.trilha.nome || g.trilha}` : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
