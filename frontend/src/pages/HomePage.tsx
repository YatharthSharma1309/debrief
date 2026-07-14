import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 border border-brand-100">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            Debrief
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Recover decisions buried in scattered team docs
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Upload docs, notes, and transcripts. Get a cited decision brief —
            what was decided, what is risky, who owns next actions, and what is still unresolved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
              React + TypeScript
            </span>
            <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
              FastAPI
            </span>
            <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
              PostgreSQL + pgvector
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
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
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
        Built for OpenAI Build Week · GPT-5.6 · Codex · RAG
      </footer>
    </div>
  )
}
