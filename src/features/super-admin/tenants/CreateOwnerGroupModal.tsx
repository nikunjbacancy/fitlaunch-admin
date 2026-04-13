import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { TENANT_COPY } from './constants'
import { createOwnerGroupSchema } from './tenant.types'
import { useCreateOwnerGroup } from './useTenantActions'
import type { TCreateOwnerGroupPayload } from './tenant.types'

interface CreateOwnerGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

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
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden rounded-[2rem] shadow-[0px_20px_60px_rgba(25,38,64,0.12)]">
        {/* Gradient glow — top-right */}
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="px-10 pb-2 pt-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
                {TENANT_COPY.ADD_OWNER_GROUP_TITLE}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kmvmt-navy/50">
                {TENANT_COPY.ADD_OWNER_GROUP_DESCRIPTION}
              </p>
            </div>

            <div className="space-y-6 px-10 py-8">
              {/* Group Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                      {TENANT_COPY.OWNER_GROUP_NAME}
                    </label>
                    <FormControl>
                      <Input
                        placeholder={TENANT_COPY.OWNER_GROUP_NAME_PLACEHOLDER}
                        className={FIELD_CLASS}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Divider */}
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-kmvmt-bg" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                  Representative Details
                </span>
                <span className="h-px flex-1 bg-kmvmt-bg" />
              </div>

              {/* Owner Full Name */}
              <FormField
                control={form.control}
                name="owner_full_name"
                render={({ field }) => (
                  <FormItem>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                      {TENANT_COPY.OWNER_NAME}
                    </label>
                    <FormControl>
                      <Input
                        placeholder={TENANT_COPY.OWNER_NAME_PLACEHOLDER}
                        className={FIELD_CLASS}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner Email */}
              <FormField
                control={form.control}
                name="owner_email"
                render={({ field }) => (
                  <FormItem>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
                      {TENANT_COPY.OWNER_EMAIL}
                    </label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kmvmt-navy/30" />
                        <Input
                          type="email"
                          placeholder={TENANT_COPY.OWNER_EMAIL_PLACEHOLDER}
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
                disabled={createGroup.isPending}
                className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {createGroup.isPending ? 'Creating…' : TENANT_COPY.OWNER_GROUP_SUBMIT}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
