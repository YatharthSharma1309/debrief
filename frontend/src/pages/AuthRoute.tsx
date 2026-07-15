import { Navigate, useLocation } from 'react-router-dom'
import AuthPage from './AuthPage'
import { useAuthStore } from '../stores/authStore'

/** Shared gate for /login and /register — same component so tab switches stay in sync. */
export default function AuthRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (token) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />
  }

  return <AuthPage />
}
