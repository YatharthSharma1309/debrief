import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import CreateWorkspaceForm from '../components/CreateWorkspaceForm'
import WorkspaceCard from '../components/WorkspaceCard'
import { useDeleteWorkspace, useWorkspaces } from '../hooks/useWorkspaces'
import { useAuthStore } from '../stores/authStore'

const workflow = [
  {
    step: '1',
    title: 'Workspace',
    detail: 'Isolate one project’s docs — e.g. Launch Planning',
  },
  {
    step: '2',
    title: 'Upload',
    detail: 'PRDs, pricing notes, transcripts, checklists (PDF / DOCX / TXT)',
  },
  {
    step: '3',
    title: 'Decision Brief',
    detail: 'Recover decisions, ₹ budget, assumptions, metrics, risks — then ask with citations',
  },
]

const recovers = [
  'Approved / proposed / deferred decisions',
  '₹ budget lines',
  'Assumptions',
  'Metric targets',
  'Owners & actions',
  'Date conflicts',
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: workspaces, isLoading, error } = useWorkspaces()
  const deleteWorkspace = useDeleteWorkspace()
  const [showCreate, setShowCreate] = useState(false)
  const workspaceCount = workspaces?.length ?? 0

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
              Welcome{user?.full_name ? `, ${user.full_name}` : ''}
            </h1>
            <p className="mt-2 text-text-muted leading-relaxed">
              Your workspaces hold uploaded context. Generate a Decision Brief to recover what was
              decided, why, who owns it, pricing in ₹, and what is still unresolved.
            </p>
            <p className="mt-2 text-xs text-text-muted">
              {isLoading
                ? 'Loading workspaces…'
                : `${workspaceCount} workspace${workspaceCount === 1 ? '' : 's'}${
                    user?.email ? ` · ${user.email}` : ''
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {showCreate ? 'Cancel' : 'New workspace'}
          </button>
        </div>

        <section className="mt-6 grid gap-3 lg:grid-cols-3">
          {workflow.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Step {item.step} · {item.title}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-text-muted">{item.detail}</p>
            </div>
          ))}
        </section>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {recovers.map((label) => (
            <span
              key={label}
              className="rounded-md border border-border bg-surface-muted/50 px-2 py-1 text-[11px] text-text-muted"
            >
              {label}
            </span>
          ))}
        </div>

        {showCreate && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-text">Create workspace</h2>
            <p className="mt-1 text-sm text-text-muted">
              One workspace = one project context. Upload docs, generate a Decision Brief, then ask
              why / who owns / what’s unresolved with citations.
            </p>
            <div className="mt-4 max-w-lg">
              <CreateWorkspaceForm onSuccess={() => setShowCreate(false)} />
            </div>
          </div>
        )}

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
              Your workspaces
            </h2>
            {workspaceCount > 0 && (
              <p className="text-xs text-text-muted">
                Open a workspace to view the brief, documents, and cited chat
              </p>
            )}
          </div>

          {isLoading && <p className="mt-6 text-sm text-text-muted">Loading workspaces…</p>}
          {error && (
            <p className="mt-6 text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to load workspaces'}
            </p>
          )}

          {!isLoading && !error && workspaces?.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8">
              <p className="font-display text-lg font-semibold text-text">No workspaces yet</p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-muted">
                Create <span className="font-medium text-text">Launch Planning</span> (or any project
                name), upload the sample files from <code className="text-xs">examples/launch-planning</code>
                , wait for Ready, then generate a Decision Brief with ₹ pricing and date conflicts.
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Create your first workspace
              </button>
            </div>
          )}

          {workspaces && workspaces.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onDelete={(id) => deleteWorkspace.mutate(id)}
                  isDeleting={deleteWorkspace.isPending}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
