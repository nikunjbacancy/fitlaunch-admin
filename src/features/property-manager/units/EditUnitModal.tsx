import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useEditUnit } from './useUnits'
import { editUnitSchema } from './unit.types'
import { UNITS_COPY } from './constants'
import type { Unit, TEditUnitPayload } from './unit.types'

interface EditUnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit
  onSuccess: (updated: Unit) => void
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

export function EditUnitModal({ open, onOpenChange, unit, onSuccess }: EditUnitModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const editUnit = useEditUnit()

  const form = useForm<TEditUnitPayload>({
    resolver: zodResolver(editUnitSchema),
    defaultValues: { code: unit.code },
  })

  const handleSubmit = (values: TEditUnitPayload) => {
    setSubmitError(null)
    editUnit.mutate(
      { unitId: unit.id, payload: values },
      {
        onSuccess: () => {
          onSuccess({ ...unit, code: values.code })
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
      form.reset({ code: unit.code })
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
                {UNITS_COPY.EDIT_TITLE}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kmvmt-navy/50">
                {UNITS_COPY.EDIT_DESCRIPTION}
              </p>
            </div>

            <div className="space-y-6 px-10 py-8">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-kmvmt-bg" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                  Current: {unit.code}
                </span>
                <span className="h-px flex-1 bg-kmvmt-bg" />
              </div>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                      {UNITS_COPY.EDIT_FIELD_CODE}
                    </label>
                    <FormControl>
                      <Input
                        placeholder={UNITS_COPY.EDIT_FIELD_CODE_PLACEHOLDER}
                        className={FIELD_CLASS}
                        {...field}
                      />
                    </FormControl>
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
                disabled={editUnit.isPending}
                className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {editUnit.isPending ? 'Saving\u2026' : UNITS_COPY.BTN_SAVE}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
