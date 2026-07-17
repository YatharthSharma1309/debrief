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
    budget: brief.budget_items?.length ?? 0,
    assumptions: brief.assumptions?.length ?? 0,
    risks: brief.risks.length,
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
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:border-brand-500/40 sm:p-5">
      <Link
        to={`/workspaces/${workspace.id}`}
        className="block min-w-0 font-display text-lg font-semibold text-text hover:text-brand-700"
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
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-medium text-brand-700">
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
        <div className="mt-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
          {brief.overview && (
            <p className="text-xs leading-snug text-text line-clamp-2">{brief.overview}</p>
          )}
          {preview && (
            <p className="mt-1.5 text-[11px] text-text-muted line-clamp-1">
              Latest signal: {preview}
            </p>
          )}
          {stats && (
            <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[10px]">
              {(
                [
                  ['decisions', stats.decisions],
                  ['budget', stats.budget],
                  ['assumptions', stats.assumptions],
                  ['risks', stats.risks],
                ] as const
              ).map(([label, value]) => (
                <span
                  key={label}
                  className="min-w-0 rounded border border-border bg-surface px-1 py-1"
                >
                  <span className="font-semibold text-brand-700">{value}</span>
                  <span className="block truncate text-[9px] uppercase tracking-wide text-text-muted">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-text-muted">
        <p>
          Created {formatDate(workspace.created_at)} · Updated {formatDate(workspace.updated_at)}
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 text-text-muted hover:text-red-600 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
