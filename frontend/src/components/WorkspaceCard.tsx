import { Link } from 'react-router-dom'
import type { Workspace } from '../services/workspaces'

interface WorkspaceCardProps {
  workspace: Workspace
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function WorkspaceCard({ workspace, onDelete, isDeleting }: WorkspaceCardProps) {
  function handleDelete() {
    if (window.confirm(`Delete "${workspace.name}"? This cannot be undone.`)) {
      onDelete(workspace.id)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/workspaces/${workspace.id}`}
            className="text-lg font-semibold text-text hover:text-brand-700"
          >
            {workspace.name}
          </Link>
          {workspace.description && (
            <p className="mt-1 text-sm text-text-muted line-clamp-2">{workspace.description}</p>
          )}
          <p className="mt-3 text-xs text-text-muted">Updated {formatDate(workspace.updated_at)}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs text-text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
