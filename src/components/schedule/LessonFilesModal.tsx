import { useEffect, useState } from 'react'
import { listLectures } from '../../api/lectures'
import { ApiError } from '../../api/client'
import { FileCard } from '../files/FileCard'
import { Modal } from '../ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import type { Lesson } from '../../types/schedule'
import type { LectureListItem } from '../../types/lectures'

interface Props {
  lesson: Lesson
  windowStart: string
  windowEnd: string
  onClose: () => void
}

export function LessonFilesModal({ lesson, windowStart, windowEnd, onClose }: Props) {
  const { user } = useAuth()
  const [files, setFiles] = useState<LectureListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const from = new Date(windowStart).getTime()
    const to = new Date(windowEnd).getTime()

    listLectures({ user: user.id, count: 100 })
      .then((res) => {
        setFiles(
          res.lectures.filter((f) => {
            const created = new Date(f.created_at).getTime()
            return created >= from && created < to
          }),
        )
      })
      .catch((err) => setError(err instanceof ApiError ? JSON.stringify(err.body) : 'Не удалось загрузить файлы'))
  }, [windowStart, windowEnd, user])

  return (
    <Modal title={lesson.name} onClose={onClose}>
      {error && <p role="alert">{error}</p>}
      {files === null && !error && <p>Загрузка…</p>}
      {files !== null && files.length === 0 && <p>Файлов нет</p>}
      {files !== null && files.length > 0 && (
        <div className="cards-grid">
          {files.map((file) => (
            <FileCard key={file.id} lecture={file} canEdit={false} onEdit={() => {}} />
          ))}
        </div>
      )}
    </Modal>
  )
}
