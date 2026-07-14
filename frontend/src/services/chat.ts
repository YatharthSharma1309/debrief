import { API_BASE_URL, parseApiError } from './client'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Citation {
  document_id: string
  filename: string
  chunk_index: number
  page_number: number | null
  excerpt: string
  score?: number | null
}

export interface ChatSession {
  id: string
  workspace_id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: MessageRole
  content: string
  citations: Citation[] | null
  created_at: string
}

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'citations'; citations: Citation[] }
  | { type: 'done'; user_message_id: string; assistant_message_id: string }
  | { type: 'error'; message: string }

export async function listChatSessions(token: string, workspaceId: string): Promise<ChatSession[]> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/chat/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(await parseApiError(response))
  return response.json()
}

export async function createChatSession(token: string, workspaceId: string): Promise<ChatSession> {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/chat/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
  if (!response.ok) throw new Error(await parseApiError(response))
  return response.json()
}

export async function listChatMessages(
  token: string,
  workspaceId: string,
  sessionId: string,
): Promise<ChatMessage[]> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/chat/sessions/${sessionId}/messages`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!response.ok) throw new Error(await parseApiError(response))
  return response.json()
}

export async function streamChatMessage(
  token: string,
  workspaceId: string,
  sessionId: string,
  content: string,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/chat/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    },
  )

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Streaming not supported')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = JSON.parse(line.slice(6)) as StreamEvent
      onEvent(payload)
    }
  }
}
