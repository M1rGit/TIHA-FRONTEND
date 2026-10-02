import { useEffect, useState } from 'react'
import { getLinks } from '../api/links'
import { ApiError } from '../api/client'
import { Nav } from '../components/ui/Nav'
import type { ResourceLink } from '../types/links'
import { ErrorPage } from './ErrorPage'

export function LinksPage() {
  const [links, setLinks] = useState<ResourceLink[] | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    getLinks()
      .then((res) => setLinks(res.links))
      .catch((err) => setError(err instanceof ApiError ? err : new ApiError(0, String(err))))
  }, [])

  if (error) return <ErrorPage status={error.status} body={error.body} />

  return (
    <main>
      <Nav />
      <h1>Ссылки</h1>
      {links === null ? (
        <p>Загрузка…</p>
      ) : (
        <div className="cards-grid">
          {links.map((link) => (
            <a key={link.id} className="file-card" href={link.link} target="_blank" rel="noreferrer">
              <p className="file-card-name">{link.name}</p>
              {link.description && <p className="file-card-desc">{link.description}</p>}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
