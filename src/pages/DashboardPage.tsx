import { Nav } from '../components/ui/Nav'
import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  if (user?.role === 'rejected') {
    return (
      <main>
        <h1>Доступ отклонён</h1>
        <p>{user.about_user}</p>
        <p>Свяжитесь с администрацией, чтобы оспорить решение.</p>
        <button onClick={() => logout()}>Выйти</button>
      </main>
    )
  }

  if (user?.role === 'pending') {
    return (
      <main>
        <h1>Заявка на рассмотрении</h1>
        <p>Ожидайте подтверждения от администрации.</p>
        <button onClick={() => logout()}>Выйти</button>
      </main>
    )
  }

  return (
    <main>
      <Nav />
      <h1>Дэшборд</h1>
      <p>Привет, {user?.display_name}</p>
      <button onClick={() => logout()}>Выйти</button>
    </main>
  )
}
