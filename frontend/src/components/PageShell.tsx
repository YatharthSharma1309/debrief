import type { ReactNode } from 'react'
import SiteFooter from './SiteFooter'

interface PageShellProps {
  header?: ReactNode
  children: ReactNode
  /** Show site footer (default true). */
  footer?: boolean
  /** Use compact footer on auth-style pages. */
  compactFooter?: boolean
}

/** Full-viewport page wrapper: header + flex-1 main + footer pinned to bottom. */
export default function PageShell({
  header,
  children,
  footer = true,
  compactFooter = false,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="flex w-full min-w-0 flex-1 flex-col">{children}</main>
      {footer && <SiteFooter compact={compactFooter} />}
    </div>
  )
}
