import type { Document } from '../services/documents'
import { formatFileSize } from '../services/documents'

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: string) => void
  isDeleting?: boolean
  highlightedDocumentId?: string | null
}

const statusStyles: Record<Document['status'], string> = {
  pending: 'border-border bg-surface text-text-muted',
  processing: 'border-sky-600/40 bg-surface text-sky-800 dark:border-sky-500/40 dark:text-sky-300',
  ready:
    'border-border bg-surface text-brand-700 dark:border-brand-500/40 dark:bg-brand-50 dark:text-brand-700',
  failed: 'border-red-500/40 bg-surface text-red-700 dark:text-red-400',
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
  const timeline = [...documents].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-md border border-border px-2 py-1 text-text-muted">
          {counts.total} total
        </span>
        <span className="rounded-md border border-border bg-surface px-2 py-1 font-medium text-brand-700">
          {counts.ready} ready
        </span>
        {counts.processing > 0 && (
          <span className="rounded-md border border-border bg-surface px-2 py-1 text-sky-800 dark:text-sky-300">
            {counts.processing} processing
          </span>
        )}
        {counts.failed > 0 && (
          <span className="rounded-md border border-border bg-surface px-2 py-1 text-red-700 dark:text-red-400">
            {counts.failed} failed
          </span>
        )}
      </div>

      {timeline.length > 1 && (
        <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Ingestion timeline
          </p>
          <ol className="mt-2 space-y-1.5 border-l border-border pl-3">
            {timeline.map((doc) => (
              <li key={`tl-${doc.id}`} className="relative text-xs text-text-muted">
                <span className="absolute -left-[0.85rem] top-1.5 size-1.5 rounded-full bg-brand-600" />
                <span className="font-medium text-text">{formatDate(doc.created_at)}</span>
                {' · '}
                <span className="text-text">{doc.filename}</span>
                {' · '}
                <span>{statusLabels[doc.status]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {documents.map((doc) => (
          <li
            key={doc.id}
            id={`doc-${doc.id}`}
            className={`flex min-w-0 flex-col gap-2 px-3 py-3.5 transition sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-4 ${
              highlightedDocumentId === doc.id
                ? 'bg-brand-600/10 ring-2 ring-inset ring-brand-500/50'
                : ''
            }`}
          >
            <div className="min-w-0">
              <p className="break-all font-medium text-text sm:truncate">{doc.filename}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                <span className="font-medium text-text">{doc.file_type.toUpperCase()}</span>
                {' · '}
                {formatFileSize(doc.file_size)}
              </p>
              <p className="text-[11px] text-text-muted">
                {formatDate(doc.created_at)}
                {doc.updated_at !== doc.created_at && <> · updated {formatDate(doc.updated_at)}</>}
              </p>
              {doc.status === 'failed' && doc.error_message && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{doc.error_message}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium sm:px-2.5 sm:text-xs ${statusStyles[doc.status]}`}
              >
                {statusLabels[doc.status]}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${doc.filename}"?`)) onDelete(doc.id)
                }}
                disabled={isDeleting}
                className="rounded-lg border border-transparent px-2 py-1 text-[11px] text-text-muted hover:border-red-200 hover:text-red-600 disabled:opacity-60 sm:border-border sm:px-2.5 sm:text-xs"
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
