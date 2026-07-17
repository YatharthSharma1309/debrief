import { apiRequest } from './client'

export interface SearchHit {
  chunk_id: string
  document_id: string
  workspace_id: string
  workspace_name: string
  filename: string
  chunk_index: number
  page_number: number | null
  content: string
  score: number
}

export interface SearchResponse {
  query: string
  hits: SearchHit[]
}

export function searchWorkspaces(
  token: string,
  q: string,
  topK = 8,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q, top_k: String(topK) })
  return apiRequest(`/search?${params}`, { method: 'GET' }, token)
}
