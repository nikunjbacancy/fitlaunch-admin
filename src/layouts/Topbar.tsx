import { Bell, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Breadcrumb } from './Breadcrumb'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  property_manager: 'Property Manager',
  trainer: 'Trainer',
}

interface TopbarProps {
  onMobileMenuToggle: () => void
}

export function Topbar({ onMobileMenuToggle }: TopbarProps): React.ReactElement {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
        className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications placeholder */}
        <button
          aria-label="Notifications"
          className="relative p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-500" />
        </button>

        {/* Role badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        )}
      </div>
    </header>
  )
}
