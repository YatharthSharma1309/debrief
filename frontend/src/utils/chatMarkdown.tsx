import type { ReactNode } from 'react'

/** Inline markdown: **bold**, *italic*, `code`, [n] citation marks */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\d+\])/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index))
    }
    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-text">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[0.85em] text-text"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (/^\[\d+\]$/.test(token)) {
      nodes.push(
        <span
          key={key++}
          className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded bg-brand-50 px-1 text-[10px] font-semibold text-brand-700"
        >
          {token.slice(1, -1)}
        </span>,
      )
    } else {
      nodes.push(token)
    }
    last = match.index + token.length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/**
 * Lightweight chat markdown — paragraphs, bullets, numbered lists, inline marks.
 * Avoids raw ** leaking into the bubble during streaming.
 */
export function ChatMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''))
        i += 1
      }
      blocks.push(
        <ul key={key++} className="my-1.5 list-disc space-y-1 break-words pl-4">
          {items.map((item, idx) => (
            <li key={idx} className="break-words">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i += 1
      }
      blocks.push(
        <ol key={key++} className="my-1.5 list-decimal space-y-1 break-words pl-4">
          {items.map((item, idx) => (
            <li key={idx} className="break-words">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      )
      continue
    }

    const para: string[] = [trimmed]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim())
      i += 1
    }
    blocks.push(
      <p key={key++} className="my-1 break-words first:mt-0 last:mb-0">
        {renderInline(para.join(' '))}
      </p>,
    )
  }

  if (blocks.length === 0) {
    return <p className="whitespace-pre-wrap">{renderInline(content)}</p>
  }

  return <div className="space-y-0.5 break-words">{blocks}</div>
}
