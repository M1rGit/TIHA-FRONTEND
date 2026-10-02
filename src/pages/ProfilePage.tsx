import { useState } from 'react'
import { PrivacyModal } from '../components/profile/PrivacyModal'
import { SettingsModal } from '../components/profile/SettingsModal'
import { Nav } from '../components/ui/Nav'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [modal, setModal] = useState<'settings' | 'privacy' | null>(null)

  if (!user) return null

  const canEdit = user.role === 'user' || user.role === 'admin'

  return (
    <main>
      <Nav />
      <h1>Профиль</h1>
      <p className="profile-heading">
        {user.display_name} · {user.role}
      </p>
      <p className="profile-about">{user.about_user}</p>

      {canEdit && (
        <>
          <button onClick={() => setModal('settings')}>Настройки</button>
          <button onClick={() => setModal('privacy')}>Конфиденциальность</button>
        </>
      )}

      <button className="btn-danger" onClick={() => logout()}>
        Выйти
      </button>

      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
      {modal === 'privacy' && <PrivacyModal onClose={() => setModal(null)} />}
    </main>
  )
}
