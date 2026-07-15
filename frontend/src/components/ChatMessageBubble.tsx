import { useState } from 'react'
import type { Citation } from '../services/chat'

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[] | null
  createdAt?: string | null
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CitationItem({ citation, index }: { citation: Citation; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li className="rounded-md border border-border/80 bg-surface-muted/40 px-2.5 py-2 text-xs">
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="font-medium text-brand-700">[{index + 1}] {citation.filename}</span>
        {citation.page_number != null && (
          <span className="text-text-muted">p.{citation.page_number}</span>
        )}
        <span className="text-text-muted">chunk {citation.chunk_index}</span>
        {citation.score != null && (
          <span className="rounded bg-brand-600/10 px-1.5 py-0.5 font-medium text-brand-700">
            {Math.round(citation.score * 100)}% match
          </span>
        )}
      </div>
      <p className={`mt-1 text-text-muted ${expanded ? '' : 'line-clamp-2'}`}>{citation.excerpt}</p>
      {citation.excerpt.length > 120 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 font-medium text-brand-700 hover:underline"
        >
          {expanded ? 'Collapse excerpt' : 'Expand excerpt'}
        </button>
      )}
    </li>
  )
}

export default function ChatMessageBubble({
  role,
  content,
  citations,
  createdAt,
}: ChatMessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600 text-white'
            : 'border border-border bg-surface text-text'
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-wide opacity-70">
          <span>{isUser ? 'You' : 'Debrief'}</span>
          {createdAt && <span>{formatTime(createdAt)}</span>}
        </div>
        <p className="whitespace-pre-wrap">{content}</p>

        {!isUser && citations && citations.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-medium text-text-muted">
              Sources · {citations.length} citation{citations.length === 1 ? '' : 's'}
            </p>
            <ul className="mt-2 space-y-2">
              {citations.map((citation, index) => (
                <CitationItem
                  key={`${citation.document_id}-${citation.chunk_index}-${index}`}
                  citation={citation}
                  index={index}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
