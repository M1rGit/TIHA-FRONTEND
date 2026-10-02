import { useEffect, useState } from 'react'
import { getSessions, revokeSession } from '../../api/auth'
import { ApiError } from '../../api/client'
import type { Session } from '../../types/auth'
import { Modal } from '../ui/Modal'

interface Props {
  onClose: () => void
}

export function PrivacyModal({ onClose }: Props) {
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      const res = await getSessions()
      setSessions(res.sessions)
    } catch (err) {
      setError(err instanceof ApiError ? JSON.stringify(err.body) : 'Не удалось загрузить сессии')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleRevoke(id: number) {
    await revokeSession(id)
    await refresh()
  }

  return (
    <Modal title="Конфиденциальность" onClose={onClose}>
      {error && <p role="alert">{error}</p>}
      <ul>
        {sessions?.map((session) => (
          <li key={session.id}>
            <p>
              {session.session_description || 'Без описания'}
              {session.trusted && (
                <span title="Доверенное устройство" aria-label="Доверенное устройство">
                  {' '}
                  ✓
                </span>
              )}
              {session.current && ' · текущая сессия'}
            </p>
            <p>Вход: {new Date(session.created_at).toLocaleString('ru')}</p>
            {!session.current && <button onClick={() => handleRevoke(session.id)}>Отозвать</button>}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
