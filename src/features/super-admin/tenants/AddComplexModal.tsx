import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Mail, Users, Calculator } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

const LABEL_CLASS = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy'

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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden rounded-[2rem] shadow-[0px_20px_60px_rgba(25,38,64,0.12)]">
        {/* Gradient glow — top-right */}
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            {/* Centered heading */}
            <div className="px-10 pb-2 pt-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
                {TENANT_COPY.ADD_COMPLEX_TITLE}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kmvmt-navy/50">
                {TENANT_COPY.ADD_COMPLEX_DESCRIPTION}
              </p>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto px-10 py-8">
              {/* Complex Name */}
              <FormField
                control={form.control}
                name="complex_name"
                render={({ field }) => (
                  <FormItem>
                    <label className={LABEL_CLASS}>Complex Name</label>
                    <FormControl>
                      <Input
                        placeholder="e.g. Skyline Residence"
                        className={FIELD_CLASS}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Units + Price grid */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unit_count"
                  render={({ field }) => (
                    <FormItem>
                      <label className={LABEL_CLASS}>Total Units</label>
                      <FormControl>
                        <div className="relative">
                          <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/30" />
                          <Input
                            type="number"
                            min={1}
                            max={10000}
                            placeholder="100"
                            className={`${FIELD_CLASS} pl-11`}
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
                      <label className={LABEL_CLASS}>Price / Unit</label>
                      <FormControl>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-kmvmt-navy/40">
                            $
                          </span>
                          <Input
                            type="number"
                            min={2}
                            max={5}
                            step={0.01}
                            placeholder="2.00"
                            className={`${FIELD_CLASS} pl-8 pr-16`}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber)
                            }}
                          />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/30">
                            /month
                          </span>
                        </div>
                      </FormControl>
                      <p className="mt-1.5 text-[11px] italic text-kmvmt-navy/40">$2.00 – $5.00</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Calculation bar */}
              {showCalc && monthly !== null && (
                <div className="flex items-center justify-between rounded-xl bg-kmvmt-navy px-5 py-3.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                    <Calculator className="h-3.5 w-3.5 opacity-60" />
                    <span>
                      {unitCount} units
                      <span className="mx-1.5 opacity-40">×</span>${pricePerUnit.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    ${monthly}
                    <span className="ml-1 text-xs font-normal text-white/50">/month</span>
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-kmvmt-bg" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                  Property Manager
                </span>
                <span className="h-px flex-1 bg-kmvmt-bg" />
              </div>

              {/* PM Full Name */}
              <FormField
                control={form.control}
                name="pm_full_name"
                render={({ field }) => (
                  <FormItem>
                    <label className={LABEL_CLASS}>Full Name</label>
                    <FormControl>
                      <Input placeholder="e.g. Johnathan Doe" className={FIELD_CLASS} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PM Email */}
              <FormField
                control={form.control}
                name="pm_email"
                render={({ field }) => (
                  <FormItem>
                    <label className={LABEL_CLASS}>Email Address</label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/30" />
                        <Input
                          type="email"
                          placeholder="manager@complex.com"
                          className={`${FIELD_CLASS} pl-11`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="mt-1.5 text-[11px] italic text-kmvmt-navy/40">
                      An invite link will be sent to this address.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError && (
                <div className="rounded-xl bg-kmvmt-red-dark/8 px-4 py-3">
                  <p className="text-xs text-kmvmt-red-dark">{submitError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-6 px-10 pb-10 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleOpenChange(false)
                }}
                className="px-6 py-3.5 text-sm font-bold text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
              >
                {TENANT_COPY.CANCEL_LABEL}
              </button>
              <button
                type="submit"
                disabled={createComplex.isPending}
                className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {createComplex.isPending ? 'Creating…' : TENANT_COPY.ADD_COMPLEX_SUBMIT}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
