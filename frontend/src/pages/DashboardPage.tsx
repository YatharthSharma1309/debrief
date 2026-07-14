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

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">
              Welcome{user?.full_name ? `, ${user.full_name}` : ''}
            </h1>
            <p className="mt-2 text-text-muted">Turn project documents into cited decisions, risks, and next actions.</p>
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
          <div className="mt-8 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">Create workspace</h2>
            <div className="mt-4 max-w-lg">
              <CreateWorkspaceForm onSuccess={() => setShowCreate(false)} />
            </div>
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Your workspaces</h2>

          {isLoading && <p className="mt-6 text-sm text-text-muted">Loading workspaces...</p>}
          {error && (
            <p className="mt-6 text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to load workspaces'}
            </p>
          )}

          {!isLoading && !error && workspaces?.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="text-sm text-text-muted">No workspaces yet</p>
              <p className="mt-1 text-xs text-text-muted">Create one to start uploading documents</p>
            </div>
          )}

          {workspaces && workspaces.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
