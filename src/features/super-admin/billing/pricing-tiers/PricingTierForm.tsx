import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePermissions } from '@/hooks/use-permissions'
import { usePricingTiers, useUpdatePricingTiers } from './usePricingTiers'
import {
  pricingTierFormSchema,
  type PricingTierFormValues,
  type TierName,
} from './pricingTier.types'

const TIERS: { name: TierName; label: string; description: string }[] = [
  { name: 'starter', label: 'Starter', description: 'For individual trainers starting out' },
  { name: 'growth', label: 'Growth', description: 'For growing fitness businesses' },
  { name: 'pro', label: 'Pro', description: 'Unlimited — for established operations' },
]

function TierFieldGroup({
  tier,
  register,
  errors,
  disabled,
}: {
  tier: (typeof TIERS)[number]
  register: ReturnType<typeof useForm<PricingTierFormValues>>['register']
  errors: ReturnType<typeof useForm<PricingTierFormValues>>['formState']['errors']
  disabled: boolean
}) {
  const tierErrors = errors[tier.name]

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{tier.label}</p>
        <p className="text-xs text-muted-foreground">{tier.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${tier.name}-monthly`} className="text-xs">
            Monthly Price ($)
          </Label>
          <Input
            id={`${tier.name}-monthly`}
            type="number"
            min={0}
            step={0.01}
            disabled={disabled}
            {...register(`${tier.name}.monthlyPrice`, { valueAsNumber: true })}
          />
          {tierErrors?.monthlyPrice && (
            <p className="text-xs text-destructive">{tierErrors.monthlyPrice.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${tier.name}-annual`} className="text-xs">
            Annual Price ($)
          </Label>
          <Input
            id={`${tier.name}-annual`}
            type="number"
            min={0}
            step={0.01}
            disabled={disabled}
            {...register(`${tier.name}.annualPrice`, { valueAsNumber: true })}
          />
          {tierErrors?.annualPrice && (
            <p className="text-xs text-destructive">{tierErrors.annualPrice.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function PricingTierForm() {
  const { can } = usePermissions()
  const canManage = can('edit_pricing_tiers')
  const { data, isLoading, isError, refetch } = usePricingTiers()
  const { mutate: updatePricing, isPending } = useUpdatePricingTiers()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingTierFormValues>({
    resolver: zodResolver(pricingTierFormSchema),
  })

  useEffect(() => {
    if (!data) return
    const find = (name: TierName) => data.tiers.find((t) => t.name === name)
    const starter = find('starter')
    const growth = find('growth')
    const pro = find('pro')
    reset({
      starter: {
        monthlyPrice: starter?.monthlyPrice ?? 0,
        annualPrice: starter?.annualPrice ?? 0,
        maxMembers: starter?.maxMembers ?? 10,
      },
      growth: {
        monthlyPrice: growth?.monthlyPrice ?? 0,
        annualPrice: growth?.annualPrice ?? 0,
        maxMembers: growth?.maxMembers ?? 30,
      },
      pro: {
        monthlyPrice: pro?.monthlyPrice ?? 0,
        annualPrice: pro?.annualPrice ?? 0,
        maxMembers: null,
      },
      perUnitApartmentRate: data.perUnitApartmentRate,
    })
  }, [data, reset])

  const onSubmit = (values: PricingTierFormValues) => {
    updatePricing(values)
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load pricing"
        description="Could not fetch current pricing configuration."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Platform Pricing</CardTitle>
            <CardDescription className="mt-1">
              Set monthly and annual prices for each subscription tier.
            </CardDescription>
          </div>
          {!canManage && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Read-only
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e)
            }}
            noValidate
            className="space-y-6"
          >
            {TIERS.map((tier, index) => (
              <div key={tier.name}>
                <TierFieldGroup
                  tier={tier}
                  register={register}
                  errors={errors}
                  disabled={!canManage || isPending}
                />
                {index < TIERS.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}

            <Separator />

            {/* Per-unit apartment rate */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Apartment (Per Unit)</p>
                <p className="text-xs text-muted-foreground">
                  Monthly rate charged per residential unit for property manager tenants
                </p>
              </div>
              <div className="max-w-xs space-y-1.5">
                <Label htmlFor="perUnitRate" className="text-xs">
                  Rate per unit / month ($)
                </Label>
                <Input
                  id="perUnitRate"
                  type="number"
                  min={0}
                  step={0.01}
                  disabled={!canManage || isPending}
                  {...register('perUnitApartmentRate', { valueAsNumber: true })}
                />
                {errors.perUnitApartmentRate && (
                  <p className="text-xs text-destructive">{errors.perUnitApartmentRate.message}</p>
                )}
              </div>
            </div>

            {canManage && (
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Pricing'
                )}
              </Button>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
