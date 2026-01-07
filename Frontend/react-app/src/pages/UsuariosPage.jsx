import { useEffect, useState } from 'react'
import { fetcher } from '../services/api'

export default function UsuariosPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetcher('/usuarios')
      .then((res) => { if (mounted) { setData(res); } })
      .catch((err) => setError(err.message || 'Erro ao carregar'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <p>Carregando usuários...</p>
  if (error) return <p>Erro: {error}</p>

  return (
    <section>
      <h2>Usuários</h2>
      {data.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {data.map((u) => (
            <li key={u._id}>
              <strong>{u.nome}</strong> — {u.email} — idade: {u.idade}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
