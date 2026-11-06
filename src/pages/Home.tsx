import { useEffect, useState } from 'react'
import { AuthError, getProfile, getTokenExpiry } from '../services/auth'
import type { Profile } from '../services/auth'

interface HomeProps {
  token: string
  onLogout: () => void
}

export default function Home({ token, onLogout }: HomeProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [warning, setWarning] = useState('')
  const expiry = getTokenExpiry(token)

  useEffect(() => {
    let active = true
    getProfile(token)
      .then((data) => active && setProfile(data))
      .catch((err) => {
        if (!active) return
        // Token inválido ou expirado: volta ao login. Falha de rede apenas avisa.
        if (err instanceof AuthError && err.status) onLogout()
        else setWarning('Não foi possível carregar o perfil agora.')
      })
    return () => {
      active = false
    }
  }, [token, onLogout])

  return (
    <main className="page">
      <section className="ticket ticket--single">
        <div className="ticket__form">
          <h1>Login realizado</h1>

          {profile && (
            <p className="subtitle">
              Olá, <strong>{profile.name}</strong> ({profile.role})
            </p>
          )}
          {warning && <p className="msg msg--error">{warning}</p>}

          <label htmlFor="token">access_token</label>
          <textarea id="token" className="token" readOnly value={token} rows={6} />

          {expiry && <p className="hint">Expira em {expiry.toLocaleString('pt-BR')}</p>}

          <button type="button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </section>
    </main>
  )
}
