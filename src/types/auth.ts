export type UserRole = 'pending' | 'rejected' | 'user' | 'admin'

export interface CurrentUser {
  id: number
  display_name: string
  about_user: string
  role: UserRole
}

export interface PublicUser {
  id: number
  display_name: string
  about_user: string
  role: 'user' | 'admin'
}

export interface Session {
  id: number
  created_at: string
  trusted: boolean
  session_description: string | null
  current: boolean
}

export interface Credentials {
  login: string
  password: string
  trusted_device: boolean
}
