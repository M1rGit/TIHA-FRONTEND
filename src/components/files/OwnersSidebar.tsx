import { useEffect, useState } from 'react'
import { getUser } from '../../api/auth'

interface Props {
  ownerIds: number[]
  selected: number | null
  onToggle: (id: number) => void
}

export function OwnersSidebar({ ownerIds, selected, onToggle }: Props) {
  const [names, setNames] = useState<Record<number, string>>({})

  useEffect(() => {
    const missing = ownerIds.filter((id) => !(id in names))
    if (missing.length === 0) return
    Promise.all(
      missing.map((id) =>
        getUser(id)
          .then((u) => [id, u.display_name] as const)
          .catch(() => null),
      ),
    ).then((results) => {
      setNames((prev) => {
        const next = { ...prev }
        for (const r of results) if (r) next[r[0]] = r[1]
        return next
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerIds])

  if (ownerIds.length === 0) return null

  return (
    <aside className="files-owners">
      <h2>Авторы</h2>
      <ul>
        {ownerIds.map((id) => (
          <li key={id}>
            <button
              type="button"
              className={`owner-chip${selected === id ? ' active' : ''}`}
              onClick={() => onToggle(id)}
            >
              {names[id] ?? '…'}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
