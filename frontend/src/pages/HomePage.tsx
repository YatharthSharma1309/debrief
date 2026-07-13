export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 border border-brand-100">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          ContextAI
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
          Your intelligent document workspace
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Upload documents, organize workspaces, and chat with your knowledge —
          with cited, streaming AI answers.
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
      </div>
    </div>
  )
}
