import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { usePersistedSummary } from '../hooks/useSummary'
import {
  asAction,
  asDate,
  asDecision,
  asQuestion,
  asRisk,
  type WorkspaceSummary,
} from '../services/summary'
import type { Workspace } from '../services/workspaces'
import { documentStatusCounts } from './DocumentList'

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

function briefCounts(brief: WorkspaceSummary) {
  return {
    decisions: brief.key_decisions.length,
    questions: brief.open_questions.length,
    risks: brief.risks.length,
    dates: brief.important_dates.length,
    actions: brief.action_items.length,
  }
}

function briefPreviewLine(brief: WorkspaceSummary) {
  const decisions = brief.key_decisions.map(asDecision)
  const risks = brief.risks.map(asRisk)
  const questions = brief.open_questions.map(asQuestion)
  const first =
    decisions[0]?.text ||
    risks[0]?.text ||
    questions[0]?.text ||
    asAction(brief.action_items[0] ?? { text: '' }).text ||
    asDate(brief.important_dates[0] ?? { label: '' }).label
  return first || null
}

export default function WorkspaceCard({ workspace, onDelete, isDeleting }: WorkspaceCardProps) {
  const { data: documents } = useDocuments(workspace.id)
  const counts = documents ? documentStatusCounts(documents) : null
  const hasReady = (counts?.ready ?? 0) > 0
  const { data: brief } = usePersistedSummary(workspace.id, hasReady)
  const stats = brief ? briefCounts(brief) : null
  const preview = brief ? briefPreviewLine(brief) : null

  function handleDelete() {
    if (window.confirm(`Delete "${workspace.name}"? This cannot be undone.`)) {
      onDelete(workspace.id)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:border-brand-500/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/workspaces/${workspace.id}`}
            className="font-display text-lg font-semibold text-text hover:text-brand-700"
          >
            {workspace.name}
          </Link>
          {workspace.description ? (
            <p className="mt-1 text-sm text-text-muted line-clamp-2">{workspace.description}</p>
          ) : (
            <p className="mt-1 text-sm text-text-muted">No description yet</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            {counts ? (
              <>
                <span className="rounded-md border border-border px-2 py-0.5 text-text-muted">
                  {counts.total} doc{counts.total === 1 ? '' : 's'}
                </span>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                  {counts.ready} ready
                </span>
                {counts.processing > 0 && (
                  <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-sky-700 dark:text-sky-300">
                    {counts.processing} processing
                  </span>
                )}
                {counts.failed > 0 && (
                  <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-red-700 dark:text-red-300">
                    {counts.failed} failed
                  </span>
                )}
              </>
            ) : (
              <span className="rounded-md border border-border px-2 py-0.5 text-text-muted">Loading docs…</span>
            )}
            {brief ? (
              <span className="rounded-md border border-brand-500/30 bg-brand-600/10 px-2 py-0.5 text-brand-700">
                Brief saved
              </span>
            ) : hasReady ? (
              <span className="rounded-md border border-border px-2 py-0.5 text-text-muted">
                Brief not generated
              </span>
            ) : null}
          </div>

          {brief && (
            <div className="mt-3 rounded-lg border border-border/80 bg-surface-muted/40 px-3 py-2.5">
              {brief.overview && (
                <p className="text-xs leading-snug text-text line-clamp-2">{brief.overview}</p>
              )}
              {preview && (
                <p className="mt-1.5 text-[11px] text-text-muted line-clamp-1">
                  Latest signal: {preview}
                </p>
              )}
              {stats && (
                <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[10px]">
                  <span className="rounded border border-border/70 bg-surface px-1 py-1">
                    <span className="font-semibold text-brand-700">{stats.decisions}</span>
                    <span className="block text-text-muted">decisions</span>
                  </span>
                  <span className="rounded border border-border/70 bg-surface px-1 py-1">
                    <span className="font-semibold text-brand-700">{stats.questions}</span>
                    <span className="block text-text-muted">questions</span>
                  </span>
                  <span className="rounded border border-border/70 bg-surface px-1 py-1">
                    <span className="font-semibold text-brand-700">{stats.risks}</span>
                    <span className="block text-text-muted">risks</span>
                  </span>
                  <span className="rounded border border-border/70 bg-surface px-1 py-1">
                    <span className="font-semibold text-brand-700">{stats.actions}</span>
                    <span className="block text-text-muted">actions</span>
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-text-muted">
            Created {formatDate(workspace.created_at)} · Updated {formatDate(workspace.updated_at)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs text-text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
