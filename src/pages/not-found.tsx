import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage(): React.ReactElement {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <FileQuestion className="h-16 w-16 text-kmvmt-navy/40" />
      <h1 className="text-2xl font-bold text-kmvmt-navy">Page Not Found</h1>
      <p className="text-kmvmt-navy/60 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => {
          void navigate('/')
        }}
      >
        Back to home
      </Button>
    </div>
  )
}
