import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { unitService } from './unitService'
import { generateRangeSchema, buildRangeCodes } from './unit.types'
import { UNITS_COPY } from './constants'
import type { TGenerateRangeFormValues } from './unit.types'

interface GenerateRangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  remaining: number
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

export function GenerateRangeModal({ open, onOpenChange, remaining }: GenerateRangeModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const tenantId = useAuthStore((s) => s.user?.tenantId)
  const queryClient = useQueryClient()

  const form = useForm<TGenerateRangeFormValues>({
    resolver: zodResolver(generateRangeSchema),
    defaultValues: { prefix: '', from: undefined, to: undefined },
  })

  const prefix = form.watch('prefix')
  const from = form.watch('from')
  const to = form.watch('to')
  const rangeValid = prefix && from > 0 && to >= from
  const rangeCount = rangeValid ? to - from + 1 : 0
  const exceedsLimit = remaining !== Infinity && rangeCount > remaining

  const handleSubmit = async (values: TGenerateRangeFormValues) => {
    if (!tenantId) {
      setSubmitError('No tenant selected')
      return
    }

    setSubmitError(null)
    setIsGenerating(true)

    const codes = buildRangeCodes(values.prefix, values.from, values.to)
    let successCount = 0

    for (const code of codes) {
      try {
        await unitService.add(tenantId, { code })
        successCount++
      } catch {
        // Skip duplicates silently, continue generating
      }
    }

    setIsGenerating(false)

    if (successCount > 0) {
      toast.success(UNITS_COPY.GENERATE_SUCCESS(successCount))
      void queryClient.invalidateQueries({ queryKey: ['units', tenantId] })
      form.reset()
      onOpenChange(false)
    } else {
      setSubmitError('No units were created. They may already exist.')
    }
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

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="px-10 pb-2 pt-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
                {UNITS_COPY.GENERATE_TITLE}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kmvmt-navy/50">
                {UNITS_COPY.GENERATE_DESCRIPTION}
              </p>
            </div>

            <div className="space-y-6 px-10 py-8">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                      {UNITS_COPY.GENERATE_PREFIX}
                    </label>
                    <FormControl>
                      <Input
                        placeholder={UNITS_COPY.GENERATE_PREFIX_PLACEHOLDER}
                        className={`${FIELD_CLASS} uppercase placeholder:normal-case`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-kmvmt-bg" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                  Range
                </span>
                <span className="h-px flex-1 bg-kmvmt-bg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                        {UNITS_COPY.GENERATE_FROM}
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder={UNITS_COPY.GENERATE_FROM_PLACEHOLDER}
                          className={FIELD_CLASS}
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
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                        {UNITS_COPY.GENERATE_TO}
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder={UNITS_COPY.GENERATE_TO_PLACEHOLDER}
                          className={FIELD_CLASS}
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

              {rangeValid && rangeCount > 0 && (
                <div
                  className={cn(
                    'flex items-center justify-between rounded-xl px-5 py-4',
                    exceedsLimit
                      ? 'bg-kmvmt-red-dark/8'
                      : 'bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light'
                  )}
                >
                  <p
                    className={cn(
                      'text-xs font-medium',
                      exceedsLimit ? 'text-kmvmt-red-dark' : 'text-white/70'
                    )}
                  >
                    {UNITS_COPY.GENERATE_PREVIEW(prefix, from, to, rangeCount)}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-extrabold',
                      exceedsLimit ? 'text-kmvmt-red-dark' : 'text-white'
                    )}
                  >
                    {rangeCount} units
                  </p>
                </div>
              )}
              {exceedsLimit && rangeCount > 0 && (
                <p className="text-xs italic text-kmvmt-red-dark">
                  {UNITS_COPY.LIMIT_EXCEEDED(rangeCount, remaining)}
                </p>
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
                disabled={isGenerating || rangeCount === 0 || exceedsLimit}
                className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {isGenerating
                  ? UNITS_COPY.GENERATE_GENERATING
                  : UNITS_COPY.GENERATE_BTN.replace('{n}', String(rangeCount))}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
