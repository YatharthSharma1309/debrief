import { useWorkspaceSummary } from '../hooks/useSummary'
import type { WorkspaceSummary } from '../services/summary'

interface WorkspaceSummaryCardProps {
  workspaceId: string
  hasReadyDocs: boolean
}

function SummarySection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-text">
            - {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SummaryContent({ summary }: { summary: WorkspaceSummary }) {
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
        <SummarySection title="Questions you can ask" items={summary.suggested_questions} />
      )}
    </div>
  )
}

export default function WorkspaceSummaryCard({ workspaceId, hasReadyDocs }: WorkspaceSummaryCardProps) {
  const generateSummary = useWorkspaceSummary(workspaceId)

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
        </div>
        <button
          type="button"
          onClick={() => generateSummary.mutate()}
          disabled={generateSummary.isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {generateSummary.isPending ? 'Generating...' : 'Generate brief'}
        </button>
      </div>

      {generateSummary.error && (
        <p className="mt-3 text-sm text-red-600">
          {generateSummary.error instanceof Error
            ? generateSummary.error.message
            : 'Failed to generate summary'}
        </p>
      )}

      {generateSummary.data && <SummaryContent summary={generateSummary.data} />}
    </div>
  )
}
