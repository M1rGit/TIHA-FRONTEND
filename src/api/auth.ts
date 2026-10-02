import { apiRequest } from './client'
import type { Credentials, CurrentUser, PublicUser, Session } from '../types/auth'

export function register(credentials: Credentials) {
  return apiRequest<{ status: 'success' }>('/auth/register', {
    method: 'POST',
    body: credentials,
  })
}

export function login(credentials: Credentials) {
  return apiRequest<{ status: 'success' }>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function getSessions() {
  return apiRequest<{ sessions: Session[] }>('/auth/sessions')
}

export function logout() {
  return apiRequest<void>('/auth/sessions', { method: 'DELETE' })
}

export function revokeSession(id: number) {
  return apiRequest<void>(`/auth/sessions/${id}`, { method: 'DELETE' })
}

export function changePassword(old_password: string, new_password: string) {
  return apiRequest<void>('/auth/password', {
    method: 'PATCH',
    body: { old_password, new_password },
  })
}

export function getUser(id: number) {
  return apiRequest<PublicUser>(`/auth/user/${id}`)
}

export function getMe() {
  return apiRequest<CurrentUser>('/auth/me')
}

export function updateMe(data: Partial<Pick<CurrentUser, 'display_name' | 'about_user'>>) {
  return apiRequest<CurrentUser>('/auth/me', {
    method: 'PATCH',
    body: { data },
  })
}
