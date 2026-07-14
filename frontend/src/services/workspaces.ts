import { apiRequest } from './client'

export interface Workspace {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceCreatePayload {
  name: string
  description?: string
}

export interface WorkspaceUpdatePayload {
  name?: string
  description?: string
}

export function listWorkspaces(token: string): Promise<Workspace[]> {
  return apiRequest('/workspaces', { method: 'GET' }, token)
}

export function getWorkspace(token: string, id: string): Promise<Workspace> {
  return apiRequest(`/workspaces/${id}`, { method: 'GET' }, token)
}

export function createWorkspace(token: string, payload: WorkspaceCreatePayload): Promise<Workspace> {
  return apiRequest('/workspaces', { method: 'POST', body: JSON.stringify(payload) }, token)
}

export function updateWorkspace(
  token: string,
  id: string,
  payload: WorkspaceUpdatePayload,
): Promise<Workspace> {
  return apiRequest(`/workspaces/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token)
}

export function deleteWorkspace(token: string, id: string): Promise<void> {
  return apiRequest(`/workspaces/${id}`, { method: 'DELETE' }, token)
}
