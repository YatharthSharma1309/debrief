import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../stores/authStore'

export default function AppHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  function handleSignOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/dashboard" className="min-w-0">
          <span className="font-display text-lg font-semibold text-text hover:text-brand-700">
            Debrief
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-text-muted">
            Decision briefs from your docs
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user?.email && (
            <span className="hidden max-w-[14rem] truncate text-sm text-text-muted sm:inline">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
