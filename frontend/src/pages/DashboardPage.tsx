import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import CreateWorkspaceForm from '../components/CreateWorkspaceForm'
import WorkspaceCard from '../components/WorkspaceCard'
import { useDeleteWorkspace, useWorkspaces } from '../hooks/useWorkspaces'
import { useAuthStore } from '../stores/authStore'

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
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
              Welcome{user?.full_name ? `, ${user.full_name}` : ''}
            </h1>
            <p className="mt-2 text-text-muted">
              Recover cited decisions, rationale, owners, risks, and open loops — then ask why / who / what’s unresolved.
            </p>
            <p className="mt-2 text-xs text-text-muted">
              {isLoading
                ? 'Loading workspaces…'
                : `${workspaceCount} workspace${workspaceCount === 1 ? '' : 's'}${
                    user?.email ? ` · signed in as ${user.email}` : ''
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

        {showCreate && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">Create workspace</h2>
            <p className="mt-1 text-sm text-text-muted">
              Isolate one project — upload docs, generate a Decision Brief, then ask why / who owns / what’s unresolved.
            </p>
            <div className="mt-4 max-w-lg">
              <CreateWorkspaceForm onSuccess={() => setShowCreate(false)} />
            </div>
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Your workspaces</h2>

          {isLoading && <p className="mt-6 text-sm text-text-muted">Loading workspaces...</p>}
          {error && (
            <p className="mt-6 text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to load workspaces'}
            </p>
          )}

          {!isLoading && !error && workspaces?.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="text-sm font-medium text-text">No workspaces yet</p>
              <p className="mt-1 text-xs text-text-muted">
                Create one, upload launch docs or meeting notes, then generate a Decision Brief.
              </p>
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
