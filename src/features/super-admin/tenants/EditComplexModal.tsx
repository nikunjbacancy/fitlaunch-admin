import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/errors'
import { TENANT_COPY } from './constants'
import { updateComplexSchema } from './tenant.types'
import { useUpdateComplex } from './useTenantActions'
import type { TenantListItem, TUpdateComplexPayload } from './tenant.types'
import type { z } from 'zod'

type FormValues = z.infer<typeof updateComplexSchema>

interface EditComplexModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantListItem
}

export function EditComplexModal({ open, onOpenChange, tenant }: EditComplexModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const updateComplex = useUpdateComplex()

  const form = useForm<FormValues>({
    resolver: zodResolver(updateComplexSchema),
    defaultValues: {
      complex_name: tenant.app_display_name ?? undefined,
      unit_count: tenant.unit_count ?? undefined,
      price_per_unit: tenant.price_per_unit ?? undefined,
    },
  })

  // Re-seed defaults when tenant prop changes
  useEffect(() => {
    if (open) {
      form.reset({
        complex_name: tenant.app_display_name ?? undefined,
        unit_count: tenant.unit_count ?? undefined,
        price_per_unit: tenant.price_per_unit ?? undefined,
      })
      setSubmitError(null)
    }
  }, [open, tenant, form])

  const unitCount = form.watch('unit_count')
  const pricePerUnit = form.watch('price_per_unit')
  const showCalculation = unitCount > 0 && pricePerUnit >= 2 && pricePerUnit <= 5

  const monthly = showCalculation ? (unitCount * pricePerUnit).toFixed(2) : null

  const handleSubmit = (values: FormValues) => {
    setSubmitError(null)
    const payload: TUpdateComplexPayload = {}
    if (values.complex_name !== undefined) payload.complex_name = values.complex_name
    if (values.unit_count !== undefined) payload.unit_count = values.unit_count
    if (values.price_per_unit !== undefined) payload.price_per_unit = values.price_per_unit

    updateComplex.mutate(
      { id: tenant.id, payload },
      {
        onSuccess: () => {
          toast.success(TENANT_COPY.EDIT_COMPLEX_SUCCESS)
          onOpenChange(false)
        },
        onError: (err) => {
          setSubmitError(getErrorMessage(err))
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{TENANT_COPY.EDIT_COMPLEX_TITLE}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="complex_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit_complex_name">Complex Name</FormLabel>
                  <FormControl>
                    <Input id="edit_complex_name" placeholder="Sunset Apartments" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="edit_unit_count">Total Unit Count</FormLabel>
                    <FormControl>
                      <Input
                        id="edit_unit_count"
                        type="number"
                        min={1}
                        max={10000}
                        placeholder="120"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="edit_price_per_unit">Price Per Unit ($2–$5)</FormLabel>
                    <FormControl>
                      <Input
                        id="edit_price_per_unit"
                        type="number"
                        min={2}
                        max={5}
                        step={0.01}
                        placeholder="3.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showCalculation && (
              <p className="text-sm text-muted-foreground">
                {unitCount} units × ${pricePerUnit.toFixed(2)} ={' '}
                <span className="font-medium text-foreground">${monthly}/month</span>
              </p>
            )}

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                }}
              >
                {TENANT_COPY.CANCEL_LABEL}
              </Button>
              <Button type="submit" disabled={updateComplex.isPending}>
                {updateComplex.isPending ? 'Saving…' : TENANT_COPY.EDIT_COMPLEX_SUBMIT}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
