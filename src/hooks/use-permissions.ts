import { useAuthStore } from '@/store/auth.store'
import { hasPermission, type PermissionAction } from '@/lib/permissions'

interface UsePermissionsReturn {
  can: (action: PermissionAction) => boolean
  role: string | null
}

export function usePermissions(): UsePermissionsReturn {
  const user = useAuthStore((s) => s.user)

  return {
    can: (action: PermissionAction) => {
      if (!user) return false
      return hasPermission(user.role, action)
    },
    role: user?.role ?? null,
  }
}
