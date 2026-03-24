import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/types/auth.types'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  requireTwoFactor?: boolean
}

export function ProtectedRoute({
  allowedRoles,
  requireTwoFactor = false,
}: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, user, isTwoFactorVerified, isRestoringSession } = useAuthStore()

  // Wait for session restore before making any auth decisions
  if (isRestoringSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requireTwoFactor && !isTwoFactorVerified) {
    return <Navigate to="/two-factor" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
