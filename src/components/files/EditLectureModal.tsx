import { useEffect, useState, type FormEvent } from 'react'
import { deleteLecture, getLecture, updateLecture } from '../../api/lectures'
import { ApiError } from '../../api/client'
import { Modal } from '../ui/Modal'
import { TagUploadPicker } from './TagUploadPicker'
import type { Tag } from '../../types/lectures'

interface Props {
  lectureId: number
  tags: Tag[]
  onClose: () => void
  onSaved: () => void
  onDeleted: () => void
}

export function EditLectureModal({ lectureId, tags, onClose, onSaved, onDeleted }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('private')
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLecture(lectureId).then((detail) => {
      setName(detail.name)
      setDescription(detail.description ?? '')
      setVisibility(detail.visibility)
      setSelectedTags(detail.tags)
      setLoaded(true)
    })
  }, [lectureId])

  function toggleTag(id: number) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await updateLecture(lectureId, {
        name,
        description: description || null,
        visibility,
        tags: selectedTags,
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? JSON.stringify(err.body) : 'Не удалось сохранить')
    }
  }

  async function handleDelete() {
    await deleteLecture(lectureId)
    onDeleted()
    onClose()
  }

  if (!loaded) {
    return (
      <Modal title="Редактирование" onClose={onClose}>
        <p>Загрузка…</p>
      </Modal>
    )
  }

  return (
    <Modal title="Редактирование" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Имя
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Описание
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Видимость
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}>
            <option value="private">Приватный</option>
            <option value="public">Публичный</option>
          </select>
        </label>
        <TagUploadPicker tags={tags} selected={selectedTags} onToggle={toggleTag} />
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="btn-save">
          Сохранить
        </button>
        <button type="button" className="btn-danger" onClick={handleDelete}>
          Удалить файл
        </button>
      </form>
    </Modal>
  )
}
