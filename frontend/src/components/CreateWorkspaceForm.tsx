import { type FormEvent, useState } from 'react'
import { useCreateWorkspace } from '../hooks/useWorkspaces'

interface CreateWorkspaceFormProps {
  onSuccess?: () => void
}

export default function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const createWorkspace = useCreateWorkspace()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await createWorkspace.mutateAsync({
      name,
      description: description || undefined,
    })
    setName('')
    setDescription('')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="workspace-name" className="block text-sm font-medium text-text">
          Name
        </label>
        <input
          id="workspace-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Launch Planning"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div>
        <label htmlFor="workspace-description" className="block text-sm font-medium text-text">
          Description <span className="text-text-muted">(optional)</span>
        </label>
        <textarea
          id="workspace-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What decisions or project context will live here?"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {createWorkspace.error && (
        <p className="text-sm text-red-600">
          {createWorkspace.error instanceof Error ? createWorkspace.error.message : 'Failed to create workspace'}
        </p>
      )}

      <button
        type="submit"
        disabled={createWorkspace.isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {createWorkspace.isPending ? 'Creating...' : 'Create workspace'}
      </button>
    </form>
  )
}
