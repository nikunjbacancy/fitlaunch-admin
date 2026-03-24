import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createPromoCodeSchema, type CreatePromoCodeValues } from './promoCode.types'
import { useCreatePromoCode } from './usePromoCodes'
import { MIN_CODE_LENGTH, DISCOUNT_TYPE_LABELS } from './promoCode.constants'

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

interface CreatePromoCodeFormProps {
  onSuccess?: () => void
}

export function CreatePromoCodeForm({ onSuccess }: CreatePromoCodeFormProps) {
  const { mutate: createCode, isPending } = useCreatePromoCode()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePromoCodeValues>({
    resolver: zodResolver(createPromoCodeSchema),
    defaultValues: {
      discountType: 'percent',
      maxUses: null,
      expiresAt: null,
    },
  })

  const discountType = watch('discountType')

  const onSubmit = (values: CreatePromoCodeValues) => {
    createCode(values, {
      onSuccess: () => {
        reset()
        onSuccess?.()
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Promo Code</CardTitle>
        <CardDescription>
          Generate a new discount code for tenants. Minimum {MIN_CODE_LENGTH} characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e)
          }}
          noValidate
          className="space-y-4"
        >
          {/* Code */}
          <div className="space-y-1.5">
            <Label htmlFor="code">Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="SUMMER25"
                className="uppercase"
                disabled={isPending}
                {...register('code')}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Generate random code"
                onClick={() => {
                  setValue('code', generateCode(), { shouldValidate: true })
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Discount type */}
            <div className="space-y-1.5">
              <Label htmlFor="discountType">Type</Label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v)
                    }}
                  >
                    <SelectTrigger id="discountType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISCOUNT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Discount value */}
            <div className="space-y-1.5">
              <Label htmlFor="discountValue">
                {discountType === 'percent' ? 'Discount (%)' : 'Amount ($)'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                min={1}
                max={discountType === 'percent' ? 100 : undefined}
                disabled={isPending}
                {...register('discountValue', { valueAsNumber: true })}
              />
              {errors.discountValue && (
                <p className="text-xs text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Max uses */}
            <div className="space-y-1.5">
              <Label htmlFor="maxUses">Max Uses (optional)</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                placeholder="Unlimited"
                disabled={isPending}
                {...register('maxUses', {
                  setValueAs: (v: string) => (v === '' ? null : Number(v)),
                })}
              />
            </div>

            {/* Expiry */}
            <div className="space-y-1.5">
              <Label htmlFor="expiresAt">Expires At (optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                disabled={isPending}
                {...register('expiresAt', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              'Create Promo Code'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
