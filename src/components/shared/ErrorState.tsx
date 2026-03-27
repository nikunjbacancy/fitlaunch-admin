import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  description,
  onRetry,
}: ErrorStateProps) {
  const body = description ?? message ?? 'An unexpected error occurred'

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-12 w-12 text-kmvmt-red-dark mb-4" />
      <h3 className="text-lg font-medium text-kmvmt-navy mb-1">{title}</h3>
      <p className="text-sm text-kmvmt-navy/60 max-w-sm mb-6">{body}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
