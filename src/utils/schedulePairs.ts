import type { Lesson } from '../types/schedule'

// Бэкенд может отдавать пару как два отдельных элемента (первая/вторая
// половина) — соседние, с одинаковым названием и end[i] === start[i+1].
// Находим границы всей пары, а не только текущей половины, чтобы окно
// выборки файлов накрывало обе половины + перемену после них.
export function getPairWindow(lessons: Lesson[], index: number): { start: string; end: string } {
  const lesson = lessons[index]
  const prev = lessons[index - 1]
  const next = lessons[index + 1]

  const isSecondHalf = prev && prev.name === lesson.name && prev.time_end === lesson.time_start
  const isFirstHalf = next && next.name === lesson.name && lesson.time_end === next.time_start

  const startIndex = isSecondHalf ? index - 1 : index
  const endIndex = isFirstHalf ? index + 1 : index

  return {
    start: lessons[startIndex].time_start,
    end: lessons[endIndex + 1]?.time_start ?? lessons[endIndex].time_end,
  }
}
