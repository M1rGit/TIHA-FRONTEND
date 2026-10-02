import type { CSSProperties } from 'react'
import type { Lesson } from '../../types/schedule'

interface Props {
  lesson: Lesson
  onClick: () => void
}

function formatTime(iso: string) {
  return iso.slice(11, 16)
}

// ponytail: стабильный цвет по названию предмета — не рандом при каждом
// рендере, а детерминированный хэш строки, чтобы "Физкультура" всегда была
// одного цвета
function subjectColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360
  }
  return `hsl(${hash}, 65%, 55%)`
}

function isNow(startIso: string, endIso: string) {
  const now = Date.now()
  return now >= new Date(startIso).getTime() && now <= new Date(endIso).getTime()
}

export function LessonCard({ lesson, onClick }: Props) {
  const classes = ['lesson-card']
  if (lesson.type === 'remote') classes.push('lesson-card-remote')
  if (isNow(lesson.time_start, lesson.time_end)) classes.push('lesson-card-current')

  const style = { '--stripe-color': subjectColor(lesson.name) } as CSSProperties

  return (
    <div className={classes.join(' ')} style={style} onClick={onClick} role="button" tabIndex={0}>
      <div className="lesson-half">
        <span className="lesson-name">{lesson.name}</span>
        <span className="lesson-time">
          {formatTime(lesson.time_start)}–{formatTime(lesson.time_end)}
        </span>
      </div>
      <div className="lesson-half lesson-half-bottom">
        <span>Кабинет: {lesson.room ?? '—'}</span>
        <span>—</span>
      </div>
    </div>
  )
}
