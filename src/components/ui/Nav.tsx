import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/schedule', label: 'Расписание' },
  { to: '/files', label: 'Файлы' },
  { to: '/links', label: 'Ссылки' },
  { to: '/info', label: 'Информация' },
]

export function Nav() {
  return (
    <>
      <NavLink to="/" end className={({ isActive }) => `site-brand${isActive ? ' active' : ''}`}>
        TIHA
      </NavLink>
      <nav>
        {LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to="/profile"
        className={({ isActive }) => `profile-corner${isActive ? ' active' : ''}`}
      >
        Профиль
      </NavLink>
    </>
  )
}
