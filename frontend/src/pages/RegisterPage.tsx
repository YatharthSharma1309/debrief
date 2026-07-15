import AuthPage from './AuthPage'

/** Alias route — same combined auth surface as /login */
export default function RegisterPage() {
  return <AuthPage mode="register" />
}
