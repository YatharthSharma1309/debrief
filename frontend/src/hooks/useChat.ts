import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createChatSession,
  listChatMessages,
  listChatSessions,
  streamChatMessage,
  type ChatMessage,
  type Citation,
  type StreamEvent,
} from '../services/chat'
import { useAuthStore } from '../stores/authStore'
import { useCallback, useState } from 'react'

export function useChatSessions(workspaceId: string) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['chat-sessions', workspaceId],
    queryFn: () => listChatSessions(token!, workspaceId),
    enabled: !!token && !!workspaceId,
  })
}

export function useCreateChatSession(workspaceId: string) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => createChatSession(token!, workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-sessions', workspaceId] }),
  })
}

export function useChatMessages(workspaceId: string, sessionId: string | null) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['chat-messages', workspaceId, sessionId],
    queryFn: () => listChatMessages(token!, workspaceId, sessionId!),
    enabled: !!token && !!workspaceId && !!sessionId,
  })
}

export function useStreamChat(workspaceId: string, sessionId: string | null) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingCitations, setStreamingCitations] = useState<Citation[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string, sessionIdOverride?: string) => {
      const sid = sessionIdOverride ?? sessionId
      if (!token || !sid) return

      setIsStreaming(true)
      setStreamingContent('')
      setStreamingCitations(null)
      setError(null)

      let accumulated = ''

      try {
        await streamChatMessage(token, workspaceId, sid, content, (event: StreamEvent) => {
          if (event.type === 'token') {
            accumulated += event.content
            setStreamingContent(accumulated)
          } else if (event.type === 'citations') {
            setStreamingCitations(event.citations)
          } else if (event.type === 'error') {
            setError(event.message)
          }
        })

        await queryClient.invalidateQueries({ queryKey: ['chat-messages', workspaceId, sid] })
        await queryClient.invalidateQueries({ queryKey: ['chat-sessions', workspaceId] })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
      } finally {
        setIsStreaming(false)
        setStreamingContent('')
        setStreamingCitations(null)
      }
    },
    [token, sessionId, workspaceId, queryClient],
  )

  return { sendMessage, isStreaming, streamingContent, streamingCitations, error }
}

export type { ChatMessage, Citation }
