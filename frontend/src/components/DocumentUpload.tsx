import { useRef } from 'react'
import { useUploadDocument } from '../hooks/useDocuments'

interface DocumentUploadProps {
  workspaceId: string
}

export default function DocumentUpload({ workspaceId }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadDocument = useUploadDocument(workspaceId)

  function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    uploadDocument.mutate(file, {
      onSettled: () => {
        if (inputRef.current) inputRef.current.value = ''
      },
    })
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-text">Upload documents</h2>
      <p className="mt-1 text-sm text-text-muted">PDF, DOCX, or TXT - max 10MB</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={uploadDocument.isPending}
          className="block w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>

      {uploadDocument.isPending && (
        <p className="mt-3 text-sm text-text-muted">Uploading...</p>
      )}
      {uploadDocument.error && (
        <p className="mt-3 text-sm text-red-600">
          {uploadDocument.error instanceof Error ? uploadDocument.error.message : 'Upload failed'}
        </p>
      )}
    </div>
  )
}
