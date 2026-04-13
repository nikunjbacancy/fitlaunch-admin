import type { ReactNode } from 'react'
import { ChevronRight, SlidersHorizontal, Download } from 'lucide-react'

interface PageShellProps {
  /** e.g. ['KMVMT', 'Owner Groups'] — last item rendered in navy */
  breadcrumb: string[]
  title: string
  /** Primary CTA button rendered top-right */
  cta?: ReactNode
  /** 3 KpiCard nodes */
  kpiCards?: ReactNode
  /** Inline horizontal stats bar (alternative to kpiCards) */
  statsBar?: ReactNode
  /** Title shown in the table card header */
  tableTitle?: string
  /** Shows filter + download icon buttons in table header when true */
  tableActions?: boolean
  /** Filters/search bar rendered above the table body */
  filters?: ReactNode
  /** Pagination rendered below the table body */
  pagination?: ReactNode
  children: ReactNode
}

export function PageShell({
  breadcrumb,
  title,
  cta,
  kpiCards,
  statsBar,
  tableTitle,
  tableActions = false,
  filters,
  pagination,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-10">
      {/* ── Page header ── */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/40">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className={i === breadcrumb.length - 1 ? 'text-kmvmt-navy' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-kmvmt-navy">{title}</h1>
        </div>
        {cta}
      </div>

      {/* ── KPI cards ── */}
      {kpiCards && <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{kpiCards}</div>}

      {/* ── Inline stats bar (alternative to kpiCards) ── */}
      {statsBar && statsBar}

      {/* ── Table card ── */}
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        {/* Table card header */}
        {(tableTitle ?? tableActions) && (
          <div className="flex items-center justify-between bg-kmvmt-bg/30 px-8 py-5">
            {tableTitle && (
              <h3 className="text-lg font-bold tracking-tight text-kmvmt-navy">{tableTitle}</h3>
            )}
            {tableActions && (
              <div className="flex items-center gap-1">
                <button
                  aria-label="Filter"
                  className="rounded-lg p-2 text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
                <button
                  aria-label="Download"
                  className="rounded-lg p-2 text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Optional filters row */}
        {filters && <div className="border-b border-kmvmt-bg px-8 py-4">{filters}</div>}

        {/* Table body */}
        <div>{children}</div>

        {/* Pagination */}
        {pagination && (
          <div className="border-t border-kmvmt-bg bg-kmvmt-bg/20 px-8 py-5">{pagination}</div>
        )}
      </div>
    </div>
  )
}

/** Gradient primary CTA button used in page headers */
export function PageCta({
  label,
  icon,
  onClick,
}: {
  label: string
  icon?: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
    >
      {icon}
      {label}
    </button>
  )
}
