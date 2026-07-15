import { useEffect, useRef, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ChatInput from './ChatInput'
import ChatMessageBubble from './ChatMessageBubble'
import {
  useChatMessages,
  useChatSessions,
  useCreateChatSession,
  useStreamChat,
} from '../hooks/useChat'
import { useSuggestedQuestions } from '../hooks/useSummary'

interface ChatPanelProps {
  workspaceId: string
  hasReadyDocs?: boolean
  pendingQuestion?: string | null
  onQuestionConsumed?: () => void
  hideSuggestedChips?: boolean
}

function formatSessionLabel(title: string | null, updatedAt: string) {
  const name = title?.trim() || 'New conversation'
  const date = new Date(updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  return `${name} · ${date}`
}

export default function ChatPanel({
  workspaceId,
  hasReadyDocs = false,
  pendingQuestion = null,
  onQuestionConsumed,
  hideSuggestedChips = false,
}: ChatPanelProps) {
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions(workspaceId)
  const createSession = useCreateChatSession(workspaceId)
  const { data: suggested } = useSuggestedQuestions(workspaceId, hasReadyDocs)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const { data: messages, isLoading: messagesLoading } = useChatMessages(
    workspaceId,
    activeSessionId,
  )
  const { sendMessage, isStreaming, streamingContent, streamingCitations, error } =
    useStreamChat(workspaceId, activeSessionId)

  const bottomRef = useRef<HTMLDivElement>(null)
  const showInlineSuggestions =
    !hideSuggestedChips &&
    !!suggested?.questions.length &&
    !isStreaming &&
    (!messages || messages.length === 0)

  useEffect(() => {
    if (!activeSessionId && sessions && sessions.length > 0) {
      setActiveSessionId(sessions[0].id)
    }
  }, [sessions, activeSessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  async function handleSuggestedQuestion(question: string) {
    let sid = activeSessionId
    if (!sid) {
      const session = await createSession.mutateAsync()
      sid = session.id
      setActiveSessionId(session.id)
    }
    await sendMessage(question, sid)
  }

  useEffect(() => {
    if (!pendingQuestion || isStreaming) return
    void (async () => {
      await handleSuggestedQuestion(pendingQuestion)
      onQuestionConsumed?.()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion])

  async function handleNewChat() {
    const session = await createSession.mutateAsync()
    setActiveSessionId(session.id)
  }

  return (
    <div className="flex min-h-[640px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm lg:min-h-[720px]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text">Ask about decisions</h2>
          <p className="text-xs text-text-muted">
            Streaming answers with source excerpts and relevance %
            {sessions && sessions.length > 0 ? ` · ${sessions.length} conversation${sessions.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sessions && sessions.length > 0 && (
            <select
              value={activeSessionId ?? ''}
              onChange={(e) => setActiveSessionId(e.target.value)}
              className="max-w-[180px] rounded-lg border border-border px-2 py-1.5 text-xs text-text outline-none"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {formatSessionLabel(session.title, session.updated_at)}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleNewChat}
            disabled={createSession.isPending}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-muted disabled:opacity-60"
          >
            New chat
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-surface-muted/50 p-4">
        {sessionsLoading && <LoadingSpinner label="Loading chat…" />}

        {!sessionsLoading && !activeSessionId && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="max-w-sm text-sm text-text-muted">
              Ask what was decided, why, who owns next steps, or what is still unresolved — answers cite your sources.
            </p>
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Ask about a decision
            </button>
            {showInlineSuggestions && (
              <div className="mt-2 flex max-w-md flex-wrap justify-center gap-2">
                {suggested!.questions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSuggestedQuestion(q)}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted hover:border-brand-500 hover:text-brand-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSessionId && messagesLoading && <LoadingSpinner label="Loading messages…" />}

        {messages?.map((message) => (
          <ChatMessageBubble
            key={message.id}
            role={message.role === 'user' ? 'user' : 'assistant'}
            content={message.content}
            citations={message.citations}
            createdAt={message.created_at}
          />
        ))}

        {isStreaming && streamingContent && (
          <ChatMessageBubble
            role="assistant"
            content={streamingContent}
            citations={streamingCitations}
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {showInlineSuggestions && activeSessionId && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggested!.questions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestedQuestion(q)}
                disabled={isStreaming}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted hover:border-brand-500 hover:text-brand-700"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={!activeSessionId || isStreaming}
        placeholder={
          activeSessionId
            ? 'Ask about pricing (₹), decisions, owners, risks…'
            : 'Create a chat to begin'
        }
      />
    </div>
  )
}
