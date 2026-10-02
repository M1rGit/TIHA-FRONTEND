export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.status = status
    this.body = body
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown | FormData
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isForm = options.body instanceof FormData
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    // FormData sets its own multipart Content-Type (with boundary) — never set it manually
    headers: options.body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: isForm ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const data = await res.json().catch(() => undefined)

  if (!res.ok) {
    // FastAPI wraps every HTTPException body as { detail: ... }
    const body = data && typeof data === 'object' && 'detail' in data ? data.detail : data
    throw new ApiError(res.status, body)
  }

  return data as T
}
