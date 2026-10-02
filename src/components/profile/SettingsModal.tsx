import { useState, type FormEvent } from 'react'
import { updateMe } from '../../api/auth'
import { ApiError } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { Modal } from '../ui/Modal'

interface Props {
  onClose: () => void
}

export function SettingsModal({ onClose }: Props) {
  const { user, refresh } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name ?? '')
  const [aboutUser, setAboutUser] = useState(user?.about_user ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await updateMe({ display_name: displayName, about_user: aboutUser })
      await refresh()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? JSON.stringify(err.body) : 'Не удалось сохранить')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Настройки" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Имя
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </label>
        <label>
          Описание
          <textarea value={aboutUser} onChange={(e) => setAboutUser(e.target.value)} />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="btn-save" disabled={submitting}>
          Сохранить
        </button>
      </form>
    </Modal>
  )
}
