import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { X, Building2, Users, DollarSign, Mail } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
import { createComplexSchema } from './tenant.types'
import { useCreateComplex } from './useTenantActions'
import type { TCreateComplexPayload } from './tenant.types'
import type { z } from 'zod'

type FormValues = z.infer<typeof createComplexSchema>

interface AddComplexModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddComplexModal({ open, onOpenChange }: AddComplexModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const createComplex = useCreateComplex()

  const form = useForm<FormValues>({
    resolver: zodResolver(createComplexSchema),
    defaultValues: {
      complex_name: '',
      unit_count: undefined,
      price_per_unit: undefined,
      pm_full_name: '',
      pm_email: '',
    },
  })

  const unitCount = form.watch('unit_count')
  const pricePerUnit = form.watch('price_per_unit')
  const showCalc = unitCount > 0 && pricePerUnit >= 2 && pricePerUnit <= 5
  const monthly = showCalc ? (unitCount * pricePerUnit).toFixed(2) : null

  const handleSubmit = (values: FormValues) => {
    setSubmitError(null)
    const payload: TCreateComplexPayload = {
      complex_name: values.complex_name,
      unit_count: values.unit_count,
      price_per_unit: values.price_per_unit,
      pm_full_name: values.pm_full_name,
      pm_email: values.pm_email,
    }
    createComplex.mutate(payload, {
      onSuccess: () => {
        toast.success(TENANT_COPY.ADD_COMPLEX_SUCCESS.replace('{email}', values.pm_email))
        form.reset()
        onOpenChange(false)
      },
      onError: (err) => {
        setSubmitError(getErrorMessage(err))
      },
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset()
      setSubmitError(null)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden bg-white p-0 text-zinc-900 sm:max-w-lg [&>button]:hidden">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <Building2 className="h-4 w-4 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                {TENANT_COPY.ADD_COMPLEX_TITLE}
              </h2>
              <p className="text-xs text-zinc-500">{TENANT_COPY.ADD_COMPLEX_DESCRIPTION}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              handleOpenChange(false)
            }}
            className="mt-0.5 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="space-y-0 divide-y divide-zinc-100">
              {/* Complex section */}
              <div className="space-y-4 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Complex
                </p>

                <FormField
                  control={form.control}
                  name="complex_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="complex_name"
                        className="text-xs font-medium text-zinc-700"
                      >
                        Complex Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                          <Input
                            id="complex_name"
                            placeholder="e.g. Sunset Ridge Apartments"
                            className="border-zinc-200 bg-white pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="unit_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="unit_count"
                          className="text-xs font-medium text-zinc-700"
                        >
                          Total Units
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                            <Input
                              id="unit_count"
                              type="number"
                              min={1}
                              max={10000}
                              placeholder="120"
                              className="border-zinc-200 bg-white pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber)
                              }}
                            />
                          </div>
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
                        <FormLabel
                          htmlFor="price_per_unit"
                          className="text-xs font-medium text-zinc-700"
                        >
                          Price / Unit
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                            <Input
                              id="price_per_unit"
                              type="number"
                              min={2}
                              max={5}
                              step={0.01}
                              placeholder="3.00"
                              className="border-zinc-200 bg-white pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber)
                              }}
                            />
                          </div>
                        </FormControl>
                        <p className="mt-1 text-[11px] text-zinc-400">$2.00 – $5.00 per unit</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Billing estimate */}
                {showCalc && monthly !== null && (
                  <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-3">
                    <p className="text-xs text-zinc-400">
                      {unitCount} units × ${pricePerUnit.toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      ${monthly} <span className="font-normal text-zinc-400">/month</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Property Manager section */}
              <div className="space-y-4 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Property Manager
                </p>

                <FormField
                  control={form.control}
                  name="pm_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="pm_full_name"
                        className="text-xs font-medium text-zinc-700"
                      >
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="pm_full_name"
                          placeholder="e.g. Jane Smith"
                          className="border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pm_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="pm_email" className="text-xs font-medium text-zinc-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                          <Input
                            id="pm_email"
                            type="email"
                            placeholder="e.g. jane@complex.com"
                            className="border-zinc-200 bg-white pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        An invite link will be sent to this address.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {submitError && (
              <div className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            )}

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="flex gap-2.5 border-t border-zinc-200 bg-zinc-50 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-zinc-300 bg-white text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                onClick={() => {
                  handleOpenChange(false)
                }}
              >
                {TENANT_COPY.CANCEL_LABEL}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-zinc-900 text-sm text-white hover:bg-zinc-700"
                disabled={createComplex.isPending}
              >
                {createComplex.isPending ? 'Creating…' : TENANT_COPY.ADD_COMPLEX_SUBMIT}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
