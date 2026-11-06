import { useCallback, useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import { tokenStorage } from './services/auth'

export default function App() {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())

  const handleLogin = useCallback((newToken: string) => {
    tokenStorage.set(newToken)
    setToken(newToken)
  }, [])

  const handleLogout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
  }, [])

  return token ? (
    <Home token={token} onLogout={handleLogout} />
  ) : (
    <Login onSuccess={handleLogin} />
  )
}
