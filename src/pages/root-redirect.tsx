import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function RootRedirectPage(): React.ReactElement {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const roleRedirects = {
    super_admin: '/super-admin',
    property_manager: '/dashboard',
    trainer: '/trainer',
  }

  return <Navigate to={roleRedirects[user.role]} replace />
}
