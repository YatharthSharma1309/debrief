import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import AppHeader from '../components/AppHeader'
import DocumentList, { documentStatusCounts } from '../components/DocumentList'
import DocumentUpload from '../components/DocumentUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import PageShell from '../components/PageShell'
import ChatPanel from '../components/ChatPanel'
import WorkspaceMembersPanel from '../components/WorkspaceMembersPanel'
import WorkspaceSummaryCard from '../components/WorkspaceSummaryCard'
import { useDeleteDocument, useDocuments } from '../hooks/useDocuments'
import { useUpdateWorkspace } from '../hooks/useWorkspaces'
import { getWorkspace } from '../services/workspaces'
import { useAuthStore } from '../stores/authStore'

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const updateWorkspace = useUpdateWorkspace(workspaceId!)
  const { data: documents, isLoading: docsLoading, error: docsError } = useDocuments(workspaceId!)
  const counts = documents ? documentStatusCounts(documents) : null
  const hasReadyDocs = (counts?.ready ?? 0) > 0
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
  const [highlightedDocumentId, setHighlightedDocumentId] = useState<string | null>(null)

  const jumpToDocument = useCallback((documentId: string) => {
    setHighlightedDocumentId(documentId)
    requestAnimationFrame(() => {
      document.getElementById(`doc-${documentId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }, [])

  useEffect(() => {
    if (!highlightedDocumentId) return
    const timer = window.setTimeout(() => setHighlightedDocumentId(null), 4000)
    return () => window.clearTimeout(timer)
  }, [highlightedDocumentId])

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
    <PageShell header={<AppHeader />}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 pb-10 sm:px-6 sm:py-8 sm:pb-12">
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
          <div className="mt-6 space-y-6">
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                      {workspace.name}
                    </h1>
                    {workspace.description ? (
                      <p className="mt-2 max-w-3xl text-sm text-text-muted leading-relaxed sm:text-base">
                        {workspace.description}
                      </p>
                    ) : (
                      <p className="mt-2 max-w-3xl text-sm text-text-muted">
                        Upload sources below, generate a Decision Brief (decisions · ₹ budget ·
                        assumptions · metrics · risks), then verify with cited chat.
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
                      <span>
                        Updated{' '}
                        {new Date(workspace.updated_at).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {counts && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{counts.total} documents</span>
                          <span aria-hidden>·</span>
                          <span className="font-medium text-brand-700">{counts.ready} ready</span>
                          {counts.processing > 0 && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{counts.processing} processing</span>
                            </>
                          )}
                          {counts.failed > 0 && (
                            <>
                              <span aria-hidden>·</span>
                              <span className="text-red-600 dark:text-red-400">{counts.failed} failed</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={startEditing}
                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                  >
                    Edit
                  </button>
                </div>

                <WorkspaceSummaryCard
                  workspaceId={workspaceId!}
                  workspaceName={workspace.name}
                  hasReadyDocs={hasReadyDocs}
                  readyDocCount={counts?.ready ?? 0}
                  documents={documents ?? []}
                  onAskQuestion={setPendingQuestion}
                  onJumpToDocument={jumpToDocument}
                />

                <WorkspaceMembersPanel
                  workspaceId={workspaceId!}
                  canManage={!!user && user.id === workspace.user_id}
                />

                <section className="grid min-w-0 gap-6 lg:grid-cols-2">
                  <div className="min-w-0 space-y-5">
                    <DocumentUpload workspaceId={workspaceId!} />

                    <div>
                      <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
                        Documents
                      </h2>
                      <div className="mt-3 min-w-0">
                        {docsLoading && <LoadingSpinner label="Loading documents…" />}
                        {docsError && (
                          <p className="text-sm text-red-600">
                            {docsError instanceof Error
                              ? docsError.message
                              : 'Failed to load documents'}
                          </p>
                        )}
                        {documents && (
                          <DocumentList
                            documents={documents}
                            onDelete={(id) => deleteDocument.mutate(id)}
                            isDeleting={deleteDocument.isPending}
                            highlightedDocumentId={highlightedDocumentId}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <ChatPanel
                      workspaceId={workspaceId!}
                      hasReadyDocs={hasReadyDocs}
                      pendingQuestion={pendingQuestion}
                      onQuestionConsumed={() => setPendingQuestion(null)}
                      hideSuggestedChips
                    />
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </PageShell>
  )
}
