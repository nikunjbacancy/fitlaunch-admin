import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, UserPlus, Mail } from 'lucide-react'
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
import { REPRESENTATIVES_COPY } from './constants'
import { inviteRepresentativeSchema } from './representative.types'
import { useInviteRepresentative } from './useRepresentatives'
import type { TInviteRepresentativePayload } from './representative.types'

interface InviteRepresentativeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteRepresentativeModal({ open, onOpenChange }: InviteRepresentativeModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<TInviteRepresentativePayload>({
    resolver: zodResolver(inviteRepresentativeSchema),
    defaultValues: { full_name: '', email: '' },
  })

  const inviteRep = useInviteRepresentative(() => {
    form.reset()
    onOpenChange(false)
  })

  const handleSubmit = (values: TInviteRepresentativePayload) => {
    setSubmitError(null)
    inviteRep.mutate(values, {
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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <UserPlus className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">
                {REPRESENTATIVES_COPY.MODAL_TITLE}
              </h2>
              <p className="text-xs text-kmvmt-navy/50">{REPRESENTATIVES_COPY.MODAL_DESCRIPTION}</p>
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
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="full_name" className="text-xs font-medium text-kmvmt-navy">
                      {REPRESENTATIVES_COPY.FIELD_NAME}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="full_name"
                        placeholder={REPRESENTATIVES_COPY.FIELD_NAME_PLACEHOLDER}
                        className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="rep_email" className="text-xs font-medium text-kmvmt-navy">
                      {REPRESENTATIVES_COPY.FIELD_EMAIL}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                        <Input
                          id="rep_email"
                          type="email"
                          placeholder={REPRESENTATIVES_COPY.FIELD_EMAIL_PLACEHOLDER}
                          className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                          {...field}
                        />
                      </div>
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
                {REPRESENTATIVES_COPY.BTN_CANCEL}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
                disabled={inviteRep.isPending}
              >
                {inviteRep.isPending ? 'Sending…' : REPRESENTATIVES_COPY.BTN_SEND_INVITE}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
