import { type FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  inviteMember,
  listMembers,
  removeMember,
  type WorkspaceRole,
} from '../services/members'
import { useAuthStore } from '../stores/authStore'

interface WorkspaceMembersPanelProps {
  workspaceId: string
  /** Only owners can manage members; hide panel actions otherwise if needed */
  canManage?: boolean
}

export default function WorkspaceMembersPanel({
  workspaceId,
  canManage = true,
}: WorkspaceMembersPanelProps) {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceRole>('viewer')
  const [open, setOpen] = useState(false)

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: () => listMembers(token!, workspaceId),
    enabled: !!token && !!workspaceId && open && canManage,
  })

  const invite = useMutation({
    mutationFn: () => inviteMember(token!, workspaceId, email.trim(), role),
    onSuccess: () => {
      setEmail('')
      void queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
    },
  })

  const remove = useMutation({
    mutationFn: (memberId: string) => removeMember(token!, workspaceId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
    },
  })

  function handleInvite(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    invite.mutate()
  }

  if (!canManage) return null

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">Share workspace</h3>
          <p className="mt-0.5 text-xs text-text-muted">
            Invite an existing Debrief account by email (viewer or editor).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-muted"
        >
          {open ? 'Hide' : 'Members'}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleInvite} className="flex flex-wrap gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="min-w-[12rem] flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
              className="rounded-lg border border-border bg-surface px-2.5 py-2 text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              type="submit"
              disabled={invite.isPending}
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {invite.isPending ? 'Inviting…' : 'Invite'}
            </button>
          </form>

          {invite.error && (
            <p className="text-sm text-red-600">
              {invite.error instanceof Error ? invite.error.message : 'Invite failed'}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : 'Failed to load members'}
            </p>
          )}
          {isLoading && <p className="text-sm text-text-muted">Loading members…</p>}

          {members && members.length === 0 && (
            <p className="text-sm text-text-muted">No shared members yet — only you (owner) have access.</p>
          )}
          {members && members.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">
                      {m.full_name || m.email}
                    </p>
                    {m.full_name && (
                      <p className="truncate text-xs text-text-muted">{m.email}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded border border-border px-2 py-0.5 text-[11px] capitalize text-text-muted">
                      {m.role}
                    </span>
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (window.confirm(`Remove ${m.email}?`)) remove.mutate(m.id)
                      }}
                      className="text-xs text-red-600 hover:underline disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
