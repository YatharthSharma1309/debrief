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

function formatSessionLabel(title: string | null, updatedAt: string, compact = false) {
  const name = title?.trim() || 'New chat'
  const date = new Date(updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  if (compact) return name.length > 28 ? `${name.slice(0, 28)}…` : name
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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
    <div className="flex w-full min-w-0 flex-col rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex shrink-0 flex-col gap-2 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text">Ask about decisions</h2>
          <p className="text-xs text-text-muted">
            Cited answers from your docs
            {sessions && sessions.length > 0 ? ` · ${sessions.length} chat${sessions.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <div className="flex min-w-0 items-stretch gap-2 sm:items-center">
          {sessions && sessions.length > 0 && (
            <select
              value={activeSessionId ?? ''}
              onChange={(e) => setActiveSessionId(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text outline-none sm:max-w-[200px] sm:flex-none"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {formatSessionLabel(session.title, session.updated_at, true)}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleNewChat}
            disabled={createSession.isPending}
            className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text hover:bg-surface-muted disabled:opacity-60 sm:px-3"
            title="New chat"
          >
            <span className="text-xs">New chat</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 bg-surface-muted p-3 sm:p-4">
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
