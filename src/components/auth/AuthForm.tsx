import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../api/client'

interface Props {
  mode: 'login' | 'register'
}

const ERROR_MESSAGES: Record<string, string> = {
  login_error: 'Логин уже занят',
  invalid_credentials: 'Неверный логин или пароль',
}

export function AuthForm({ mode }: Props) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [trustedDevice, setTrustedDevice] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const credentials = { login: loginValue, password, trusted_device: trustedDevice }
      if (mode === 'login') {
        await login(credentials)
      } else {
        await register(credentials)
      }
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError && typeof err.body === 'object' && err.body && 'status' in err.body) {
        const status = (err.body as { status: string }).status
        setError(ERROR_MESSAGES[status] ?? status)
      } else {
        setError('Не удалось выполнить запрос')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Логин
        <input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} required />
      </label>
      <label>
        Пароль
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="checkbox-field">
        <span>Доверенное устройство</span>
        <input
          type="checkbox"
          checked={trustedDevice}
          onChange={(e) => setTrustedDevice(e.target.checked)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  )
}
