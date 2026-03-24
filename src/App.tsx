import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/query-client'
import { AppRouter } from '@/routes'
import { useRestoreSession } from '@/features/auth/useRestoreSession'

function AppWithSession(): React.ReactElement {
  useRestoreSession()
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

export function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithSession />
    </QueryClientProvider>
  )
}
