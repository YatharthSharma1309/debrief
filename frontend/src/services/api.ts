const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`)
  if (!response.ok) {
    throw new Error('API health check failed')
  }
  return response.json()
}
