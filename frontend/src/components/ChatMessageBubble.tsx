import type { Citation } from '../services/chat'

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[] | null
}

export default function ChatMessageBubble({ role, content, citations }: ChatMessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600 text-white'
            : 'border border-border bg-surface text-text'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {!isUser && citations && citations.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-medium text-text-muted">Sources</p>
            <ul className="mt-2 space-y-2">
              {citations.map((citation, index) => (
                <li key={`${citation.document_id}-${citation.chunk_index}-${index}`} className="text-xs">
                  <span className="font-medium text-brand-700">{citation.filename}</span>
                  {citation.page_number != null && (
                    <span className="text-text-muted"> · p.{citation.page_number}</span>
                  )}
                  {citation.score != null && (
                    <span className="text-text-muted">
                      {' '}
                      · {Math.round(citation.score * 100)}% match
                    </span>
                  )}
                  <p className="mt-0.5 text-text-muted line-clamp-2">{citation.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
