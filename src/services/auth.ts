const API_URL: string = import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:5050'

const TOKEN_KEY = 'helpdesk_access_token'

export interface LoginPayload {
  email: string
  password: string
  /** true => autentica em `adm_users`; false => `users` */
  admin?: boolean
}

export interface Profile {
  id: number
  name: string
  email: string
  role: string
}

export class AuthError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

/** POST /auth -> devolve o access_token (JWT). */
export async function login({ email, password, admin }: LoginPayload): Promise<string> {
  const body: Record<string, unknown> = { email, password }
  if (admin) body.admin = true

  let response: Response
  try {
    response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new AuthError('Não foi possível conectar à API. Confira se o servidor está rodando.')
  }

  if (!response.ok) {
    // O JRS responde com unauthorizedStatusCode (403 neste projeto) para credenciais inválidas
    throw new AuthError('E-mail ou senha incorretos.', response.status)
  }

  const data = await response.json().catch(() => null)
  const token: unknown = data?.access_token
  if (typeof token !== 'string' || token.length === 0) {
    throw new AuthError('A API não retornou um access_token.', response.status)
  }
  return token
}

/** GET /me com Authorization: Bearer <token>. */
export async function getProfile(token: string): Promise<Profile> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new AuthError('Não foi possível conectar à API.')
  }
  if (!response.ok) {
    throw new AuthError('Sessão inválida ou expirada.', response.status)
  }
  return response.json()
}

/** Lê a data de expiração (claim `exp`) do JWT, só para exibição. */
export function getTokenExpiry(token: string): Date | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? new Date(exp * 1000) : null
  } catch {
    return null
  }
}

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}
