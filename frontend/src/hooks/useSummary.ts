import { useMutation, useQuery } from '@tanstack/react-query'
import { generateWorkspaceSummary, getSuggestedQuestions } from '../services/summary'
import { useAuthStore } from '../stores/authStore'

export function useWorkspaceSummary(workspaceId: string) {
  const token = useAuthStore((s) => s.token)

  return useMutation({
    mutationFn: () => generateWorkspaceSummary(token!, workspaceId),
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
