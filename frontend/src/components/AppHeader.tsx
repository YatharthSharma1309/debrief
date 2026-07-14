import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../stores/authStore'

export default function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="text-lg font-semibold text-text hover:text-brand-700">
          Debrief
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="hidden text-sm text-text-muted sm:inline">{user?.email}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
