/** Normalize user-facing names from API / persisted auth. */
export function displayName(user?: { full_name?: string | null; email?: string | null } | null) {
  const raw = user?.full_name?.replace(/\s+/g, ' ').replace(/^[,.\s]+/, '').trim()
  if (raw) return raw
  const email = user?.email?.trim()
  if (email) return email.split('@')[0] ?? null
  return null
}

export function welcomeHeading(user?: { full_name?: string | null; email?: string | null } | null) {
  const name = displayName(user)
  return name ? `Welcome, ${name}` : 'Welcome'
}

export function firstName(name: string) {
  return name.split(/\s+/)[0] ?? name
}
