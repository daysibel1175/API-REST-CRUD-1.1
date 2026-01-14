import { useEffect, useState } from 'react'
import { fetcher } from '../services/api'

export default function TrilhasPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetcher('/trilhas')
      .then((res) => { if (mounted) { setData(res); } })
      .catch((err) => setError(err.message || 'Erro ao carregar'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <p>Carregando trilhas...</p>
  if (error) return <p>Erro: {error}</p>

  return (
    <section>
      <h2>Trilhas</h2>
      {data.length === 0 ? (
        <p>Nenhuma trilha encontrada.</p>
      ) : (
        <ul>
          {data.map((t) => (
            <li key={t._id}>
              <strong>{t.nome}</strong> — {t.tipo_de_trilha}
              {t.localizacao ? ` — ${t.localizacao}` : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
