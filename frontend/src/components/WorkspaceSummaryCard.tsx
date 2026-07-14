import { useGenerateSummary, usePersistedSummary } from '../hooks/useSummary'
import type { WorkspaceSummary } from '../services/summary'

interface WorkspaceSummaryCardProps {
  workspaceId: string
  hasReadyDocs: boolean
  onAskQuestion?: (question: string) => void
}

function SummarySection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-text">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SummaryContent({
  summary,
  onAskQuestion,
}: {
  summary: WorkspaceSummary
  onAskQuestion?: (question: string) => void
}) {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm leading-relaxed text-text">{summary.overview}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <SummarySection title="Key decisions" items={summary.key_decisions} />
        <SummarySection title="Open questions" items={summary.open_questions} />
        <SummarySection title="Risks and conflicts" items={summary.risks} />
        <SummarySection title="Important dates" items={summary.important_dates} />
        <SummarySection title="Action items" items={summary.action_items} />
      </div>
      {summary.suggested_questions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Questions you can ask
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.suggested_questions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onAskQuestion?.(question)}
                className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-left text-xs text-text hover:border-brand-500 hover:text-brand-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function WorkspaceSummaryCard({
  workspaceId,
  hasReadyDocs,
  onAskQuestion,
}: WorkspaceSummaryCardProps) {
  const { data: persisted, isLoading } = usePersistedSummary(workspaceId, hasReadyDocs)
  const generateSummary = useGenerateSummary(workspaceId)
  const summary = generateSummary.data ?? persisted

  if (!hasReadyDocs) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6">
        <h3 className="text-sm font-semibold text-text">Decision Brief</h3>
        <p className="mt-1 text-sm text-text-muted">
          Upload and process documents to generate cited decisions, risks, and next actions.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">Decision Brief</h3>
          <p className="mt-1 text-xs text-text-muted">
            Decisions, open questions, risks, dates, and action items across your documents
          </p>
          {summary?.generated_at && (
            <p className="mt-1 text-xs text-text-muted">
              Saved {new Date(summary.generated_at).toLocaleString()}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => generateSummary.mutate()}
          disabled={generateSummary.isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {generateSummary.isPending
            ? 'Generating…'
            : summary
              ? 'Regenerate brief'
              : 'Generate brief'}
        </button>
      </div>

      {isLoading && !summary && (
        <p className="mt-3 text-sm text-text-muted">Loading saved brief…</p>
      )}

      {generateSummary.error && (
        <p className="mt-3 text-sm text-red-600">
          {generateSummary.error instanceof Error
            ? generateSummary.error.message
            : 'Failed to generate summary'}
        </p>
      )}

      {summary && <SummaryContent summary={summary} onAskQuestion={onAskQuestion} />}
    </div>
  )
}
