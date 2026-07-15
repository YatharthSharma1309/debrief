import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const recovers = [
  { label: 'Decisions', detail: 'Approved, proposed, or deferred — with rationale' },
  { label: 'Budget (₹)', detail: 'Plan prices and cost lines as written in docs' },
  { label: 'Assumptions', detail: 'What the team is operating under' },
  { label: 'Metrics', detail: 'Targets like onboarding < 10 minutes' },
  { label: 'Risks', detail: 'Conflicts, blockers, and date mismatches' },
  { label: 'Owners', detail: 'Who owns pricing, launch, and approval' },
]

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="absolute right-4 top-4 z-20 lg:right-8 lg:top-6">
        <ThemeToggle />
      </div>

      <aside className="relative overflow-hidden border-b border-border px-6 py-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 20% 0%, color-mix(in oklab, var(--color-brand-100) 70%, transparent), transparent), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in oklab, var(--color-brand-50) 90%, transparent), transparent)',
          }}
          aria-hidden
        />

        <div className="relative home-fade-up">
          <Link to="/" className="font-display text-sm font-semibold tracking-wide text-brand-700">
            Debrief
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:max-w-md lg:leading-[1.15]">
            Recover decisions buried in scattered team docs
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            Upload notes, PRDs, and transcripts. Get a cited Decision Brief — then verify with
            grounded asks.
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {recovers.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/80 bg-surface/70 px-3 py-2.5 backdrop-blur-sm"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                  {item.label}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-8 home-fade-up home-fade-up-delay rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-sm lg:mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            Sample brief · Launch Planning
          </p>
          <p className="mt-2 text-sm leading-snug text-text">
            Pro <span className="font-semibold">₹2,499</span> and Team{' '}
            <span className="font-semibold">₹6,499</span> approved. SSO deferred. Launch date still
            conflicts (Aug 12 vs Aug 19).
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-800 dark:text-emerald-200">
              3 approved
            </span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-800 dark:text-amber-200">
              2 deferred
            </span>
            <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-text-muted">
              4 budget lines
            </span>
            <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-text-muted">
              4 assumptions
            </span>
          </div>
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
        <div className="w-full max-w-md home-fade-up">
          <p className="font-display text-sm font-semibold text-brand-700 lg:hidden">Debrief</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>
          <div className="mt-6">{footer}</div>
        </div>
      </main>
    </div>
  )
}

export const DEMO_EMAIL = 'demo@debrief.app'
export const DEMO_PASSWORD = 'DemoBuildWeek2026!'
