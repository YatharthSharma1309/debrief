import { API_BASE_URL, parseApiError } from './client'

export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface Document {
  id: string
  workspace_id: string
  filename: string
  file_type: string
  file_size: number
  status: DocumentStatus
  error_message: string | null
  created_at: string
  updated_at: string
}

export async function listDocuments(token: string, workspaceId: string): Promise<Document[]> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(await parseApiError(response))
  return response.json()
}

export async function uploadDocument(
  token: string,
  workspaceId: string,
  file: File,
): Promise<Document> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!response.ok) throw new Error(await parseApiError(response))
  return response.json()
}

export async function deleteDocument(
  token: string,
  workspaceId: string,
  documentId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/documents/${documentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  if (!response.ok) throw new Error(await parseApiError(response))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
