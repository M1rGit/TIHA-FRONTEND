import { useEffect, useState, type FormEvent } from 'react'
import { listLectures, listTags } from '../api/lectures'
import { ApiError } from '../api/client'
import { EditLectureModal } from '../components/files/EditLectureModal'
import { FileCard } from '../components/files/FileCard'
import { OwnersSidebar } from '../components/files/OwnersSidebar'
import { TagFilter } from '../components/files/TagFilter'
import { UploadModal } from '../components/files/UploadModal'
import { Nav } from '../components/ui/Nav'
import { useAuth } from '../hooks/useAuth'
import type { LectureListItem, SortOrder, Tag } from '../types/lectures'
import { ErrorPage } from './ErrorPage'

const PAGE_SIZE = 10

const SORT_LABELS: Record<SortOrder, string> = {
  date_desc: 'Сначала новые',
  date_asc: 'Сначала старые',
  name_az: 'Имя А→Я',
  name_za: 'Имя Я→А',
}

export function FilesPage() {
  const { user } = useAuth()
  const [lectures, setLectures] = useState<LectureListItem[] | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState<ApiError | null>(null)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('date_desc')
  const [tagFilter, setTagFilter] = useState<number[]>([])
  const [userFilter, setUserFilter] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)

  const [uploadOpen, setUploadOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  async function refreshList() {
    try {
      const res = await listLectures({
        count: PAGE_SIZE,
        offset,
        sort,
        search: search || undefined,
        tags: tagFilter,
        user: userFilter ?? undefined,
      })
      setLectures(res.lectures)
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, String(err)))
    }
  }

  useEffect(() => {
    refreshList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, sort, tagFilter, userFilter])

  useEffect(() => {
    listTags()
      .then((res) => setTags(res.tags))
      .catch((err) => setError(err instanceof ApiError ? err : new ApiError(0, String(err))))
  }, [])

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    setOffset(0)
    refreshList()
  }

  function toggleFilterTag(id: number) {
    setOffset(0)
    setTagFilter((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  function toggleFilterUser(id: number) {
    setOffset(0)
    setUserFilter((prev) => (prev === id ? null : id))
  }

  if (error) return <ErrorPage status={error.status} body={error.body} />

  const ownerIds = [...new Set((lectures ?? []).map((l) => l.owner_id))]

  return (
    <main className="files-page">
      <Nav />
      <h1>Файлы</h1>

      <div className="files-grid">
        <OwnersSidebar ownerIds={ownerIds} selected={userFilter} onToggle={toggleFilterUser} />

        <section className="files-main">
          <form className="files-toolbar" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Поиск…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOrder)
                setOffset(0)
              }}
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button type="button" className="btn-save" onClick={() => setUploadOpen(true)}>
              Загрузить
            </button>
          </form>

          <TagFilter tags={tags} selected={tagFilter} onToggle={toggleFilterTag} />

          {lectures?.length === 0 ? (
            <p>Ничего не найдено</p>
          ) : (
            <div className="cards-grid">
              {lectures?.map((lecture) => (
                <FileCard
                  key={lecture.id}
                  lecture={lecture}
                  canEdit={lecture.owner_id === user?.id}
                  onEdit={() => setEditingId(lecture.id)}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              type="button"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              Назад
            </button>
            <button
              type="button"
              disabled={(lectures?.length ?? 0) < PAGE_SIZE}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Дальше
            </button>
          </div>
        </section>
      </div>

      {uploadOpen && (
        <UploadModal tags={tags} onClose={() => setUploadOpen(false)} onUploaded={refreshList} />
      )}
      {editingId !== null && (
        <EditLectureModal
          lectureId={editingId}
          tags={tags}
          onClose={() => setEditingId(null)}
          onSaved={refreshList}
          onDeleted={refreshList}
        />
      )}
    </main>
  )
}
