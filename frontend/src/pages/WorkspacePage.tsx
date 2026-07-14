import { type FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import AppHeader from '../components/AppHeader'
import DocumentList from '../components/DocumentList'
import DocumentUpload from '../components/DocumentUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import ChatPanel from '../components/ChatPanel'
import WorkspaceSummaryCard from '../components/WorkspaceSummaryCard'
import { useDeleteDocument, useDocuments } from '../hooks/useDocuments'
import { useUpdateWorkspace } from '../hooks/useWorkspaces'
import { getWorkspace } from '../services/workspaces'
import { useAuthStore } from '../stores/authStore'

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const token = useAuthStore((s) => s.token)
  const updateWorkspace = useUpdateWorkspace(workspaceId!)
  const { data: documents, isLoading: docsLoading, error: docsError } = useDocuments(workspaceId!)
  const hasReadyDocs = documents?.some((d) => d.status === 'ready') ?? false
  const deleteDocument = useDeleteDocument(workspaceId!)

  const { data: workspace, isLoading, error } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspace(token!, workspaceId!),
    enabled: !!token && !!workspaceId,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  function startEditing() {
    if (!workspace) return
    setName(workspace.name)
    setDescription(workspace.description ?? '')
    setIsEditing(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await updateWorkspace.mutateAsync({
      name,
      description: description || undefined,
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link to="/dashboard" className="text-sm text-brand-600 hover:text-brand-700">
          ← All workspaces
        </Link>

        {isLoading && <LoadingSpinner className="mt-8" label="Loading workspace..." />}
        {error && (
          <p className="mt-8 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Workspace not found'}
          </p>
        )}

        {workspace && (
          <div className="mt-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-text">
                    Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-text">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateWorkspace.isPending}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-surface-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-text">{workspace.name}</h1>
                    {workspace.description && (
                      <p className="mt-2 text-text-muted">{workspace.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={startEditing}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                  >
                    Edit
                  </button>
                </div>

                <WorkspaceSummaryCard
                  workspaceId={workspaceId!}
                  hasReadyDocs={hasReadyDocs}
                  onAskQuestion={setPendingQuestion}
                />

                <section className="mt-8 grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <DocumentUpload workspaceId={workspaceId!} />

                    <div>
                      <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
                        Documents
                      </h2>
                      <div className="mt-4">
                        {docsLoading && <LoadingSpinner label="Loading documents…" />}
                        {docsError && (
                          <p className="text-sm text-red-600">
                            {docsError instanceof Error ? docsError.message : 'Failed to load documents'}
                          </p>
                        )}
                        {documents && (
                          <DocumentList
                            documents={documents}
                            onDelete={(id) => deleteDocument.mutate(id)}
                            isDeleting={deleteDocument.isPending}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <ChatPanel
                      workspaceId={workspaceId!}
                      hasReadyDocs={hasReadyDocs}
                      pendingQuestion={pendingQuestion}
                      onQuestionConsumed={() => setPendingQuestion(null)}
                    />
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
