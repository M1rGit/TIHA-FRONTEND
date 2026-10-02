export interface Lesson {
  name: string
  time_start: string
  time_end: string
  room: string | null
  type: 'remote' | 'collage'
  homework: string
}

export type Schedule = Record<string, Lesson[]>
