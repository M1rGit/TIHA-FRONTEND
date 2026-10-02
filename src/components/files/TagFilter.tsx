import type { Tag } from '../../types/lectures'

interface Props {
  tags: Tag[]
  selected: number[]
  onToggle: (id: number) => void
}

export function TagFilter({ tags, selected, onToggle }: Props) {
  const selectedTags = tags.filter((t) => selected.includes(t.id))
  const availableTags = tags.filter((t) => !selected.includes(t.id))

  return (
    <div className="tag-filter">
      <div className="tag-filter-side">
        {selectedTags.map((tag) => (
          <button key={tag.id} type="button" className="tag-chip active" onClick={() => onToggle(tag.id)}>
            {tag.name}
          </button>
        ))}
      </div>
      <div className="tag-filter-divider" />
      <div className="tag-filter-side">
        {availableTags.map((tag) => (
          <button key={tag.id} type="button" className="tag-chip" onClick={() => onToggle(tag.id)}>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
