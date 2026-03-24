import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useToggleFeatureFlag } from './useFeatureFlags'
import type { FeatureFlag, FlagCategory } from './featureFlag.types'

const CATEGORY_CLASSES: Record<FlagCategory, string> = {
  billing: 'bg-amber-100 text-amber-700 border-amber-200',
  ui: 'bg-blue-100 text-blue-700 border-blue-200',
  feature: 'bg-purple-100 text-purple-700 border-purple-200',
  experiment: 'bg-slate-100 text-slate-600 border-slate-200',
}

interface FeatureFlagRowProps {
  flag: FeatureFlag
}

export function FeatureFlagRow({ flag }: FeatureFlagRowProps) {
  const [pendingState, setPendingState] = useState<boolean | null>(null)
  const { mutate: toggle, isPending } = useToggleFeatureFlag()

  const handleToggle = (next: boolean) => {
    if (flag.affectsBilling) {
      setPendingState(next)
    } else {
      toggle({ id: flag.id, isEnabled: next })
    }
  }

  const confirmToggle = () => {
    if (pendingState !== null) {
      toggle({ id: flag.id, isEnabled: pendingState })
      setPendingState(null)
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{flag.name}</span>
            {flag.affectsBilling && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>Affects billing — requires confirmation</TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
        </TableCell>
        <TableCell>
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{flag.key}</code>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={`text-xs capitalize ${CATEGORY_CLASSES[flag.category]}`}
          >
            {flag.category}
          </Badge>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {new Date(flag.updatedAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Switch
            checked={flag.isEnabled}
            disabled={isPending}
            aria-label={`Toggle ${flag.name}`}
            onCheckedChange={(checked) => {
              handleToggle(checked)
            }}
          />
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={pendingState !== null}
        onOpenChange={(open) => {
          if (!open) setPendingState(null)
        }}
        title="Billing-affecting flag"
        description={`Toggling "${flag.name}" will affect active subscriptions and billing. Are you sure?`}
        confirmLabel={pendingState ? 'Enable' : 'Disable'}
        variant="destructive"
        isLoading={isPending}
        onConfirm={confirmToggle}
      />
    </>
  )
}
