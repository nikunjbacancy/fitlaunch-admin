import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ban } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useAddUnit } from './useUnits'
import { addUnitSchema, buildUnitCode } from './unit.types'
import { UNITS_COPY } from './constants'
import type { TAddUnitFormValues } from './unit.types'

interface AddUnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  limitReached?: boolean
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

export function AddUnitModal({ open, onOpenChange, limitReached = false }: AddUnitModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const addUnit = useAddUnit()

  const form = useForm<TAddUnitFormValues>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: { prefix: '', unit_number: '' },
  })

  const prefix = form.watch('prefix')
  const unitNumber = form.watch('unit_number')
  const previewCode = prefix && unitNumber ? buildUnitCode(prefix, unitNumber) : ''

  const handleSubmit = (values: TAddUnitFormValues) => {
    setSubmitError(null)
    const code = buildUnitCode(values.prefix, values.unit_number)
    addUnit.mutate(
      { code },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
        onError: (err) => {
          setSubmitError(getErrorMessage(err))
        },
      }
    )
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
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

        <div className="px-10 pb-2 pt-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
            {UNITS_COPY.MODAL_TITLE}
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kmvmt-navy/50">
            {UNITS_COPY.MODAL_DESCRIPTION}
          </p>
        </div>

        {limitReached ? (
          <div className="px-10 pb-10 pt-6 text-center">
            <Ban className="mx-auto mb-3 h-10 w-10 text-kmvmt-red-dark" />
            <h3 className="text-sm font-bold text-kmvmt-navy">{UNITS_COPY.LIMIT_REACHED_TITLE}</h3>
            <p className="mt-2 text-xs text-kmvmt-navy/60">{UNITS_COPY.LIMIT_REACHED_DESC}</p>
            <div className="mt-8 flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => {
                  handleOpenChange(false)
                }}
                className="px-6 py-3.5 text-sm font-bold text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
              >
                {UNITS_COPY.BTN_CANCEL}
              </button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void form.handleSubmit(handleSubmit)(e)
              }}
            >
              <div className="space-y-6 px-10 py-8">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                          {UNITS_COPY.FIELD_PREFIX}
                        </label>
                        <FormControl>
                          <Input
                            placeholder={UNITS_COPY.FIELD_PREFIX_PLACEHOLDER}
                            className={`${FIELD_CLASS} uppercase placeholder:normal-case`}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                            }}
                          />
                        </FormControl>
                        <p className="mt-1.5 text-[11px] italic text-kmvmt-navy/40">
                          {UNITS_COPY.FIELD_PREFIX_HINT}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit_number"
                    render={({ field }) => (
                      <FormItem>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                          {UNITS_COPY.FIELD_UNIT_NUMBER}
                        </label>
                        <FormControl>
                          <Input
                            placeholder={UNITS_COPY.FIELD_UNIT_NUMBER_PLACEHOLDER}
                            className={FIELD_CLASS}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                            }}
                          />
                        </FormControl>
                        <p className="mt-1.5 text-[11px] italic text-kmvmt-navy/40">
                          {UNITS_COPY.FIELD_UNIT_NUMBER_HINT}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {previewCode && (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="h-px flex-1 bg-kmvmt-bg" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                        {UNITS_COPY.FIELD_PREVIEW_LABEL}
                      </span>
                      <span className="h-px flex-1 bg-kmvmt-bg" />
                    </div>
                    <div className="flex items-center justify-center rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-4 py-4">
                      <p className="text-base font-extrabold tracking-wide text-white">
                        {previewCode}
                      </p>
                    </div>
                  </>
                )}

                {submitError && (
                  <div className="rounded-xl bg-kmvmt-red-dark/8 px-4 py-3">
                    <p className="text-xs text-kmvmt-red-dark">{submitError}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-6 px-10 pb-10 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenChange(false)
                  }}
                  className="px-6 py-3.5 text-sm font-bold text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
                >
                  {UNITS_COPY.BTN_CANCEL}
                </button>
                <button
                  type="submit"
                  disabled={addUnit.isPending}
                  className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {addUnit.isPending ? 'Adding\u2026' : UNITS_COPY.BTN_ADD}
                </button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
