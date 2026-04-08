import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Pencil } from 'lucide-react'
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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-sm [&>button]:hidden">
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <Pencil className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">{UNITS_COPY.EDIT_TITLE}</h2>
              <p className="text-xs text-kmvmt-navy/50">{UNITS_COPY.EDIT_DESCRIPTION}</p>
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

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="px-6 py-5">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-kmvmt-navy">
                      {UNITS_COPY.EDIT_FIELD_CODE}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={UNITS_COPY.EDIT_FIELD_CODE_PLACEHOLDER}
                        className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                disabled={editUnit.isPending}
              >
                {editUnit.isPending ? 'Saving\u2026' : UNITS_COPY.BTN_SAVE}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
