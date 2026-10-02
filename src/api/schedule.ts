import { API_BASE_URL, apiRequest } from './client'
import type { Schedule } from '../types/schedule'

export function getSchedule(start: string, end: string) {
  return apiRequest<Schedule>(`/schedule?start=${start}&end=${end}`)
}

export function scheduleDownloadUrl(start: string, end: string) {
  return `${API_BASE_URL}/schedule/download?start=${start}&end=${end}`
}
