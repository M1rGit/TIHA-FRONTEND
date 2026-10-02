import { Link } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm'

export function RegisterPage() {
  return (
    <main>
      <h1>Регистрация</h1>
      <AuthForm mode="register" />
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </main>
  )
}
