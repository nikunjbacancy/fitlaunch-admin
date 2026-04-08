import { lazy, Suspense, type ReactElement } from 'react'
import { Loader2 } from 'lucide-react'

function PageLoader(): ReactElement {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

// Helper — wraps a lazy-loaded default export as a React element
function lazyEl(factory: () => Promise<{ default: React.ComponentType }>): React.ReactElement {
  const Component = lazy(factory)
  return <Component />
}

const router = createBrowserRouter([
  // ─── Login — no layout wrapper (full-screen split panel) ─────────────────
  { path: '/login', element: lazyEl(() => import('@/pages/login')) },

  // ─── Public (Auth layout) ─────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/two-factor', element: lazyEl(() => import('@/pages/two-factor')) },
      { path: '/unauthorized', element: lazyEl(() => import('@/pages/unauthorized')) },
    ],
  },

  // ─── Invite flow (no auth, no layout) ────────────────────────────────────
  { path: '/invite/accept', element: lazyEl(() => import('@/pages/invite/accept')) },

  // ─── Super Admin (Admin layout + role guard + 2FA) ────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['super_admin']} requireTwoFactor />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/super-admin', element: lazyEl(() => import('@/pages/super-admin/dashboard')) },
          {
            path: '/super-admin/tenants',
            element: lazyEl(() => import('@/pages/super-admin/tenants')),
          },
          {
            path: '/super-admin/tenants/:id',
            element: lazyEl(() => import('@/pages/super-admin/tenant-detail')),
          },
          {
            path: '/super-admin/owner-groups',
            element: lazyEl(() => import('@/pages/super-admin/owner-groups')),
          },
          {
            path: '/super-admin/trainers',
            element: lazyEl(() => import('@/pages/super-admin/trainers')),
          },
          {
            path: '/super-admin/onboarding',
            element: lazyEl(() => import('@/pages/super-admin/onboarding')),
          },
          {
            path: '/super-admin/billing',
            element: lazyEl(() => import('@/pages/super-admin/billing')),
          },
          {
            path: '/super-admin/promo-codes',
            element: lazyEl(() => import('@/pages/super-admin/promo-codes')),
          },
          {
            path: '/super-admin/analytics',
            element: lazyEl(() => import('@/pages/super-admin/analytics')),
          },
          {
            path: '/super-admin/feature-flags',
            element: lazyEl(() => import('@/pages/super-admin/feature-flags')),
          },
          {
            path: '/super-admin/support',
            element: lazyEl(() => import('@/pages/super-admin/support')),
          },
        ],
      },
    ],
  },

  // ─── Property Owner (Admin layout + role guard + 2FA) ─────────────────────
  {
    element: <ProtectedRoute allowedRoles={['property_owner']} requireTwoFactor />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/property-owner',
            element: lazyEl(() => import('@/pages/property-owner/dashboard')),
          },
          {
            path: '/property-owner/locations',
            element: lazyEl(() => import('@/pages/property-owner/locations')),
          },
          {
            path: '/property-owner/locations/:id',
            element: lazyEl(() => import('@/pages/property-owner/location-detail')),
          },
          {
            path: '/property-owner/comparison',
            element: lazyEl(() => import('@/pages/property-owner/comparison')),
          },
          {
            path: '/property-owner/managers',
            element: lazyEl(() => import('@/pages/property-owner/managers')),
          },
          {
            path: '/property-owner/representatives',
            element: lazyEl(() => import('@/pages/property-owner/representatives')),
          },
          {
            path: '/property-owner/branding',
            element: lazyEl(() => import('@/pages/property-owner/branding')),
          },
          {
            path: '/property-owner/billing',
            element: lazyEl(() => import('@/pages/property-owner/billing')),
          },
        ],
      },
    ],
  },

  // ─── PM Setup (protected: PM + 2FA, onboarding check bypassed) ──────────
  {
    element: (
      <ProtectedRoute allowedRoles={['property_manager']} requireTwoFactor skipOnboardingCheck />
    ),
    children: [
      { path: '/pm/setup', element: lazyEl(() => import('@/pages/property-manager/setup')) },
    ],
  },

  // ─── Property Manager (Admin layout + role guard + 2FA) ───────────────────
  {
    element: <ProtectedRoute allowedRoles={['property_manager']} requireTwoFactor />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/dashboard',
            element: lazyEl(() => import('@/pages/property-manager/dashboard')),
          },
          {
            path: '/residents',
            element: lazyEl(() => import('@/pages/property-manager/residents')),
          },
          { path: '/units', element: lazyEl(() => import('@/pages/property-manager/units')) },
          {
            path: '/challenges',
            element: lazyEl(() => import('@/pages/property-manager/challenges')),
          },
          { path: '/branding', element: lazyEl(() => import('@/pages/property-manager/branding')) },
        ],
      },
    ],
  },

  // ─── Trainer (Admin layout + role guard + 2FA) ────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['trainer']} requireTwoFactor />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/trainer', element: lazyEl(() => import('@/pages/trainer/dashboard')) },
          { path: '/trainer/clients', element: lazyEl(() => import('@/pages/trainer/clients')) },
          {
            path: '/trainer/clients/:id',
            element: lazyEl(() => import('@/pages/trainer/client-detail')),
          },
          { path: '/trainer/programs', element: lazyEl(() => import('@/pages/trainer/programs')) },
          {
            path: '/trainer/check-ins',
            element: lazyEl(() => import('@/pages/trainer/check-ins')),
          },
          { path: '/trainer/messages', element: lazyEl(() => import('@/pages/trainer/messages')) },
        ],
      },
    ],
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  { path: '/', element: lazyEl(() => import('@/pages/root-redirect')) },
  { path: '*', element: lazyEl(() => import('@/pages/not-found')) },
])

export function AppRouter(): React.ReactElement {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
