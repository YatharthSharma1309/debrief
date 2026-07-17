import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useGenerateSummary, usePersistedSummary } from '../hooks/useSummary'
import type { Document } from '../services/documents'
import {
  asAction,
  asAssumption,
  asBudget,
  asDate,
  asDecision,
  asMetric,
  asQuestion,
  asRisk,
  askPromptFromAction,
  askPromptFromAssumption,
  askPromptFromBudget,
  askPromptFromDate,
  askPromptFromDecision,
  askPromptFromMetric,
  askPromptFromQuestion,
  askPromptFromRisk,
  type ActionItem,
  type AssumptionItem,
  type BriefSource,
  type BudgetItem,
  type DateItem,
  type DecisionItem,
  type MetricItem,
  type QuestionItem,
  type RiskItem,
  type WorkspaceSummary,
} from '../services/summary'
import {
  briefToMarkdown,
  copyText,
  downloadText,
  printBriefAsPdf,
} from '../utils/exportMarkdown'

interface WorkspaceSummaryCardProps {
  workspaceId: string
  workspaceName?: string
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

function statusChipClass(status: string) {
  const s = status.toLowerCase()
  if (s === 'approved' || s === 'done') {
    return 'rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-brand-700'
  }
  if (s === 'proposed' || s === 'open') {
    return 'rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-800 dark:text-sky-200'
  }
  if (s === 'deferred' || s === 'blocked') {
    return 'rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200'
  }
  return 'rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700'
}

function formatRiskKind(type?: string | null) {
  const raw = (type ?? '').trim()
  if (!raw || raw.toLowerCase() === 'risk') return 'Risk'
  const label = raw.replace(/_/g, ' ')
  return `Risk · ${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function formatRiskTypeChip(type?: string | null) {
  const raw = (type ?? '').trim()
  if (!raw || raw.toLowerCase() === 'risk') return null
  return raw.replace(/_/g, ' ')
}

function MetaChips({
  owner,
  confidence,
  severity,
  riskType,
  due,
  status,
  currency,
}: {
  owner?: string | null
  confidence?: string | null
  severity?: string | null
  riskType?: string | null
  due?: string | null
  status?: string | null
  currency?: string | null
}) {
  const plain = [
    owner ? `Owner: ${owner}` : null,
    confidence ? `Confidence: ${confidence}` : null,
    severity ? `Severity: ${severity}` : null,
    formatRiskTypeChip(riskType),
    due ? `Due: ${due}` : null,
    currency ? currency : null,
  ].filter(Boolean) as string[]

  if (!plain.length && !status) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {status && (
        <span className={statusChipClass(status)}>
          {status}
        </span>
      )}
      {plain.map((chip) => (
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
  kind,
  title,
  subtitle,
  subtitleLabel = 'Why',
  showEmptySubtitle = false,
  askLabel,
  onAsk,
  meta,
  sources,
  documents,
  onJumpToDocument,
}: {
  kind?: string
  title: string
  subtitle?: string | null
  subtitleLabel?: string
  showEmptySubtitle?: boolean
  askLabel: string
  onAsk?: () => void
  meta?: ReactNode
  sources?: BriefSource[]
  documents?: Document[]
  onJumpToDocument?: (documentId: string) => void
}) {
  return (
    <li className="min-w-0 rounded-md border border-border bg-surface px-2.5 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {kind && (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{kind}</p>
          )}
          <p className={`break-words text-sm leading-snug text-text ${kind ? 'mt-0.5' : ''}`}>{title}</p>
        </div>
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
      {subtitle ? (
        <p className="mt-1 text-xs leading-snug text-text-muted">
          <span className="font-medium text-text">{`${subtitleLabel}:`}</span> {subtitle}
        </p>
      ) : showEmptySubtitle ? (
        <p className="mt-1 text-[11px] italic text-text-muted/80">No rationale found in sources</p>
      ) : null}
      {meta}
      <SourceChips sources={sources} documents={documents} onJumpToDocument={onJumpToDocument} />
    </li>
  )
}

function useDesktopOpen(defaultOpen: boolean) {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return defaultOpen
    return window.matchMedia('(min-width: 640px)').matches ? true : defaultOpen
  })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const sync = () => setOpen(mq.matches ? true : defaultOpen)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [defaultOpen])

  return [open, setOpen] as const
}

/** Collapses on mobile; stays expanded on sm+ so tablet/desktop keep the full brief. */
function BriefAccordion({
  title,
  count,
  defaultOpen = false,
  surface = 'muted',
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  surface?: 'muted' | 'plain'
  children: ReactNode
}) {
  const [open, setOpen] = useDesktopOpen(defaultOpen)
  const surfaceClass =
    surface === 'plain'
      ? 'border-border bg-surface'
      : 'border-border bg-surface-muted'

  return (
    <details
      className={`group rounded-lg border ${surfaceClass}`}
      open={open}
      onToggle={(e) => {
        const el = e.currentTarget
        if (window.matchMedia('(min-width: 640px)').matches) {
          el.open = true
          setOpen(true)
          return
        }
        setOpen(el.open)
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 sm:cursor-default [&::-webkit-details-marker]:hidden">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {title}
          {count != null && <span className="text-brand-700"> ({count})</span>}
        </h4>
        <span
          className="shrink-0 text-text-muted transition-transform group-open:rotate-180 sm:hidden"
          aria-hidden
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-border px-3 pb-3 pt-2">{children}</div>
    </details>
  )
}

function BudgetPanel({
  items,
  documents,
  onAskQuestion,
  onJumpToDocument,
}: {
  items: BudgetItem[]
  documents?: Document[]
  onAskQuestion?: (question: string) => void
  onJumpToDocument?: (documentId: string) => void
}) {
  if (!items.length) return null
  return (
    <BriefAccordion title="Budget & pricing" count={items.length} surface="plain">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.amount}`}
            className="rounded-md border border-border bg-surface-muted px-2.5 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] text-text-muted">{item.label}</p>
              {onAskQuestion && (
                <button
                  type="button"
                  onClick={() => onAskQuestion(askPromptFromBudget(item))}
                  className="text-[10px] font-medium text-brand-700 hover:underline"
                >
                  Ask
                </button>
              )}
            </div>
            <p className="mt-0.5 font-display text-sm font-semibold text-text">{item.amount || '—'}</p>
            {item.notes && <p className="mt-0.5 text-[10px] text-text-muted">{item.notes}</p>}
            <MetaChips currency={item.currency} />
            <SourceChips
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          </div>
        ))}
      </div>
    </BriefAccordion>
  )
}

function BriefStats({
  decisions,
  budget,
  assumptions,
  metrics,
  risks,
  questions,
}: {
  decisions: number
  budget: number
  assumptions: number
  metrics: number
  risks: number
  questions: number
}) {
  const cells = [
    { label: 'Decisions', value: decisions },
    { label: 'Budget', value: budget },
    { label: 'Assumptions', value: assumptions },
    { label: 'Metrics', value: metrics },
    { label: 'Risks', value: risks },
    { label: 'Open Qs', value: questions },
  ]
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="min-w-0 rounded-md border border-border bg-surface-muted px-2 py-1.5 text-center"
        >
          <p className="font-display text-base font-semibold text-brand-700">{cell.value}</p>
          <p className="truncate text-[9px] uppercase tracking-wide text-text-muted">
            {cell.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function Section({
  title,
  count,
  emptyHint,
  children,
  defaultOpen = false,
}: {
  title: string
  count: number
  emptyHint: string
  children: React.ReactNode
  /** Open by default on mobile (desktop always stays open). */
  defaultOpen?: boolean
}) {
  return (
    <BriefAccordion title={title} count={count} defaultOpen={defaultOpen}>
      {count === 0 ? (
        <p className="text-xs text-text-muted">{emptyHint}</p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </BriefAccordion>
  )
}

function isConflictRisk(item: RiskItem) {
  const kind = `${item.type ?? ''} ${item.risk_type ?? ''} ${item.text}`.toLowerCase()
  return (
    kind.includes('conflict') ||
    kind.includes('contradict') ||
    kind.includes('disagree') ||
    kind.includes('inconsist')
  )
}

function ConflictsSpotlight({
  risks,
  dates,
  onAskQuestion,
}: {
  risks: RiskItem[]
  dates: DateItem[]
  onAskQuestion?: (question: string) => void
}) {
  const conflictRisks = risks.filter(isConflictRisk)
  const conflictDates = dates.filter((d) => !!d.conflict_with)
  if (!conflictRisks.length && !conflictDates.length) return null

  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
        Conflicts & contradictions
      </p>
      <ul className="mt-2 space-y-2">
        {conflictDates.map((d) => (
          <li key={`date-${d.label}-${d.date}`} className="text-sm text-text">
            <span className="font-medium">{d.label}</span>
            {d.date ? ` (${d.date})` : ''} conflicts with{' '}
            <span className="font-medium">{d.conflict_with}</span>
            {onAskQuestion && (
              <button
                type="button"
                onClick={() => onAskQuestion(askPromptFromDate(d))}
                className="ml-2 text-xs font-medium text-brand-700 hover:underline"
              >
                Ask
              </button>
            )}
          </li>
        ))}
        {conflictRisks.map((r) => (
          <li key={`risk-${r.text.slice(0, 48)}`} className="text-sm text-text">
            {r.text}
            {onAskQuestion && (
              <button
                type="button"
                onClick={() => onAskQuestion(askPromptFromRisk(r))}
                className="ml-2 text-xs font-medium text-brand-700 hover:underline"
              >
                Ask
              </button>
            )}
          </li>
        ))}
      </ul>
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
  const budget = (summary.budget_items ?? []).map(asBudget)
  const assumptions = (summary.assumptions ?? []).map(asAssumption)
  const metrics = (summary.metrics ?? []).map(asMetric)
  const owners = summary.owners ?? []
  const approved = decisions.filter((d) => (d.status ?? '').toLowerCase() === 'approved').length
  const proposed = decisions.filter((d) => (d.status ?? '').toLowerCase() === 'proposed').length
  const deferred = decisions.filter((d) => (d.status ?? '').toLowerCase() === 'deferred').length

  const overviewLong = summary.overview.length > 420
  const overviewText =
    overviewExpanded || !overviewLong
      ? summary.overview
      : `${summary.overview.slice(0, 420).trim()}…`

  return (
    <div className="mt-4 space-y-4">
      <BriefStats
        decisions={decisions.length}
        budget={budget.length}
        assumptions={assumptions.length}
        metrics={metrics.length}
        risks={risks.length}
        questions={questions.length}
      />

      <ConflictsSpotlight risks={risks} dates={dates} onAskQuestion={onAskQuestion} />

      {(approved > 0 || proposed > 0 || deferred > 0) && (
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {approved > 0 && (
            <span className={statusChipClass('approved')}>{approved} approved</span>
          )}
          {proposed > 0 && (
            <span className={statusChipClass('proposed')}>{proposed} proposed</span>
          )}
          {deferred > 0 && (
            <span className={statusChipClass('deferred')}>{deferred} deferred</span>
          )}
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface-muted p-4">
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

      <BudgetPanel
        items={budget}
        documents={documents}
        onAskQuestion={onAskQuestion}
        onJumpToDocument={onJumpToDocument}
      />

      {owners.length > 0 && (
        <BriefAccordion title="Owners" count={owners.length} surface="plain">
          <div className="grid gap-2 sm:grid-cols-2">
            {owners.map((owner) => (
              <div
                key={owner.name}
                className="rounded-md border border-border bg-surface-muted px-2.5 py-2 text-xs"
              >
                <span className="font-semibold text-text">{owner.name}</span>
                {owner.owns && owner.owns.length > 0 ? (
                  <p className="mt-0.5 text-text-muted">{owner.owns.join(' · ')}</p>
                ) : (
                  <p className="mt-0.5 italic text-text-muted/80">Ownership areas not stated</p>
                )}
              </div>
            ))}
          </div>
        </BriefAccordion>
      )}

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Section
          title="Key decisions"
          count={decisions.length}
          emptyHint="No clear decisions extracted yet."
          defaultOpen
        >
          {decisions.map((item: DecisionItem) => (
            <ItemRow
              key={item.text}
              kind={item.status ? `Decision · ${item.status}` : 'Decision'}
              title={item.text}
              subtitle={item.rationale}
              showEmptySubtitle
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromDecision(item)) : undefined}
              meta={
                <MetaChips
                  owner={item.owner}
                  confidence={item.confidence}
                  status={item.status}
                />
              }
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section
          title="Assumptions"
          count={assumptions.length}
          emptyHint="No operating assumptions extracted."
        >
          {assumptions.map((item: AssumptionItem) => (
            <ItemRow
              key={item.text}
              kind="Assumption"
              title={item.text}
              askLabel="Ask"
              onAsk={
                onAskQuestion ? () => onAskQuestion(askPromptFromAssumption(item)) : undefined
              }
              meta={<MetaChips owner={item.owner} />}
              sources={item.sources}
              documents={documents}
              onJumpToDocument={onJumpToDocument}
            />
          ))}
        </Section>

        <Section title="Metrics" count={metrics.length} emptyHint="No metric targets found.">
          {metrics.map((item: MetricItem) => (
            <ItemRow
              key={`${item.name}-${item.target}`}
              kind="Metric"
              title={item.name}
              subtitle={item.target}
              subtitleLabel="Target"
              askLabel="Ask"
              onAsk={onAskQuestion ? () => onAskQuestion(askPromptFromMetric(item)) : undefined}
              meta={<MetaChips owner={item.owner} />}
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
              kind="Open"
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

        <Section
          title="Risks & conflicts"
          count={risks.length}
          emptyHint="No risks or contradictions surfaced."
          defaultOpen
        >
          {risks.map((item: RiskItem) => (
            <ItemRow
              key={item.text}
              kind={formatRiskKind(item.type ?? item.risk_type)}
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
              kind="Date"
              title={item.date ? `${item.label}: ${item.date}` : item.label}
              subtitle={item.conflict_with ? item.conflict_with : null}
              subtitleLabel="Conflicts with"
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
              kind={item.status ? `Action · ${item.status}` : 'Action'}
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

        <div className="sm:col-span-2 lg:col-span-1">
          <BriefAccordion
            title="Ask next"
            count={summary.suggested_questions.length}
            defaultOpen
          >
            {summary.suggested_questions.length === 0 ? (
              <p className="text-xs text-text-muted">Generate again after adding docs.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
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
          </BriefAccordion>
        </div>
      </div>
    </div>
  )
}

export default function WorkspaceSummaryCard({
  workspaceId,
  workspaceName,
  hasReadyDocs,
  readyDocCount = 0,
  documents = [],
  onAskQuestion,
  onJumpToDocument,
}: WorkspaceSummaryCardProps) {
  const { data: persisted, isLoading } = usePersistedSummary(workspaceId, hasReadyDocs)
  const generateSummary = useGenerateSummary(workspaceId)
  const summary = generateSummary.data ?? persisted
  const [exportNote, setExportNote] = useState<string | null>(null)

  const isStale = useMemo(() => {
    if (!summary?.generated_at || !documents.length) return false
    const generated = new Date(summary.generated_at).getTime()
    return documents.some(
      (doc) => doc.status === 'ready' && new Date(doc.updated_at).getTime() > generated,
    )
  }, [summary?.generated_at, documents])

  async function handleCopyBrief() {
    if (!summary) return
    const md = briefToMarkdown(summary, workspaceName)
    const ok = await copyText(md)
    setExportNote(ok ? 'Brief copied as Markdown' : 'Copy failed — try Download instead')
    window.setTimeout(() => setExportNote(null), 2500)
  }

  function handleDownloadBrief() {
    if (!summary) return
    const slug = (workspaceName ?? 'brief').replace(/[^\w\-]+/g, '-').toLowerCase()
    downloadText(`decision-brief-${slug}.md`, briefToMarkdown(summary, workspaceName))
    setExportNote('Downloaded Markdown')
    window.setTimeout(() => setExportNote(null), 2500)
  }

  function handleExportPdf() {
    if (!summary) return
    const ok = printBriefAsPdf(summary, workspaceName)
    setExportNote(
      ok
        ? 'Print dialog opened — choose Save as PDF'
        : 'Popup blocked — allow popups or use Export .md',
    )
    window.setTimeout(() => setExportNote(null), 3500)
  }

  if (!hasReadyDocs) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-5">
        <h3 className="font-display text-lg font-semibold text-text">Decision Brief</h3>
        <p className="mt-1 text-sm text-text-muted">
          Upload documents and wait until they show <span className="font-medium text-text">Ready</span>.
          Then generate a brief covering decisions (approved/proposed/deferred), budget (₹), assumptions,
          metrics, owners, risks, and open questions — each with sources.
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-text">Decision Brief</h3>
          <p className="mt-1 text-xs text-text-muted">
            {readyDocCount} ready source{readyDocCount === 1 ? '' : 's'} · status · budget · assumptions · metrics · risks + sources
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
          {exportNote && (
            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">{exportNote}</p>
          )}
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          {summary && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleCopyBrief()}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text hover:bg-surface-muted sm:px-3 sm:py-2 sm:text-sm"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleDownloadBrief}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text hover:bg-surface-muted sm:px-3 sm:py-2 sm:text-sm"
              >
                .md
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text hover:bg-surface-muted sm:px-3 sm:py-2 sm:text-sm"
              >
                PDF
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => generateSummary.mutate()}
            disabled={generateSummary.isPending}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm"
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
        <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-muted p-4">
          <p className="text-sm text-text">
            {readyDocCount} document{readyDocCount === 1 ? '' : 's'} ready. Generate a Decision Brief to
            recover approved vs proposed decisions, ₹ budget lines, assumptions, metrics, and risks.
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
