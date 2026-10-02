import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'
import type { Credentials, CurrentUser } from '../types/auth'

interface AuthContextValue {
  user: CurrentUser | null
  loading: boolean
  error: ApiError | null
  login: (credentials: Credentials) => Promise<void>
  register: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  async function refresh() {
    try {
      setUser(await authApi.getMe())
      setError(null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null)
      } else if (err instanceof ApiError) {
        setError(err)
      } else {
        throw err
      }
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  async function login(credentials: Credentials) {
    await authApi.login(credentials)
    await refresh()
  }

  async function register(credentials: Credentials) {
    await authApi.register(credentials)
    await refresh()
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
