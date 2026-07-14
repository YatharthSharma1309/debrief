interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export default function LoadingSpinner({ label = 'Loading...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center gap-3 text-sm text-text-muted ${className}`}>
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand-600"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  )
}
