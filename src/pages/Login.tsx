import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthError, login } from '../services/auth'

interface LoginProps {
  onSuccess: (token: string) => void
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      const token = await login({ email: email.trim(), password, admin })
      onSuccess(token)
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="ticket" aria-labelledby="login-title">
        <div className="ticket__stub">
          <span className="ticket__brand">HelpDesk</span>
          <p>Abra, acompanhe e conclua chamados em um só lugar.</p>
        </div>

        <form className="ticket__form" onSubmit={handleSubmit} noValidate>
          <h1 id="login-title">Entrar</h1>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="usuario@helpdesk.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="check">
            <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
            Entrar como administrador
          </label>

          {error && (
            <p className="msg msg--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
