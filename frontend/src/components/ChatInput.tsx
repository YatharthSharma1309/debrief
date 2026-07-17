import { type FormEvent, useState } from 'react'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({
  onSend,
  disabled,
  placeholder = 'Ask about pricing (₹), decisions, owners, risks…',
}: ChatInputProps) {
  const [content, setContent] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-border bg-surface p-3 sm:p-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !content.trim()}
        className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 sm:px-4"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  )
}
