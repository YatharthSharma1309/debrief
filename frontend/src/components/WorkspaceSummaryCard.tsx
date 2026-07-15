import { useMemo, useState, type ReactNode } from 'react'
import { useGenerateSummary, usePersistedSummary } from '../hooks/useSummary'
import type { Document } from '../services/documents'
import {
  asAction,
  asDate,
  asDecision,
  asQuestion,
  asRisk,
  askPromptFromAction,
  askPromptFromDate,
  askPromptFromDecision,
  askPromptFromQuestion,
  askPromptFromRisk,
  type ActionItem,
  type BriefSource,
  type DateItem,
  type DecisionItem,
  type QuestionItem,
  type RiskItem,
  type WorkspaceSummary,
} from '../services/summary'

interface WorkspaceSummaryCardProps {
  workspaceId: string
  hasReadyDocs: boolean
  readyDocCount?: number
  documents?: Document[]
  onAskQuestion?: (question: string) => void
  onJumpToDocument?: (documentId: string) => void
}

function formatSavedAt(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SourceChips({
  sources,
  documents,
  onJumpToDocument,
}: {
  sources?: BriefSource[]
  documents?: Document[]
  onJumpToDocument?: (documentId: string) => void
}) {
  if (!sources?.length) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {sources.map((source) => {
        const match = documents?.find((d) => d.filename === source.filename)
        const label = source.page_number != null ? `${source.filename} p.${source.page_number}` : source.filename
        if (match && onJumpToDocument) {
          return (
            <button
              key={`${source.filename}-${source.page_number ?? 'x'}`}
              type="button"
              onClick={() => onJumpToDocument(match.id)}
              className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-brand-700 hover:border-brand-500"
            >
              {label}
            </button>
          )
        }
        return (
          <span
            key={`${source.filename}-${source.page_number ?? 'x'}`}
            className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted"
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

function MetaChips({
  owner,
  confidence,
  severity,
  riskType,
  due,
  status,
}: {
  owner?: string | null
  confidence?: string | null
  severity?: string | null
  riskType?: string | null
  due?: string | null
  status?: string | null
}) {
  const chips = [
    owner ? `Owner: ${owner}` : null,
    confidence ? `Confidence: ${confidence}` : null,
    severity ? `Severity: ${severity}` : null,
    riskType ? riskType : null,
    due ? `Due: ${due}` : null,
    status ? status : null,
  ].filter(Boolean) as string[]

  if (!chips.length) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

function ItemRow({
  title,
  subtitle,
  askLabel,
  onAsk,
  meta,
  sources,
  documents,
  onJumpToDocument,
}: {
  title: string
  subtitle?: string | null
  askLabel: string
  onAsk?: () => void
  meta?: ReactNode
  sources?: BriefSource[]
  documents?: Document[]
  onJumpToDocument?: (documentId: string) => void
}) {
  return (
    <li className="rounded-md border border-border/70 bg-surface px-2.5 py-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug text-text">{title}</p>
        {onAsk && (
          <button
            type="button"
            onClick={onAsk}
            className="shrink-0 text-[10px] font-medium text-brand-700 hover:underline"
          >
            {askLabel}
          </button>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs leading-snug text-text-muted">{subtitle}</p>}
      {meta}
      <SourceChips sources={sources} documents={documents} onJumpToDocument={onJumpToDocument} />
    </li>
  )
}

function Section({
  title,
  count,
  emptyHint,
  children,
}: {
  title: string
  count: number
  emptyHint: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/40 p-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {title} <span className="text-brand-700">({count})</span>
      </h4>
      {count === 0 ? (
        <p className="mt-2 text-xs text-text-muted">{emptyHint}</p>
      ) : (
        <ul className="mt-2 space-y-2">{children}</ul>
      )}
    </div>
  )
}

function SummaryContent({
  summary,
  documents,
  onAskQuestion,
  onJumpToDocument,
}: {
  summary: WorkspaceSummary
  documents?: Document[]
  onAskQuestion?: (question: string) => void
  onJumpToDocument?: (documentId: string) => void
}) {
  const [overviewExpanded, setOverviewExpanded] = useState(false)
  const decisions = summary.key_decisions.map(asDecision)
  const questions = summary.open_questions.map(asQuestion)
  const risks = summary.risks.map(asRisk)
  const dates = summary.important_dates.map(asDate)
  const actions = summary.action_items.map(asAction)
  const owners = summary.owners ?? []

  const overviewLong = summary.overview.length > 280
  const overviewText =
    overviewExpanded || !overviewLong
      ? summary.overview
      : `${summary.overview.slice(0, 280).trim()}…`

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">Overview</p>
        <p className="mt-2 text-sm leading-relaxed text-text">{overviewText}</p>
        {overviewLong && (
          <button
            type="button"
            onClick={() => setOverviewExpanded((v) => !v)}
            className="mt-2 text-xs font-medium text-brand-700 hover:underline"
          >
            {overviewExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {owners.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Owners <span className="text-brand-700">({owners.length})</span>
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {owners.map((owner) => (
              <div
                key={owner.name}
                className="rounded-md border border-border bg-surface-muted/50 px-2.5 py-1.5 text-xs"
              >
                <span className="font-semibold text-text">{owner.name}</span>
                {owner.owns && owner.owns.length > 0 && (
                  <span className="text-text-muted"> · {owner.owns.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Section title="Key decisions" count={decisions.length} emptyHint="No clear decisions extracted yet.">
          {decisions.map((item: DecisionItem) => (
            <ItemRow
              key={item.text}
              title={item.text}
              subtitle={item.rationale}
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromDecision(item)) : undefined}
              meta={
                <MetaChips owner={item.owner} confidence={item.confidence} />
              }
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section title="Open questions" count={questions.length} emptyHint="No unresolved questions found.">
          {questions.map((item: QuestionItem) => (
            <ItemRow
              key={item.text}
              title={item.text}
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromQuestion(item)) : undefined}
              meta={<MetaChips owner={item.owner} />}
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section title="Risks & conflicts" count={risks.length} emptyHint="No risks or contradictions surfaced.">
          {risks.map((item: RiskItem) => (
            <ItemRow
              key={item.text}
              title={item.text}
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromRisk(item)) : undefined}
              meta={
                <MetaChips
                  severity={item.severity}
                  riskType={item.type ?? item.risk_type}
                />
              }
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section title="Important dates" count={dates.length} emptyHint="No deadlines or dates found.">
          {dates.map((item: DateItem) => (
            <ItemRow
              key={`${item.label}-${item.date ?? ''}`}
              title={item.date ? `${item.label}: ${item.date}` : item.label}
              subtitle={item.conflict_with ? `Conflicts with ${item.conflict_with}` : null}
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromDate(item)) : undefined}
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section title="Action items" count={actions.length} emptyHint="No next actions extracted.">
          {actions.map((item: ActionItem) => (
            <ItemRow
              key={item.text}
              title={item.text}
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromAction(item)) : undefined}
              meta={<MetaChips owner={item.owner} due={item.due_date} status={item.status} />}
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <div className="rounded-lg border border-border bg-surface-muted/40 p-3 sm:col-span-2 lg:col-span-1">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Ask next <span className="text-brand-700">({summary.suggested_questions.length})</span>
          </h4>
          {summary.suggested_questions.length === 0 ? (
            <p className="mt-2 text-xs text-text-muted">Generate again after adding docs.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-1.5">
              {summary.suggested_questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onAskQuestion?.(question)}
                  className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-left text-xs text-text hover:border-brand-500 hover:text-brand-700"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkspaceSummaryCard({
  workspaceId,
  hasReadyDocs,
  readyDocCount = 0,
  documents = [],
  onAskQuestion,
  onJumpToDocument,
}: WorkspaceSummaryCardProps) {
  const { data: persisted, isLoading } = usePersistedSummary(workspaceId, hasReadyDocs)
  const generateSummary = useGenerateSummary(workspaceId)
  const summary = generateSummary.data ?? persisted

  const isStale = useMemo(() => {
    if (!summary?.generated_at || !documents.length) return false
    const generated = new Date(summary.generated_at).getTime()
    return documents.some(
      (doc) => doc.status === 'ready' && new Date(doc.updated_at).getTime() > generated,
    )
  }, [summary?.generated_at, documents])

  if (!hasReadyDocs) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-5">
        <h3 className="font-display text-lg font-semibold text-text">Decision Brief</h3>
        <p className="mt-1 text-sm text-text-muted">
          Upload documents and wait until they show <span className="font-medium text-text">Ready</span>.
          Then generate a brief covering decisions, owners, rationale, risks, dates, and open questions —
          each with source citations.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-text">Decision Brief</h3>
          <p className="mt-1 text-xs text-text-muted">
            {readyDocCount} ready source{readyDocCount === 1 ? '' : 's'} · owners, rationale, risks, dates, actions + sources
          </p>
          {summary?.generated_at && (
            <p className="mt-1 text-xs text-text-muted">
              Last saved {formatSavedAt(summary.generated_at)}
              <span className="text-text-muted/70">
                {' '}
                · {new Date(summary.generated_at).toLocaleString()}
              </span>
            </p>
          )}
          {isStale && (
            <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              Docs changed after this brief — regenerate to refresh decisions and risks.
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
              ? isStale
                ? 'Refresh brief'
                : 'Regenerate brief'
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
            : 'Failed to generate brief'}
        </p>
      )}

      {!summary && !isLoading && !generateSummary.isPending && (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-muted/30 p-4">
          <p className="text-sm text-text">
            {readyDocCount} document{readyDocCount === 1 ? '' : 's'} ready. Generate a Decision Brief to
            recover pricing decisions, owners, rationale, risks, and unresolved items with source chips.
          </p>
        </div>
      )}

      {summary && (
        <SummaryContent
          summary={summary}
          documents={documents}
          onAskQuestion={onAskQuestion}
          onJumpToDocument={onJumpToDocument}
        />
      )}
    </div>
  )
}
