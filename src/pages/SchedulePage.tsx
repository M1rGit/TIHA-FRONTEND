import { useEffect, useState } from 'react'
import { getSchedule, scheduleDownloadUrl } from '../api/schedule'
import { ApiError } from '../api/client'
import { LessonCard } from '../components/schedule/LessonCard'
import { LessonFilesModal } from '../components/schedule/LessonFilesModal'
import { Nav } from '../components/ui/Nav'
import type { Lesson, Schedule } from '../types/schedule'
import { getPairWindow } from '../utils/schedulePairs'
import { ErrorPage } from './ErrorPage'

const WEEKDAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseISODate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function mondayOf(d: Date) {
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return monday
}

export function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()))
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)
  const [openLesson, setOpenLesson] = useState<{ lesson: Lesson; windowStart: string; windowEnd: string } | null>(
    null,
  )

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 4)
  const start = toISODate(weekStart)
  const end = toISODate(weekEnd)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getSchedule(start, end)
      .then((res) => {
        setSchedule(res)
        const dates = Object.keys(res).sort()
        const todayIso = toISODate(new Date())
        setSelectedDate(dates.includes(todayIso) ? todayIso : (dates[0] ?? null))
      })
      .catch((err) => setError(err instanceof ApiError ? err : new ApiError(0, String(err))))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end])

  if (error) return <ErrorPage status={error.status} body={error.body} />

  const dates = schedule ? Object.keys(schedule).sort() : []
  const lessons = selectedDate && schedule ? (schedule[selectedDate] ?? []) : []

  function shiftWeek(days: number) {
    const next = new Date(weekStart)
    next.setDate(weekStart.getDate() + days)
    setWeekStart(next)
  }

  return (
    <main>
      <Nav />
      <h1>Расписание</h1>

      <div className="schedule-week-nav">
        <button type="button" className="schedule-arrow" onClick={() => shiftWeek(-7)} aria-label="Предыдущая неделя">
          ‹
        </button>
        <div className="schedule-days">
          {dates.map((date) => {
            const d = parseISODate(date)
            return (
              <button
                key={date}
                type="button"
                className={`schedule-day${date === selectedDate ? ' active' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="schedule-day-num">{d.getDate()}</span>
                <span className="schedule-day-name">{WEEKDAY_NAMES[d.getDay()]}</span>
              </button>
            )
          })}
        </div>
        <button type="button" className="schedule-arrow" onClick={() => shiftWeek(7)} aria-label="Следующая неделя">
          ›
        </button>
      </div>

      {loading && <p>Загрузка…</p>}
      {!loading && dates.length === 0 && <p>На этой неделе расписания нет</p>}

      {!loading && selectedDate && (
        <div className="lesson-list schedule-lessons">
          {lessons.map((lesson, i) => (
            <LessonCard
              key={i}
              lesson={lesson}
              onClick={() => {
                const { start, end } = getPairWindow(lessons, i)
                setOpenLesson({ lesson, windowStart: start, windowEnd: end })
              }}
            />
          ))}
        </div>
      )}

      <a className="btn-save" href={scheduleDownloadUrl(start, end)}>
        Скачать PDF (неделя)
      </a>

      {openLesson && (
        <LessonFilesModal
          lesson={openLesson.lesson}
          windowStart={openLesson.windowStart}
          windowEnd={openLesson.windowEnd}
          onClose={() => setOpenLesson(null)}
        />
      )}
    </main>
  )
}
