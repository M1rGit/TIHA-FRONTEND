import { lectureDownloadUrl } from '../../api/lectures'
import type { LectureListItem } from '../../types/lectures'

interface Props {
  lecture: LectureListItem
  canEdit: boolean
  onEdit: () => void
}

export function FileCard({ lecture, canEdit, onEdit }: Props) {
  return (
    <a className="file-card" href={lectureDownloadUrl(lecture.id)}>
      {canEdit && (
        <button
          type="button"
          className="file-card-edit"
          aria-label="Редактировать"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onEdit()
          }}
        >
          ✎
        </button>
      )}
      <p className="file-card-name">{lecture.name}</p>
      {lecture.description && <p className="file-card-desc">{lecture.description}</p>}
    </a>
  )
}
