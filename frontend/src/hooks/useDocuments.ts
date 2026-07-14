import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDocument, listDocuments, uploadDocument } from '../services/documents'
import { useAuthStore } from '../stores/authStore'

export function useDocuments(workspaceId: string) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: () => listDocuments(token!, workspaceId),
    enabled: !!token && !!workspaceId,
    refetchInterval: (query) => {
      const docs = query.state.data
      if (!docs) return false
      const processing = docs.some((d) => d.status === 'pending' || d.status === 'processing')
      return processing ? 3000 : false
    },
  })
}

export function useUploadDocument(workspaceId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadDocument(token!, workspaceId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] }),
  })
}

export function useDeleteDocument(workspaceId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(token!, workspaceId, documentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] }),
  })
}
