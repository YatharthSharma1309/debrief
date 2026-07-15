import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell, { DEMO_EMAIL, DEMO_PASSWORD } from '../components/AuthShell'
import { loginUser, getCurrentUser } from '../services/auth'
import { useAuthStore } from '../stores/authStore'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = await loginUser({ email, password })
      const user = await getCurrentUser(token.access_token)
      setAuth(token.access_token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Open your workspaces and continue from a cited Decision Brief — decisions, ₹ budget, assumptions, and open risks."
      footer={
        <p className="text-center text-sm text-text-muted">
          No account?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
          {' · '}
          <Link to="/" className="font-medium text-brand-700 hover:underline">
            Home
          </Link>
        </p>
      }
    >
      <div className="mb-5 rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              Build Week demo
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              Pre-seeded workspace <span className="font-medium text-text">Launch Planning</span> with
              ₹ pricing, owners, and a date conflict.
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-text">
              {DEMO_EMAIL}
              <br />
              {DEMO_PASSWORD}
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="shrink-0 rounded-lg border border-brand-500/40 bg-brand-600/10 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-600/15"
          >
            Use demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className={fieldClass}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in to Debrief'}
        </button>
      </form>
    </AuthShell>
  )
}
