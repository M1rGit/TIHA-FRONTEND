import { useState, type FormEvent } from 'react'
import { uploadLecture } from '../../api/lectures'
import { ApiError } from '../../api/client'
import { Modal } from '../ui/Modal'
import { TagUploadPicker } from './TagUploadPicker'
import type { Tag } from '../../types/lectures'

interface Props {
  tags: Tag[]
  onClose: () => void
  onUploaded: () => void
}

export function UploadModal({ tags, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('private')
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  function toggleTag(id: number) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      await uploadLecture(file, { name, description, visibility, tags: selectedTags })
      onUploaded()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? JSON.stringify(err.body) : 'Не удалось загрузить файл')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal title="Загрузить файл" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Файл
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        </label>
        <label>
          Имя (необязательно)
          <input value={name} onChange={(e) => setName(e.target.value)} />
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
        <button type="submit" className="btn-save" disabled={uploading}>
          Загрузить
        </button>
      </form>
    </Modal>
  )
}
