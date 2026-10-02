import { Link } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm'

export function LoginPage() {
  return (
    <main>
      <h1>Вход</h1>
      <AuthForm mode="login" />
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </main>
  )
}
