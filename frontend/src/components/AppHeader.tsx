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
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }))
  }

  return (
    <header className="border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link to="/dashboard" className="flex min-w-0 flex-col py-0.5">
          <span className="font-display text-lg font-semibold leading-none text-text hover:text-brand-700">
            Debrief
          </span>
          <span className="mt-1 block truncate text-[10px] leading-tight text-text-muted sm:text-[11px]">
            Decision briefs from your docs
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {user?.email && (
            <span className="hidden max-w-[14rem] truncate text-sm text-text-muted lg:inline">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text hover:bg-surface-muted sm:px-3 sm:text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
