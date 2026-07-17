import { apiRequest } from './client'

export type WorkspaceRole = 'editor' | 'viewer'

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  email: string
  full_name: string | null
  role: WorkspaceRole
  created_at: string
}

export function listMembers(token: string, workspaceId: string): Promise<WorkspaceMember[]> {
  return apiRequest(`/workspaces/${workspaceId}/members`, { method: 'GET' }, token)
}

export function inviteMember(
  token: string,
  workspaceId: string,
  email: string,
  role: WorkspaceRole = 'viewer',
): Promise<WorkspaceMember> {
  return apiRequest(
    `/workspaces/${workspaceId}/members`,
    { method: 'POST', body: JSON.stringify({ email, role }) },
    token,
  )
}

export function removeMember(
  token: string,
  workspaceId: string,
  memberId: string,
): Promise<void> {
  return apiRequest(`/workspaces/${workspaceId}/members/${memberId}`, { method: 'DELETE' }, token)
}
