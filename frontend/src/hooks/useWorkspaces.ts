import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspace,
  deleteWorkspace,
  listWorkspaces,
  type WorkspaceCreatePayload,
  updateWorkspace,
  type WorkspaceUpdatePayload,
} from '../services/workspaces'
import { useAuthStore } from '../stores/authStore'

export function useWorkspaces() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => listWorkspaces(token!),
    enabled: !!token,
  })
}

export function useCreateWorkspace() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WorkspaceCreatePayload) => createWorkspace(token!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}

export function useUpdateWorkspace(workspaceId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WorkspaceUpdatePayload) => updateWorkspace(token!, workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] })
    },
  })
}

export function useDeleteWorkspace() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(token!, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}
