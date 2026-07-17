import type { ReactNode } from 'react'

import { Link } from 'react-router-dom'

import { useAuthStore } from '../stores/authStore'



const GITHUB_URL = 'https://github.com/YatharthSharma1309/debrief'

const BUILD_WEEK_URL = 'https://openai.devpost.com/'



const linkClass = 'text-sm text-text-muted transition-colors hover:text-text'



function NavLink({

  to,

  href,

  children,

  external,

}: {

  to?: string

  href?: string

  children: ReactNode

  external?: boolean

}) {

  if (to) {

    return (

      <Link to={to} className={linkClass}>

        {children}

      </Link>

    )

  }

  return (

    <a

      href={href}

      className={linkClass}

      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}

    >

      {children}

    </a>

  )

}



function NavGroup({ title, children }: { title: string; children: ReactNode }) {

  return (

    <div>

      <p className="text-xs font-medium text-text">{title}</p>

      <ul className="mt-3 space-y-2.5">{children}</ul>

    </div>

  )

}



function NavItem({ children }: { children: ReactNode }) {

  return <li>{children}</li>

}



interface SiteFooterProps {

  compact?: boolean

}



export default function SiteFooter({ compact = false }: SiteFooterProps) {

  const token = useAuthStore((s) => s.token)

  const year = new Date().getFullYear()



  if (compact) {

    return (

      <footer className="mt-auto border-t border-border bg-surface">

        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <p>© {year} Debrief · OpenAI Build Week</p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Footer">

            <NavLink to="/">Home</NavLink>

            <NavLink href={BUILD_WEEK_URL} external>

              Build Week

            </NavLink>

            <NavLink href={GITHUB_URL} external>

              GitHub

            </NavLink>

          </nav>

        </div>

      </footer>

    )

  }



  return (

    <footer className="mt-auto border-t border-border">

      <div className="bg-surface-muted/50">

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">

            <div className="min-w-0 max-w-sm">

              <Link to="/" className="font-display text-lg font-semibold tracking-tight text-text">

                Debrief

              </Link>

              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">

                Decision briefs from your docs

              </p>

            </div>



            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10">

              <NavGroup title="Product">

                {token ? (

                  <NavItem>

                    <NavLink to="/dashboard">Dashboard</NavLink>

                  </NavItem>

                ) : (

                  <>

                    <NavItem>

                      <NavLink to="/login">Sign in</NavLink>

                    </NavItem>

                    <NavItem>

                      <NavLink to="/register">Create account</NavLink>

                    </NavItem>

                  </>

                )}

                <NavItem>

                  <NavLink to="/#brief">Sample brief</NavLink>

                </NavItem>

                <NavItem>

                  <NavLink to="/#recovers">What it recovers</NavLink>

                </NavItem>

              </NavGroup>



              <NavGroup title="Resources">

                <NavItem>

                  <NavLink href={`${GITHUB_URL}#readme`} external>

                    Documentation

                  </NavLink>

                </NavItem>

                <NavItem>

                  <NavLink href={`${GITHUB_URL}/tree/master/examples`} external>

                    Example files

                  </NavLink>

                </NavItem>

                <NavItem>

                  <NavLink href={GITHUB_URL} external>

                    GitHub

                  </NavLink>

                </NavItem>

              </NavGroup>



              <NavGroup title="About">

                <NavItem>

                  <NavLink href={BUILD_WEEK_URL} external>

                    OpenAI Build Week

                  </NavLink>

                </NavItem>

                <NavItem>

                  <NavLink href="https://openrouter.ai/" external>

                    OpenRouter

                  </NavLink>

                </NavItem>

                <NavItem>

                  <NavLink to="/">Home</NavLink>

                </NavItem>

              </NavGroup>

            </div>

          </div>

        </div>

      </div>



      <div className="border-t border-border bg-surface">

        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <p>© {year} Debrief</p>

          <p className="sm:text-right">

            Codex · GPT-5.6 · OpenAI Build Week · Work &amp; Productivity

          </p>

        </div>

      </div>

    </footer>

  )

}


