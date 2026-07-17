import { useState } from 'react'
import type { Citation } from '../services/chat'
import { answerToMarkdown, copyText } from '../utils/exportMarkdown'
import { ChatMarkdown } from '../utils/chatMarkdown'

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
  const long = citation.excerpt.length > 100

  return (
    <li className="rounded-md border border-border bg-surface px-2.5 py-2 shadow-sm">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-brand-600 text-[10px] font-bold text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="truncate text-xs font-semibold text-text">{citation.filename}</span>
            {citation.page_number != null && (
              <span className="text-[10px] text-text-muted">p.{citation.page_number}</span>
            )}
            {citation.score != null && (
              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-brand-700">
                {Math.round(citation.score * 100)}%
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-[11px] leading-snug text-text-muted ${expanded ? '' : 'line-clamp-2'}`}
          >
            {citation.excerpt}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-[10px] font-medium text-brand-700 hover:underline"
            >
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

function SourcesBlock({ citations }: { citations: Citation[] }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface-muted">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          Sources · {citations.length}
        </span>
        <span className="text-[10px] text-text-muted">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <ul className="max-h-44 space-y-1.5 overflow-y-auto border-t border-border px-2 pb-2 pt-2">
          {citations.map((citation, index) => (
            <CitationItem
              key={`${citation.document_id}-${citation.chunk_index}-${index}`}
              citation={citation}
              index={index}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ChatMessageBubble({
  role,
  content,
  citations,
  createdAt,
}: ChatMessageBubbleProps) {
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const md = answerToMarkdown(content, citations)
    const ok = await copyText(md)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`flex min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'max-w-[85%] bg-brand-600 text-white'
            : 'w-full max-w-full border border-border bg-surface text-text'
        }`}
      >
        <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px] uppercase tracking-wide text-text-muted">
          <span className={isUser ? 'text-white/80' : ''}>{isUser ? 'You' : 'Debrief'}</span>
          <div className="flex items-center gap-2">
            {createdAt && <span className={isUser ? 'text-white/70' : ''}>{formatTime(createdAt)}</span>}
            {!isUser && content && (
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="normal-case tracking-normal text-brand-700 hover:underline"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        {isUser ? (
          <p className="break-words whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="min-w-0 break-words">
            <ChatMarkdown content={content} />
          </div>
        )}

        {!isUser && citations && citations.length > 0 && (
          <SourcesBlock citations={citations} />
        )}
      </div>
    </div>
  )
}
