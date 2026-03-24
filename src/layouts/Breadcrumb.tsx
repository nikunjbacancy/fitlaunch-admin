import { useLocation, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Map path segments to human-readable labels
const SEGMENT_LABELS: Record<string, string> = {
  'super-admin': 'Super Admin',
  tenants: 'Tenants',
  onboarding: 'B2B Onboarding',
  billing: 'Billing',
  'promo-codes': 'Promo Codes',
  analytics: 'Analytics',
  'feature-flags': 'Feature Flags',
  support: 'Support Queue',
  dashboard: 'Dashboard',
  residents: 'Residents',
  units: 'Units',
  challenges: 'Challenges',
  branding: 'Branding',
  equipment: 'Equipment',
  trainer: 'Trainer',
  clients: 'Clients',
  programs: 'Programs',
  'check-ins': 'Check-Ins',
  messages: 'Messages',
}

interface Crumb {
  label: string
  path: string
  isLast: boolean
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    // If segment looks like an ID (uuid or number), label it 'Detail'
    const isId = /^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)
    const label = isId ? 'Detail' : (SEGMENT_LABELS[segment] ?? segment)

    return {
      label,
      path,
      isLast: index === segments.length - 1,
    }
  })
}

export function Breadcrumb(): React.ReactElement {
  const { pathname } = useLocation()
  const crumbs = buildCrumbs(pathname)

  if (crumbs.length === 0) return <span />

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1">
            {!crumb.isLast ? (
              <>
                <Link
                  to={crumb.path}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              </>
            ) : (
              <span className={cn('font-medium text-foreground')} aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
