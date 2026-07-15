import AuthPage from './AuthPage'

/** Alias route — same combined auth surface as /register */
export default function LoginPage() {
  return <AuthPage mode="signin" />
}
