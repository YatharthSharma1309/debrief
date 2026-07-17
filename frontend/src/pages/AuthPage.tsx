import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell, { DEMO_EMAIL, DEMO_PASSWORD } from '../components/AuthShell'
import { getCurrentUser, loginUser, registerUser } from '../services/auth'
import { useAuthStore } from '../stores/authStore'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export type AuthMode = 'signin' | 'register'

function modeFromPath(pathname: string): AuthMode {
  return pathname.startsWith('/register') ? 'register' : 'signin'
}

/** Combined Sign in / Create account — mode follows /login vs /register URL. */
export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode = modeFromPath(location.pathname)
  const isRegister = mode === 'register'

  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setError(null)
    setPassword('')
    if (!isRegister) setFullName('')
  }, [isRegister])

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  function switchMode(next: AuthMode) {
    const path = next === 'register' ? '/register' : '/login'
    if (location.pathname !== path) {
      navigate(path, { replace: true })
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isRegister) {
        await registerUser({
          email,
          password,
          full_name: fullName || undefined,
        })
      }
      const token = await loginUser({ email, password })
      const user = await getCurrentUser(token.access_token)
      setAuth(token.access_token, user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isRegister
            ? 'Registration failed'
            : 'Login failed',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title={isRegister ? 'Create your account' : 'Sign in'}
      subtitle={
        isRegister
          ? 'Start a workspace, upload docs, and generate a cited Decision Brief in minutes.'
          : 'Continue from a cited Decision Brief — decisions, ₹ budget, assumptions, and open risks.'
      }
      footer={
        <p className="text-center text-sm text-text-muted">
          <Link to="/" className="font-medium text-brand-700 hover:underline">
            ← Back to home
          </Link>
        </p>
      }
    >
      <div
        role="tablist"
        aria-label="Authentication"
        className="mb-5 grid grid-cols-2 rounded-xl border border-border bg-surface-muted p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isRegister}
          onClick={() => switchMode('signin')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            !isRegister
              ? 'bg-surface text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isRegister}
          onClick={() => switchMode('register')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            isRegister
              ? 'bg-surface text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Create account
        </button>
      </div>

      {!isRegister ? (
        <div className="mb-4 rounded-xl border border-border bg-surface-muted px-3 py-2.5 sm:mb-5 sm:px-4 sm:py-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Build Week demo
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                Pre-seeded <span className="font-medium text-text">Launch Planning</span> — ₹ pricing,
                owners, date conflict.
              </p>
              <p className="mt-1 font-mono text-[11px] text-text">
                {DEMO_EMAIL}
                <span className="text-text-muted"> · </span>
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
      ) : (
        <ol className="mb-5 space-y-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-xs text-text-muted">
          <li className="flex gap-2">
            <span className="font-semibold text-brand-700">1</span>
            <span>
              Create a workspace (e.g. <span className="text-text">Launch Planning</span>)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-brand-700">2</span>
            <span>Upload PDF, DOCX, or TXT sources</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-brand-700">3</span>
            <span>Generate a Decision Brief, then ask with citations</span>
          </li>
        </ol>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text">
              Full name <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Maya Patel"
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            {isRegister ? 'Work email' : 'Email'}
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
            minLength={isRegister ? 8 : undefined}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
            className={fieldClass}
          />
          {isRegister && (
            <p className="mt-1.5 text-xs text-text-muted">
              8+ characters. You’ll land on the dashboard after creating the account.
            </p>
          )}
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
          {loading
            ? isRegister
              ? 'Creating account…'
              : 'Signing in…'
            : isRegister
              ? 'Create account & continue'
              : 'Sign in to Debrief'}
        </button>
      </form>
    </AuthShell>
  )
}
