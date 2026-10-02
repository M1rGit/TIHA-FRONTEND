import type { Tag } from '../../types/lectures'

interface Props {
  tags: Tag[]
  selected: number[]
  onToggle: (id: number) => void
}

export function TagUploadPicker({ tags, selected, onToggle }: Props) {
  const selectedTags = tags.filter((t) => selected.includes(t.id))
  const availableTags = tags.filter((t) => !selected.includes(t.id))

  return (
    <div className="tag-upload-picker">
      <div className="tag-upload-row">
        {selectedTags.map((tag) => (
          <button key={tag.id} type="button" className="tag-chip tag-chip-white" onClick={() => onToggle(tag.id)}>
            {tag.name}
          </button>
        ))}
      </div>
      <div className="tag-upload-divider" />
      <div className="tag-upload-row">
        {availableTags.map((tag) => (
          <button key={tag.id} type="button" className="tag-chip" onClick={() => onToggle(tag.id)}>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
