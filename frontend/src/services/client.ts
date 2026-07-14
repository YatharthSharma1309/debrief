export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function apiHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail.map((d: { msg: string }) => d.msg).join(', ')
    }
  } catch {
    // ignore
  }
  return 'Request failed'
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...apiHeaders(token),
      ...options.headers,
    },
  })
  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}
