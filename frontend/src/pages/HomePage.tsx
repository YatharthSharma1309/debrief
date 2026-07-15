import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const recovered = [
  { label: 'Decisions', detail: 'What was decided and why, pulled across notes and docs' },
  { label: 'Owners', detail: 'Who owns the next action so nothing stalls quietly' },
  { label: 'Risks', detail: 'Conflicts, blockers, and contradictions between sources' },
  { label: 'Open loops', detail: 'Unresolved questions and date mismatches before launch' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div className="home-fade-up space-y-6 text-center lg:text-left">
          <p className="font-display text-sm font-semibold tracking-wide text-brand-700">Debrief</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Recover decisions buried in scattered team docs
          </h1>
          <p className="mx-auto max-w-xl text-lg text-text-muted leading-relaxed lg:mx-0">
            Upload docs, notes, and transcripts. Get a cited Decision Brief — decisions with
            rationale and owners, risks and date conflicts, open loops — then verify with cited asks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
            <Link
              to="/register"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Generate a decision brief
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
            >
              Sign in
            </Link>
          </div>
          <p className="text-xs text-text-muted">
            Demo account:{' '}
            <span className="font-medium text-text">demo@debrief.app</span> /{' '}
            <span className="font-medium text-text">DemoBuildWeek2026!</span>
            <br />
            Workspace <span className="font-medium text-text">Launch Planning</span> is pre-seeded.
          </p>
        </div>

        {/* Product visual: mirrors in-app Decision Brief density */}
        <aside
          className="home-fade-up home-fade-up-delay relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          aria-label="Sample Decision Brief from Launch Planning workspace"
        >
          <div className="home-brief-sheen pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative border-b border-border px-5 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-sm font-semibold text-text">Decision Brief</p>
                <p className="mt-0.5 text-[11px] text-text-muted">Launch Planning · 5 ready sources</p>
              </div>
              <span className="rounded-md border border-brand-500/30 bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                Saved brief
              </span>
            </div>
          </div>

          <div className="relative space-y-4 px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">Overview</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text">
                Launch self-serve Pro at <span className="font-medium">$29/user/mo</span>. Sofia owns
                launch readiness; Arjun owns pricing copy. Enterprise SSO stays post-launch — the
                public date still conflicts across docs.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                ['Sofia', 'Launch readiness'],
                ['Arjun', 'Pricing & checkout'],
                ['Maya', 'Final approval'],
              ].map(([name, owns]) => (
                <span
                  key={name}
                  className="rounded-md border border-border bg-surface-muted/60 px-2 py-1 text-[10px] text-text"
                >
                  <span className="font-semibold">{name}</span>
                  <span className="text-text-muted"> · {owns}</span>
                </span>
              ))}
            </div>

            <ul className="space-y-2">
              <li className="rounded-md border border-border/80 bg-surface-muted/40 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Decision
                  </p>
                  <span className="text-[10px] font-medium text-brand-700">Ask →</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-text">
                  Ship Pro at $29/user/mo; no annual discount at launch.
                </p>
                <p className="mt-1 text-xs leading-snug text-text-muted">
                  Why: sales-led pricing slowed beta trials; $29 is procurement-light for small teams.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                    Owner: Arjun
                  </span>
                  <span className="rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                    Confidence: high
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                    02-pricing-notes.txt
                  </span>
                </div>
              </li>

              <li className="rounded-md border border-border/80 bg-surface-muted/40 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Risk · contradiction
                  </p>
                  <span className="text-[10px] font-medium text-brand-700">Ask →</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-text">
                  Launch date is Aug 12 in the transcript and Aug 19 on the checklist.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200">
                    Severity: high
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                    03-launch-meeting-transcript.txt
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                    05-launch-checklist.txt
                  </span>
                </div>
              </li>

              <li className="rounded-md border border-border/80 bg-surface-muted/40 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Open question
                </p>
                <p className="mt-1 text-sm leading-snug text-text">
                  Should free include 3 projects or 5?
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                    Owner: unresolved
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                    02-pricing-notes.txt
                  </span>
                </div>
              </li>
            </ul>

            <div className="rounded-md border border-dashed border-border px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Cited follow-up
              </p>
              <p className="mt-1 text-xs text-text">
                “What did we decide about pricing and why?”
              </p>
              <p className="mt-1.5 text-[10px] text-text-muted">
                <span className="font-medium text-brand-700">87% match</span>
                {' · '}
                02-pricing-notes.txt
                {' · '}
                excerpt: “The team decided to launch the Pro plan at $29…”
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
            What Debrief recovers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            One workspace. Structured brief rows and follow-up answers stay grounded in your files with citations.
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

      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        Built with Codex for OpenAI Build Week · Runtime: OpenRouter free models · Work & Productivity
      </footer>
    </div>
  )
}
