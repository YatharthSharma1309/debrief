import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { getCurrentUser, loginUser, registerUser } from '../services/auth'
import { useAuthStore } from '../stores/authStore'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await registerUser({
        email,
        password,
        full_name: fullName || undefined,
      })
      const token = await loginUser({ email, password })
      const user = await getCurrentUser(token.access_token)
      setAuth(token.access_token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start a workspace, upload launch docs or meeting notes, and generate a cited Decision Brief in minutes."
      footer={
        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
          {' · '}
          <Link to="/" className="font-medium text-brand-700 hover:underline">
            Home
          </Link>
        </p>
      }
    >
      <ol className="mb-5 space-y-2 rounded-xl border border-border bg-surface-muted/60 px-4 py-3 text-xs text-text-muted">
        <li className="flex gap-2">
          <span className="font-semibold text-brand-700">1</span>
          <span>
            Create a workspace for one project (e.g. <span className="text-text">Launch Planning</span>
            )
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-brand-700">2</span>
          <span>Upload PDF, DOCX, or TXT — notes, PRDs, transcripts, checklists</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-brand-700">3</span>
          <span>
            Generate a brief: decisions, ₹ budget, assumptions, metrics, risks — then ask with citations
          </span>
        </li>
      </ol>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            Work email
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-text-muted">
            Use 8+ characters. You’ll land on the dashboard to create your first workspace.
          </p>
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
          {loading ? 'Creating account…' : 'Create account & continue'}
        </button>
      </form>
    </AuthShell>
  )
}
