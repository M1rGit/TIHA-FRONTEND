import { API_BASE_URL, apiRequest } from './client'
import type { LectureDetail, LectureListItem, SortOrder, Tag } from '../types/lectures'

export interface ListLecturesParams {
  count?: number
  offset?: number
  sort?: SortOrder
  tags?: number[]
  search?: string
  user?: number
}

export function listLectures(params: ListLecturesParams = {}) {
  const q = new URLSearchParams()
  if (params.count !== undefined) q.set('count', String(params.count))
  if (params.offset !== undefined) q.set('offset', String(params.offset))
  if (params.sort) q.set('sort', params.sort)
  if (params.search) q.set('search', params.search)
  if (params.user !== undefined) q.set('user', String(params.user))
  for (const tagId of params.tags ?? []) q.append('tag', String(tagId))
  const qs = q.toString()
  return apiRequest<{ lectures: LectureListItem[] }>(`/lectures/${qs ? `?${qs}` : ''}`)
}

export function listTags() {
  return apiRequest<{ tags: Tag[] }>('/lectures/tags/')
}

export function getLecture(id: number) {
  return apiRequest<LectureDetail>(`/lectures/${id}`)
}

interface UpdateOptions {
  name: string
  description: string | null
  visibility: 'public' | 'private'
  tags: number[]
}

export function updateLecture(id: number, body: UpdateOptions) {
  return apiRequest<LectureDetail>(`/lectures/${id}`, { method: 'PATCH', body })
}

interface UploadOptions {
  name?: string
  description?: string
  visibility: 'public' | 'private'
  tags: number[]
}

export function uploadLecture(file: File, options: UploadOptions) {
  const form = new FormData()
  form.append('file', file)
  if (options.name) form.append('name', options.name)
  if (options.description) form.append('description', options.description)
  form.append('visibility', options.visibility)
  for (const tagId of options.tags) form.append('tags', String(tagId))

  return apiRequest<LectureListItem>('/lectures/upload/', { method: 'POST', body: form })
}

export function deleteLecture(id: number) {
  return apiRequest<void>(`/lectures/${id}`, { method: 'DELETE' })
}

export function lectureDownloadUrl(id: number) {
  return `${API_BASE_URL}/lectures/download/${id}`
}
