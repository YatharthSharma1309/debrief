import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import ThemeToggle from '../components/ThemeToggle'
import { useAuthStore } from '../stores/authStore'

const recovered = [
  { label: 'Decisions', detail: 'What was decided and why, with owners and ₹ amounts when present' },
  { label: 'Owners', detail: 'Who owns pricing, launch, and approval so nothing stalls quietly' },
  { label: 'Risks', detail: 'Conflicts, blockers, and contradictions between sources' },
  { label: 'Unresolved', detail: 'Open questions, date mismatches, and packaging gaps' },
]

const stats = [
  { label: 'Decisions', value: '4' },
  { label: 'Budget', value: '4' },
  { label: 'Assumptions', value: '3' },
  { label: 'Metrics', value: '2' },
  { label: 'Risks', value: '2' },
]

export default function HomePage() {
  const token = useAuthStore((s) => s.token)

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid w-full min-w-0 max-w-6xl flex-1 items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="home-fade-up min-w-0 space-y-5 text-center sm:space-y-6 lg:text-left">
          <p className="font-display text-sm font-semibold tracking-wide text-brand-700">Debrief</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]">
            Recover decisions buried in scattered team docs
          </h1>
          <p className="mx-auto max-w-xl text-base text-text-muted leading-relaxed sm:text-lg lg:mx-0">
            Upload scattered team docs. Recover a cited Decision Brief: decisions, rationale, owners,
            risks, and unresolved items — then verify with grounded questions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
            {token ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
          {!token && (
            <p className="text-xs text-text-muted">
              Demo account:{' '}
              <span className="font-medium text-text">demo@debrief.app</span> /{' '}
              <span className="font-medium text-text">DemoBuildWeek2026!</span>
              <br />
              Workspace <span className="font-medium text-text">Launch Planning</span> is pre-seeded.
              Sign in and Create account share one screen — switch with the tabs.
            </p>
          )}
        </div>

        <aside
          id="brief"
          className="home-fade-up home-fade-up-delay relative min-w-0 scroll-mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          aria-label="Sample Decision Brief from Launch Planning workspace"
        >
          <div className="home-brief-sheen pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative border-b border-border px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-text">Decision Brief</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  Launch Planning · Atlas · 5 ready sources · INR pricing
                </p>
              </div>
              <span className="rounded-md border border-brand-500/30 bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                Saved brief
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-md border border-border bg-surface-muted px-1 py-1.5 text-center"
                >
                  <p className="font-display text-sm font-semibold text-brand-700">{stat.value}</p>
                  <p className="truncate text-[9px] uppercase tracking-wide text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative space-y-3 px-4 py-3.5 sm:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">Overview</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text">
                India launch: self-serve <span className="font-medium">Pro ₹2,499</span> and{' '}
                <span className="font-medium">Team ₹6,499</span> per user/mo. Sofia owns launch
                readiness; Arjun owns INR pricing + checkout. SSO / Enterprise stays post-launch.
                Public date still conflicts (Aug 12 vs Aug 19).
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface-muted px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Pricing recovered (₹)
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['Free', '₹0'],
                  ['Pro', '₹2,499/mo'],
                  ['Team', '₹6,499/mo'],
                  ['Enterprise', 'Custom'],
                ].map(([plan, price]) => (
                  <div key={plan} className="rounded border border-border bg-surface px-2 py-1.5">
                    <p className="text-[10px] text-text-muted">{plan}</p>
                    <p className="text-xs font-semibold text-text">{price}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-text-muted">
                Source: 02-pricing-notes.txt · Owner: Arjun · GST note required on page
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                ['Sofia', 'Launch readiness'],
                ['Arjun', 'INR pricing & checkout'],
                ['Maya', 'Final approval'],
                ['Lena', 'Enterprise packaging'],
              ].map(([name, owns]) => (
                <span
                  key={name}
                  className="rounded-md border border-border bg-surface-muted px-2 py-1 text-[10px] text-text"
                >
                  <span className="font-semibold">{name}</span>
                  <span className="text-text-muted"> · {owns}</span>
                </span>
              ))}
            </div>

            <div className="rounded-md border border-border bg-surface-muted px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Decision · approved
                </p>
                <span className="text-[10px] font-medium text-brand-700">Ask →</span>
              </div>
              <p className="mt-1 text-sm leading-snug text-text">
                Ship Pro at ₹2,499/user/mo and Team at ₹6,499; no annual discount at launch.
              </p>
              <p className="mt-1 text-xs leading-snug text-text-muted">
                Why: sales-led pricing slowed beta trials; ₹ pricing removes FX confusion for local buyers.
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                  approved
                </span>
                <span className="rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                  Owner: Arjun
                </span>
                <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                  02-pricing-notes.txt
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface via-surface/90 to-transparent" />
          </div>

          <div className="relative border-t border-border bg-surface px-4 py-3 sm:px-5">
            <Link
              to={token ? '/dashboard' : '/login'}
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              Open Launch Planning demo for the full brief →
            </Link>
          </div>
        </aside>
      </div>

      <section id="recovers" className="scroll-mt-8 border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
            What Debrief recovers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            One workspace. Structured brief rows — including ₹ pricing when present — stay grounded
            in your files with citations.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recovered.map((item) => (
              <div key={item.label}>
                <p className="text-sm font-semibold text-brand-700">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
