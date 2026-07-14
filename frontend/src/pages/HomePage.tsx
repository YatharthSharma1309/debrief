import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div className="space-y-6 text-center lg:text-left">
          <p className="font-display text-sm font-semibold tracking-wide text-brand-700">Debrief</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Recover decisions buried in scattered team docs
          </h1>
          <p className="mx-auto max-w-xl text-lg text-text-muted leading-relaxed lg:mx-0">
            Upload docs, notes, and transcripts. Get a cited decision brief — what was decided,
            what is risky, who owns next actions, and what is still unresolved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
            <Link
              to="/register"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
            >
              Sign in
            </Link>
          </div>
          <p className="text-xs text-text-muted">
            Build Week judges:{' '}
            <span className="font-medium text-text">demo@debrief.app</span> /{' '}
            <span className="font-medium text-text">DemoBuildWeek2026!</span>
            <br />
            Run <code className="rounded bg-surface px-1 py-0.5">python scripts/seed_demo.py</code> after DB is up.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Decision Brief</p>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Pricing stays $29 / $79 / $199. Marketing owns launch week. SSO for paid plans is pushed
            to post-launch — board and sales are not aligned on the date.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Key decision</p>
              <p className="mt-1 text-sm text-text">Keep freemium pricing; no launch-week discounting.</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Open risk</p>
              <p className="mt-1 text-sm text-text">Launch date listed as Aug 12 and Aug 19 across docs.</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-text-muted">
            Cited chat · “What did we decide about pricing and why?” · 87% match · 02-pricing-notes.txt
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        Built for OpenAI Build Week · GPT-5.6 · Codex · Work & Productivity
      </footer>
    </div>
  )
}
