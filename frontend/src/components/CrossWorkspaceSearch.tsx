import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchWorkspaces, type SearchHit } from '../services/search'
import { useAuthStore } from '../stores/authStore'

function HitCard({ hit }: { hit: SearchHit }) {
  return (
    <li className="rounded-lg border border-border bg-surface px-3.5 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
        <Link
          to={`/workspaces/${hit.workspace_id}`}
          className="font-medium text-brand-700 hover:underline"
        >
          {hit.workspace_name || 'Workspace'}
        </Link>
        <span className="text-text-muted">·</span>
        <span className="text-text">{hit.filename}</span>
        {hit.page_number != null && (
          <span className="text-text-muted">p.{hit.page_number}</span>
        )}
        <span className="rounded bg-brand-600/10 px-1.5 py-0.5 font-medium text-brand-700">
          {Math.round(hit.score * 100)}%
        </span>
      </div>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-text-muted">{hit.content}</p>
    </li>
  )
}

export default function CrossWorkspaceSearch() {
  const token = useAuthStore((s) => s.token)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!token || !q) return
    setLoading(true)
    setError(null)
    try {
      const res = await searchWorkspaces(token, q)
      setHits(res.hits)
    } catch (err) {
      setHits(null)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-text">Search across workspaces</h2>
      <p className="mt-1 text-sm text-text-muted">
        Find decisions, pricing, and owners scattered across every workspace you can access.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Pro pricing, launch date conflict, owner for marketing"
          className="min-w-[16rem] flex-1 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {hits && hits.length === 0 && (
        <p className="mt-3 text-sm text-text-muted">No matching chunks. Try different wording.</p>
      )}
      {hits && hits.length > 0 && (
        <ul className="mt-4 space-y-2">
          {hits.map((hit) => (
            <HitCard key={`${hit.chunk_id}-${hit.workspace_id}`} hit={hit} />
          ))}
        </ul>
      )}
    </section>
  )
}
