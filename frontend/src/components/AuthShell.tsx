import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import SiteFooter from './SiteFooter'
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
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-2">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <Link to="/" className="font-display text-sm font-semibold text-brand-700">
          Debrief
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-col justify-center bg-surface px-4 py-6 sm:px-6 sm:py-10 md:col-start-2 md:row-start-1 md:min-h-screen md:px-8 md:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-md home-fade-up">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{subtitle}</p>

          <div className="mt-5 sm:mt-8">{children}</div>
          <div className="mt-5 sm:mt-6">{footer}</div>
        </div>
      </main>

      <aside className="relative max-md:hidden overflow-hidden border-r border-border bg-surface-muted md:flex md:min-h-screen md:flex-col md:justify-between md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="absolute right-6 top-6 z-20 lg:right-8">
          <ThemeToggle />
        </div>

        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 20% 0%, color-mix(in oklab, var(--color-brand-100) 55%, transparent), transparent), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in oklab, var(--color-brand-50) 70%, transparent), transparent)',
          }}
          aria-hidden
        />

        <div className="relative home-fade-up">
          <Link to="/" className="font-display text-sm font-semibold tracking-wide text-brand-700">
            Debrief
          </Link>
          <h2 className="mt-4 max-w-md font-display text-2xl font-semibold tracking-tight text-text lg:text-4xl lg:leading-[1.15]">
            Recover decisions buried in scattered team docs
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted">
            Upload scattered team docs. Recover a cited Decision Brief: decisions, rationale, owners,
            risks, and unresolved items — then verify with grounded questions.
          </p>

          <dl className="mt-6 grid gap-3 lg:mt-8 lg:grid-cols-2">
            {recovers.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-surface px-3 py-2.5 shadow-sm"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                  {item.label}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-8 home-fade-up home-fade-up-delay rounded-xl border border-border bg-surface p-4 shadow-sm lg:mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            Sample brief · Launch Planning
          </p>
          <p className="mt-2 text-sm leading-snug text-text">
            Pro <span className="font-semibold">₹2,499</span> and Team{' '}
            <span className="font-semibold">₹6,499</span> approved. SSO deferred. Launch date still
            conflicts (Aug 12 vs Aug 19).
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
            <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">
              3 approved
            </span>
            <span className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-medium text-text-muted">
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
      </div>

      <SiteFooter compact />
    </div>
  )
}

export const DEMO_EMAIL = 'demo@debrief.app'
export const DEMO_PASSWORD = 'DemoBuildWeek2026!'
