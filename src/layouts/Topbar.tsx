import { Bell, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Breadcrumb } from './Breadcrumb'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  property_owner: 'Property Owner',
  property_manager: 'Property Manager',
  trainer: 'Trainer',
}

interface TopbarProps {
  onMobileMenuToggle: () => void
}

export function Topbar({ onMobileMenuToggle }: TopbarProps): React.ReactElement {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 bg-kmvmt-white/80 px-6 shadow-[0px_10px_40px_rgba(25,38,64,0.06)] backdrop-blur-md shrink-0">
      {/* Left: mobile toggle + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
          className="lg:hidden p-1.5 rounded-md hover:bg-kmvmt-bg transition-colors shrink-0"
        >
          <Menu className="w-5 h-5 text-kmvmt-navy" />
        </button>
        <Breadcrumb />
      </div>

      {/* Right: notifications + divider + role badge + avatar */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Notification bell with badge */}
        <button
          aria-label="Notifications"
          className="relative p-1.5 rounded-md text-kmvmt-navy/60 hover:text-kmvmt-navy hover:bg-kmvmt-bg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-kmvmt-burgundy border-2 border-kmvmt-white" />
        </button>

        <div className="w-px h-6 bg-zinc-200" />

        {/* Role badge */}
        {user && (
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kmvmt-navy text-white text-xs font-bold uppercase">
              {user.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-kmvmt-navy leading-tight">{user.fullName}</p>
              <p className="text-[10px] text-kmvmt-navy/40 leading-tight">
                {ROLE_LABELS[user.role] ?? user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
