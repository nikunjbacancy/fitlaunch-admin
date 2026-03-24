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
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flag</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Enabled</TableHead>
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
                  icon={<Flag className="h-8 w-8 text-muted-foreground" />}
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
    </div>
  )
}
