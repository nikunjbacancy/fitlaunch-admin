import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-kmvmt-navy/40">{icon ?? <Inbox className="h-12 w-12" />}</div>
      <h3 className="text-lg font-medium text-kmvmt-navy mb-1">{title}</h3>
      <p className="text-sm text-kmvmt-navy/60 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
