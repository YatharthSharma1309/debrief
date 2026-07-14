import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  generateWorkspaceSummary,
  getSuggestedQuestions,
  getWorkspaceSummary,
} from '../services/summary'
import { useAuthStore } from '../stores/authStore'

export function usePersistedSummary(workspaceId: string, hasReadyDocs: boolean) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['decision-brief', workspaceId],
    queryFn: async () => {
      try {
        return await getWorkspaceSummary(token!, workspaceId)
      } catch {
        return null
      }
    },
    enabled: !!token && !!workspaceId && hasReadyDocs,
  })
}

export function useGenerateSummary(workspaceId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateWorkspaceSummary(token!, workspaceId),
    onSuccess: (data) => {
      queryClient.setQueryData(['decision-brief', workspaceId], data)
      queryClient.invalidateQueries({ queryKey: ['suggested-questions', workspaceId] })
    },
  })
}

export function useSuggestedQuestions(workspaceId: string, hasReadyDocs: boolean) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['suggested-questions', workspaceId],
    queryFn: () => getSuggestedQuestions(token!, workspaceId),
    enabled: !!token && !!workspaceId && hasReadyDocs,
    staleTime: 5 * 60 * 1000,
  })
}
