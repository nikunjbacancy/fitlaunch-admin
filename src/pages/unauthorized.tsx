import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage(): React.ReactElement {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground max-w-sm">
        You don't have permission to view this page. Contact your administrator if you believe this
        is a mistake.
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            void navigate(-1)
          }}
        >
          Go back
        </Button>
        <Button
          onClick={() => {
            void navigate('/')
          }}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
