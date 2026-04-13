import { Navigate, Outlet } from 'react-router-dom'
// useLocation was used for the onboarding wizard redirect (see commented block below).
// Re-add the import if the wizard flow is restored.
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
  // skipOnboardingCheck prop retained in the interface for easy restore of the
  // commented-out wizard redirect below. Prefixed with _ so ESLint ignores it.
  skipOnboardingCheck: _skipOnboardingCheck = false,
}: ProtectedRouteProps): React.ReactElement {
  const {
    isAuthenticated,
    user,
    isTwoFactorVerified,
    isRestoringSession,
    // tenantOnboardingStep, // disabled: onboarding wizard removed — branding/units are post-login
    // isOwnerManagedTenant, // disabled: no longer needed here (was part of wizard bypass)
  } = useAuthStore()
  // const { pathname } = useLocation() // disabled with wizard redirect

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

  // ── Onboarding wizard redirect (DISABLED) ─────────────────────────────────
  // Previously, standalone PMs were forced through /pm/setup (branding + units
  // wizard) until tenantOnboardingStep === 'active'. Product decision
  // (2026-04-13): branding and unit directory are now post-login tasks.
  // Restore this block — and the tenantOnboardingStep / isOwnerManagedTenant /
  // pathname destructures above — if the wizard flow is reinstated.
  //
  // if (
  //   !skipOnboardingCheck &&
  //   user.role === 'property_manager' &&
  //   pathname !== '/pm/setup' &&
  //   tenantOnboardingStep !== null &&
  //   tenantOnboardingStep !== 'active' &&
  //   !isOwnerManagedTenant
  // ) {
  //   return <Navigate to="/pm/setup" replace />
  // }

  return <Outlet />
}
