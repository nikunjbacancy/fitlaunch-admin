import { NavLink, useLocation } from 'react-router-dom'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import kmvmtLogo from '@/assets/logo_bg_white.png'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { NAV_CONFIG } from './nav-config'

export function Sidebar(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navGroups = user ? NAV_CONFIG[user.role] : []

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-kmvmt-navy text-white transition-all duration-200 shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <img src={kmvmtLogo} alt="KMVMT" className="w-10 h-10 rounded-xl object-contain shrink-0" />
        {!collapsed && <span className="font-semibold text-white truncate">KMVMT</span>}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => {
          setCollapsed((c) => !c)
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[4.5rem] z-10 w-6 h-6 rounded-full bg-kmvmt-navy border border-white/20 flex items-center justify-center hover:bg-kmvmt-blue-light/20 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.title && !collapsed && (
              <p className="px-3 mb-1 text-xs font-medium text-kmvmt-blue-light/60 uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.path === location.pathname ||
                  (item.path !== '/super-admin' &&
                    item.path !== '/dashboard' &&
                    item.path !== '/trainer' &&
                    location.pathname.startsWith(item.path))

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="ml-auto text-xs bg-kmvmt-blue-light/20 text-kmvmt-blue-light px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-2 py-3 border-t border-white/10 shrink-0">
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg mb-1',
              collapsed && 'justify-center'
            )}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-kmvmt-blue-light/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-kmvmt-blue-light uppercase">
                {user.fullName.charAt(0)}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.fullName}</p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
