import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, UsersRound, Mail } from 'lucide-react'
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
import { createOwnerGroupSchema } from './tenant.types'
import { useCreateOwnerGroup } from './useTenantActions'
import type { TCreateOwnerGroupPayload } from './tenant.types'

interface CreateOwnerGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateOwnerGroupModal({ open, onOpenChange }: CreateOwnerGroupModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<TCreateOwnerGroupPayload>({
    resolver: zodResolver(createOwnerGroupSchema),
    defaultValues: { name: '', owner_full_name: '', owner_email: '' },
  })

  const createGroup = useCreateOwnerGroup(() => {
    form.reset()
    onOpenChange(false)
  })

  const handleSubmit = (values: TCreateOwnerGroupPayload) => {
    setSubmitError(null)
    createGroup.mutate(values, {
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
              <UsersRound className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">
                {TENANT_COPY.ADD_OWNER_GROUP_TITLE}
              </h2>
              <p className="text-xs text-kmvmt-navy/50">
                {TENANT_COPY.ADD_OWNER_GROUP_DESCRIPTION}
              </p>
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
            <div className="space-y-0 divide-y divide-zinc-100">
              {/* Group section */}
              <div className="space-y-4 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                  Ownership Group
                </p>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="group_name"
                        className="text-xs font-medium text-kmvmt-navy"
                      >
                        {TENANT_COPY.OWNER_GROUP_NAME}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UsersRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                          <Input
                            id="group_name"
                            placeholder={TENANT_COPY.OWNER_GROUP_NAME_PLACEHOLDER}
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

              {/* Owner section */}
              <div className="space-y-4 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                  Primary Owner Representative
                </p>

                <FormField
                  control={form.control}
                  name="owner_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="owner_full_name"
                        className="text-xs font-medium text-kmvmt-navy"
                      >
                        {TENANT_COPY.OWNER_NAME}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="owner_full_name"
                          placeholder={TENANT_COPY.OWNER_NAME_PLACEHOLDER}
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
                  name="owner_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="owner_email"
                        className="text-xs font-medium text-kmvmt-navy"
                      >
                        {TENANT_COPY.OWNER_EMAIL}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                          <Input
                            id="owner_email"
                            type="email"
                            placeholder={TENANT_COPY.OWNER_EMAIL_PLACEHOLDER}
                            className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="mt-1 text-[11px] text-kmvmt-navy/40">
                        An invite link will be sent to this address.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {submitError && (
              <div className="mx-6 mb-4 rounded-md border border-kmvmt-red-light bg-kmvmt-red-light/10 px-3 py-2.5">
                <p className="text-xs text-kmvmt-red-dark">{submitError}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2.5 border-t border-zinc-200 bg-kmvmt-bg px-6 py-4">
              <Button
                type="button"
                className="flex-1 border border-zinc-300 bg-kmvmt-white text-sm text-kmvmt-navy hover:bg-kmvmt-bg"
                onClick={() => {
                  handleOpenChange(false)
                }}
              >
                {TENANT_COPY.CANCEL_LABEL}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
                disabled={createGroup.isPending}
              >
                {createGroup.isPending ? 'Creating…' : TENANT_COPY.OWNER_GROUP_SUBMIT}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
