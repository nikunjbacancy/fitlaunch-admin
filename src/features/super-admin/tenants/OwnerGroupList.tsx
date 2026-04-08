import { useState } from 'react'
import { Plus, UsersRound, RotateCw } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useOwnerGroups } from './useTenantActions'
import { CreateOwnerGroupModal } from './CreateOwnerGroupModal'
import { TENANT_COPY } from './constants'

const COLUMNS = 7

const OWNER_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  invited: {
    label: 'Invite Sent',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  password_set: {
    label: 'Password Set',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
}

export function OwnerGroupList() {
  const { data, isLoading, isError, refetch } = useOwnerGroups()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <PageHeader
          title={TENANT_COPY.OWNER_GROUPS_TITLE}
          description={TENANT_COPY.OWNER_GROUPS_DESCRIPTION}
        />
        <Button
          className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
          onClick={() => {
            setCreateOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {TENANT_COPY.ADD_OWNER_GROUP}
        </Button>
      </div>

      {isLoading ? (
        <DataTableSkeleton columns={COLUMNS} rows={5} />
      ) : isError ? (
        <ErrorState
          title={TENANT_COPY.ERROR_LOAD}
          description="Could not load owner groups."
          onRetry={() => {
            void refetch()
          }}
        />
      ) : !data?.length ? (
        <EmptyState
          icon={<UsersRound className="h-8 w-8" />}
          title="No owner groups yet"
          description="Create an owner group to link multiple apartment complexes under one owner."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Total Units</TableHead>
                <TableHead>Total MRR</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((group) => {
                const statusConfig =
                  OWNER_STATUS_BADGE[group.owner_status] ?? OWNER_STATUS_BADGE.invited
                return (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium text-kmvmt-navy">{group.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-kmvmt-navy">
                          {group.owner_full_name}
                        </p>
                        <p className="text-xs text-kmvmt-navy/50">{group.owner_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                        {group.owner_status === 'invited' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-kmvmt-navy/40 hover:text-kmvmt-navy"
                                  aria-label="Resend invite"
                                >
                                  <RotateCw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Resend invite</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-kmvmt-navy">{group.location_count}</TableCell>
                    <TableCell className="text-kmvmt-navy">{group.total_units}</TableCell>
                    <TableCell className="text-kmvmt-navy">${group.total_mrr.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-xs text-kmvmt-navy/50">
                      {group.created_at ? new Date(group.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateOwnerGroupModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
