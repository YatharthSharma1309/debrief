import { apiRequest } from './client'

export interface WorkspaceSummary {
  overview: string
  key_decisions: string[]
  open_questions: string[]
  risks: string[]
  important_dates: string[]
  action_items: string[]
  suggested_questions: string[]
  generated_at?: string | null
}

export function getWorkspaceSummary(
  token: string,
  workspaceId: string,
): Promise<WorkspaceSummary> {
  return apiRequest(`/workspaces/${workspaceId}/summary`, { method: 'GET' }, token)
}

export function generateWorkspaceSummary(
  token: string,
  workspaceId: string,
): Promise<WorkspaceSummary> {
  return apiRequest(`/workspaces/${workspaceId}/summary`, { method: 'POST' }, token)
}

export function getSuggestedQuestions(
  token: string,
  workspaceId: string,
): Promise<{ questions: string[] }> {
  return apiRequest(`/workspaces/${workspaceId}/suggested-questions`, { method: 'GET' }, token)
}
