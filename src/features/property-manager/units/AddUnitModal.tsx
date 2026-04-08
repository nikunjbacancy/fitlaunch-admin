import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Home, Ban } from 'lucide-react'
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
import { useAddUnit } from './useUnits'
import { addUnitSchema, buildUnitCode } from './unit.types'
import { UNITS_COPY } from './constants'
import type { TAddUnitFormValues } from './unit.types'

interface AddUnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  limitReached?: boolean
}

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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-md [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <Home className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">{UNITS_COPY.MODAL_TITLE}</h2>
              <p className="text-xs text-kmvmt-navy/50">{UNITS_COPY.MODAL_DESCRIPTION}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              handleOpenChange(false)
            }}
            className="mt-0.5 rounded-md p-1 text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {limitReached ? (
          <div className="px-6 py-8 text-center">
            <Ban className="mx-auto mb-3 h-10 w-10 text-kmvmt-red-dark" />
            <h3 className="text-sm font-semibold text-kmvmt-navy">
              {UNITS_COPY.LIMIT_REACHED_TITLE}
            </h3>
            <p className="mt-1 text-xs text-kmvmt-navy/60">{UNITS_COPY.LIMIT_REACHED_DESC}</p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void form.handleSubmit(handleSubmit)(e)
              }}
            >
              <div className="space-y-4 px-6 py-5">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-kmvmt-navy">
                          {UNITS_COPY.FIELD_PREFIX}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={UNITS_COPY.FIELD_PREFIX_PLACEHOLDER}
                            className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy uppercase placeholder:text-kmvmt-navy/40 placeholder:normal-case focus-visible:ring-kmvmt-navy"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                            }}
                          />
                        </FormControl>
                        <p className="text-[11px] text-kmvmt-navy/40">
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
                        <FormLabel className="text-xs font-medium text-kmvmt-navy">
                          {UNITS_COPY.FIELD_UNIT_NUMBER}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={UNITS_COPY.FIELD_UNIT_NUMBER_PLACEHOLDER}
                            className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                            }}
                          />
                        </FormControl>
                        <p className="text-[11px] text-kmvmt-navy/40">
                          {UNITS_COPY.FIELD_UNIT_NUMBER_HINT}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Code preview */}
                {previewCode && (
                  <div className="flex items-center justify-between rounded-lg border border-kmvmt-navy bg-kmvmt-navy px-4 py-3">
                    <p className="text-xs text-white/50">{UNITS_COPY.FIELD_PREVIEW_LABEL}</p>
                    <p className="text-sm font-semibold tracking-wide text-white">{previewCode}</p>
                  </div>
                )}
              </div>

              {submitError && (
                <div className="mx-6 mb-4 rounded-md border border-kmvmt-red-light bg-kmvmt-red-light/10 px-3 py-2.5">
                  <p className="text-xs text-kmvmt-red-dark">{submitError}</p>
                </div>
              )}

              <div className="flex gap-2.5 border-t border-zinc-200 bg-kmvmt-bg px-6 py-4">
                <Button
                  type="button"
                  className="flex-1 border border-zinc-300 bg-kmvmt-white text-sm text-kmvmt-navy hover:bg-kmvmt-bg"
                  onClick={() => {
                    handleOpenChange(false)
                  }}
                >
                  {UNITS_COPY.BTN_CANCEL}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
                  disabled={addUnit.isPending}
                >
                  {addUnit.isPending ? 'Adding\u2026' : UNITS_COPY.BTN_ADD}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
