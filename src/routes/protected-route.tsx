import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/types/auth.types'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  requireTwoFactor?: boolean
  skipOnboardingCheck?: boolean
}

export function ProtectedRoute({
  allowedRoles,
  requireTwoFactor = false,
  skipOnboardingCheck = false,
}: ProtectedRouteProps): React.ReactElement {
  const {
    isAuthenticated,
    user,
    isTwoFactorVerified,
    isRestoringSession,
    tenantOnboardingStep,
    isOwnerManagedTenant,
  } = useAuthStore()
  const { pathname } = useLocation()

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

  // Redirect property managers through onboarding wizard until they are active
  // Owner-managed PMs skip the wizard — branding and units are handled by the owner
  if (
    !skipOnboardingCheck &&
    user.role === 'property_manager' &&
    pathname !== '/pm/setup' &&
    tenantOnboardingStep !== null &&
    tenantOnboardingStep !== 'active' &&
    !isOwnerManagedTenant
  ) {
    return <Navigate to="/pm/setup" replace />
  }

  return <Outlet />
}
