import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Layers } from 'lucide-react'
import { toast } from 'sonner'
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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-md [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <Layers className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">{UNITS_COPY.GENERATE_TITLE}</h2>
              <p className="text-xs text-kmvmt-navy/50">{UNITS_COPY.GENERATE_DESCRIPTION}</p>
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

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="space-y-4 px-6 py-5">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-kmvmt-navy">
                      {UNITS_COPY.GENERATE_PREFIX}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={UNITS_COPY.GENERATE_PREFIX_PLACEHOLDER}
                        className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy uppercase placeholder:text-kmvmt-navy/40 placeholder:normal-case focus-visible:ring-kmvmt-navy"
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

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-kmvmt-navy">
                        {UNITS_COPY.GENERATE_FROM}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder={UNITS_COPY.GENERATE_FROM_PLACEHOLDER}
                          className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
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
                      <FormLabel className="text-xs font-medium text-kmvmt-navy">
                        {UNITS_COPY.GENERATE_TO}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder={UNITS_COPY.GENERATE_TO_PLACEHOLDER}
                          className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
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

              {/* Preview */}
              {rangeValid && rangeCount > 0 && (
                <div
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-4 py-3',
                    exceedsLimit
                      ? 'border-kmvmt-red-light bg-kmvmt-red-light/10'
                      : 'border-kmvmt-navy bg-kmvmt-navy'
                  )}
                >
                  <p
                    className={cn(
                      'text-xs',
                      exceedsLimit ? 'text-kmvmt-red-dark' : 'text-white/50'
                    )}
                  >
                    {UNITS_COPY.GENERATE_PREVIEW(prefix, from, to, rangeCount)}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      exceedsLimit ? 'text-kmvmt-red-dark' : 'text-white'
                    )}
                  >
                    {rangeCount} units
                  </p>
                </div>
              )}
              {exceedsLimit && rangeCount > 0 && (
                <p className="text-xs text-kmvmt-red-dark">
                  {UNITS_COPY.LIMIT_EXCEEDED(rangeCount, remaining)}
                </p>
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
                disabled={isGenerating || rangeCount === 0 || exceedsLimit}
              >
                {isGenerating
                  ? UNITS_COPY.GENERATE_GENERATING
                  : UNITS_COPY.GENERATE_BTN.replace('{n}', String(rangeCount))}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
