export interface LectureListItem {
  id: number
  owner_id: number
  name: string
  description: string | null
  tags: number[]
  created_at: string
}

export interface LectureDetail extends LectureListItem {
  visibility: 'public' | 'private'
}

export type SortOrder = 'date_asc' | 'date_desc' | 'name_az' | 'name_za'

export interface Tag {
  id: number
  name: string
}
