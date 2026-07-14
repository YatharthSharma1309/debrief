import type { Document } from '../services/documents'
import { formatFileSize } from '../services/documents'

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const statusStyles: Record<Document['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
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

export default function DocumentList({ documents, onDelete, isDeleting }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <p className="text-sm text-text-muted">No documents yet</p>
        <p className="mt-1 text-xs text-text-muted">Upload a file to start building your knowledge base</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-text">{doc.filename}</p>
            <p className="mt-1 text-xs text-text-muted">
              {doc.file_type.toUpperCase()} · {formatFileSize(doc.file_size)} · {formatDate(doc.created_at)}
            </p>
            {doc.status === 'failed' && doc.error_message && (
              <p className="mt-2 text-xs text-red-600">{doc.error_message}</p>
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
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
