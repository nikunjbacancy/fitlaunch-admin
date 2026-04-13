import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  icon: ReactNode
  badge?: string
  badgePositive?: boolean
  footer?: ReactNode
  variant?: 'default' | 'dark'
  isLoading?: boolean
}

export function KpiCard({
  title,
  value,
  icon,
  badge,
  badgePositive = true,
  footer,
  variant = 'default',
  isLoading,
}: KpiCardProps) {
  const isDark = variant === 'dark'

  if (isLoading) {
    return (
      <div
        className={cn(
          'h-[148px] animate-pulse rounded-xl',
          isDark ? 'bg-kmvmt-navy/80' : 'bg-kmvmt-white'
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.06)] transition-transform duration-300 hover:-translate-y-0.5',
        isDark ? 'bg-gradient-to-br from-kmvmt-navy to-[#2c3e5a] text-white' : 'bg-kmvmt-white'
      )}
    >
      {isDark && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(154,41,44,0.2),transparent_60%)]" />
      )}

      <div className="relative z-10">
        {/* Icon + badge row */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              isDark
                ? 'bg-gradient-to-br from-kmvmt-burgundy to-kmvmt-red-light text-white shadow-md ring-1 ring-white/20'
                : 'bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light text-white shadow-md shadow-kmvmt-navy/20'
            )}
          >
            <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          </div>

          {badge && (
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest',
                isDark
                  ? 'bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md'
                  : badgePositive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-kmvmt-red-dark/10 text-kmvmt-red-dark'
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Value */}
        <p
          className={cn(
            'mb-1 text-3xl font-extrabold tracking-tighter tabular-nums',
            isDark ? 'text-white' : 'text-kmvmt-navy'
          )}
        >
          {value}
        </p>

        {/* Title */}
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-[0.15em]',
            isDark ? 'text-white/50' : 'text-kmvmt-navy/40'
          )}
        >
          {title}
        </p>
      </div>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            'relative z-10 mt-4 border-t pt-3',
            isDark ? 'border-white/10' : 'border-zinc-100'
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
