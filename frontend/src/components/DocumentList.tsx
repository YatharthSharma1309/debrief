import type { Document } from '../services/documents'
import { formatFileSize } from '../services/documents'

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: string) => void
  isDeleting?: boolean
  highlightedDocumentId?: string | null
}

const statusStyles: Record<Document['status'], string> = {
  pending: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  processing: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  ready: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  failed: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
}

const statusLabels: Record<Document['status'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function documentStatusCounts(documents: Document[]) {
  return {
    total: documents.length,
    ready: documents.filter((d) => d.status === 'ready').length,
    processing: documents.filter((d) => d.status === 'pending' || d.status === 'processing').length,
    failed: documents.filter((d) => d.status === 'failed').length,
  }
}

export default function DocumentList({
  documents,
  onDelete,
  isDeleting,
  highlightedDocumentId,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-sm text-text-muted">No documents yet</p>
        <p className="mt-1 text-xs text-text-muted">
          Upload PDF, DOCX, or TXT files to ground the Decision Brief and cited chat.
        </p>
      </div>
    )
  }

  const counts = documentStatusCounts(documents)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-md border border-border px-2 py-1 text-text-muted">
          {counts.total} total
        </span>
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-700 dark:text-emerald-300">
          {counts.ready} ready
        </span>
        {counts.processing > 0 && (
          <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-300">
            {counts.processing} processing
          </span>
        )}
        {counts.failed > 0 && (
          <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-700 dark:text-red-300">
            {counts.failed} failed
          </span>
        )}
      </div>

      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {documents.map((doc) => (
          <li
            key={doc.id}
            id={`doc-${doc.id}`}
            className={`flex items-start justify-between gap-4 px-4 py-3.5 transition ${
              highlightedDocumentId === doc.id
                ? 'bg-brand-600/10 ring-2 ring-inset ring-brand-500/50'
                : ''
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-text">{doc.filename}</p>
              <p className="mt-1 text-xs text-text-muted">
                {doc.file_type.toUpperCase()} · {formatFileSize(doc.file_size)} · uploaded{' '}
                {formatDate(doc.created_at)}
                {doc.updated_at !== doc.created_at && (
                  <> · updated {formatDate(doc.updated_at)}</>
                )}
              </p>
              {doc.status === 'failed' && doc.error_message && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{doc.error_message}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[doc.status]}`}
              >
                {statusLabels[doc.status]}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${doc.filename}"?`)) onDelete(doc.id)
                }}
                disabled={isDeleting}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
