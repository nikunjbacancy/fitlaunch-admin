import { Flag } from 'lucide-react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useFeatureFlags } from './useFeatureFlags'
import { FeatureFlagRow } from './FeatureFlagRow'

const COLUMNS = 5

export function FeatureFlagList() {
  const { data: flags, isLoading, isError, refetch } = useFeatureFlags()

  if (isError) {
    return (
      <ErrorState
        title="Failed to load feature flags"
        description="Could not fetch feature flag configuration."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-kmvmt-bg/50 hover:bg-kmvmt-bg/50">
          <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
            Flag
          </TableHead>
          <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
            Key
          </TableHead>
          <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
            Category
          </TableHead>
          <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
            Last Updated
          </TableHead>
          <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
            Enabled
          </TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} />
      ) : !flags?.length ? (
        <TableBody>
          <TableRow>
            <td colSpan={COLUMNS}>
              <EmptyState
                title="No feature flags"
                description="No feature flags have been configured yet."
                icon={<Flag className="h-8 w-8 text-kmvmt-navy/30" />}
              />
            </td>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {flags.map((flag) => (
            <FeatureFlagRow key={flag.id} flag={flag} />
          ))}
        </TableBody>
      )}
    </Table>
  )
}
