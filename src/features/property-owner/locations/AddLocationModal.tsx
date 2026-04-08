import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Building2, Users, MapPin, DollarSign, Mail } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/errors'
import { useManagers } from '../managers/useManagers'
import { LOCATIONS_COPY } from './constants'
import { createLocationSchema } from './location.types'
import { useCreateLocation } from './useLocations'
import type { TCreateLocationPayload, PmAssignmentType } from './location.types'

interface AddLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddLocationModal({ open, onOpenChange }: AddLocationModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { data: managers } = useManagers()

  const form = useForm<TCreateLocationPayload>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      complex_name: '',
      unit_count: undefined,
      price_per_unit: undefined,
      address: '',
      pm_assignment: 'skip',
      existing_manager_id: '',
      new_manager_name: '',
      new_manager_email: '',
    },
  })

  const createLocation = useCreateLocation(() => {
    form.reset()
    onOpenChange(false)
  })

  const pmAssignment = form.watch('pm_assignment') as PmAssignmentType

  const handleSubmit = (values: TCreateLocationPayload) => {
    setSubmitError(null)

    // Strip irrelevant PM fields based on assignment type
    const payload: Record<string, unknown> = {
      complex_name: values.complex_name,
      unit_count: values.unit_count,
      price_per_unit: values.price_per_unit,
      address: values.address,
      pm_assignment: values.pm_assignment,
    }

    if (values.pm_assignment === 'existing') {
      payload.existing_manager_id = values.existing_manager_id
    } else if (values.pm_assignment === 'new') {
      payload.new_manager_name = values.new_manager_name
      payload.new_manager_email = values.new_manager_email
    }

    createLocation.mutate(payload as TCreateLocationPayload, {
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

  const handlePmChange = (value: PmAssignmentType) => {
    form.setValue('pm_assignment', value)
    if (value !== 'existing') form.setValue('existing_manager_id', '')
    if (value !== 'new') {
      form.setValue('new_manager_name', '')
      form.setValue('new_manager_email', '')
    }
  }

  // Deduplicate managers by email (same PM can appear on multiple locations)
  const uniqueManagers = (managers ?? []).filter(
    (m, i, arr) => arr.findIndex((x) => x.email === m.email) === i
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <Building2 className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">
                {LOCATIONS_COPY.MODAL_TITLE}
              </h2>
              <p className="text-xs text-kmvmt-navy/50">{LOCATIONS_COPY.MODAL_DESCRIPTION}</p>
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
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Location details section */}
              <div className="space-y-4 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                  Location Details
                </p>

                <FormField
                  control={form.control}
                  name="complex_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="complex_name"
                        className="text-xs font-medium text-kmvmt-navy"
                      >
                        {LOCATIONS_COPY.FIELD_COMPLEX_NAME}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                          <Input
                            id="complex_name"
                            placeholder={LOCATIONS_COPY.FIELD_COMPLEX_NAME_PLACEHOLDER}
                            className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="unit_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="unit_count"
                          className="text-xs font-medium text-kmvmt-navy"
                        >
                          {LOCATIONS_COPY.FIELD_UNIT_COUNT}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                            <Input
                              id="unit_count"
                              type="number"
                              min={1}
                              max={10000}
                              placeholder={LOCATIONS_COPY.FIELD_UNIT_COUNT_PLACEHOLDER}
                              className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
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
                        <FormLabel
                          htmlFor="price_per_unit"
                          className="text-xs font-medium text-kmvmt-navy"
                        >
                          {LOCATIONS_COPY.FIELD_PRICE}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                            <Input
                              id="price_per_unit"
                              type="number"
                              min={2}
                              max={5}
                              step={0.01}
                              placeholder={LOCATIONS_COPY.FIELD_PRICE_PLACEHOLDER}
                              className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber)
                              }}
                            />
                          </div>
                        </FormControl>
                        <p className="mt-1 text-[11px] text-kmvmt-navy/40">
                          {LOCATIONS_COPY.FIELD_PRICE_HINT}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(() => {
                  const units = form.watch('unit_count')
                  const price = form.watch('price_per_unit')
                  const showCalc = units > 0 && price >= 2 && price <= 5
                  if (!showCalc) return null
                  const monthly = (units * price).toFixed(2)
                  return (
                    <div className="flex items-center justify-between rounded-lg border border-kmvmt-navy bg-kmvmt-navy px-4 py-3">
                      <p className="text-xs text-white/50">
                        {units} units × ${price.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        ${monthly} <span className="font-normal text-white/50">/month</span>
                      </p>
                    </div>
                  )
                })()}

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="address" className="text-xs font-medium text-kmvmt-navy">
                        {LOCATIONS_COPY.FIELD_ADDRESS}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                          <Input
                            id="address"
                            placeholder={LOCATIONS_COPY.FIELD_ADDRESS_PLACEHOLDER}
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

              {/* PM assignment section */}
              <div className="border-t border-zinc-100">
                <div className="space-y-4 px-6 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-kmvmt-navy/40">
                    {LOCATIONS_COPY.FIELD_PM_SECTION}
                  </p>

                  <div className="space-y-3">
                    {/* Option: Select existing */}
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="pm_assignment"
                        value="existing"
                        checked={pmAssignment === 'existing'}
                        onChange={() => {
                          handlePmChange('existing')
                        }}
                        className="mt-0.5 h-4 w-4 accent-kmvmt-navy"
                      />
                      <span className="text-sm text-kmvmt-navy">
                        {LOCATIONS_COPY.FIELD_PM_EXISTING}
                      </span>
                    </label>

                    {pmAssignment === 'existing' && (
                      <div className="ml-7 border-l-2 border-kmvmt-navy pl-4">
                        <FormField
                          control={form.control}
                          name="existing_manager_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy focus:ring-kmvmt-navy">
                                    <SelectValue
                                      placeholder={LOCATIONS_COPY.FIELD_PM_SELECT_PLACEHOLDER}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {uniqueManagers.map((mgr) => (
                                    <SelectItem key={mgr.id} value={mgr.id}>
                                      <span className="font-medium">{mgr.fullName}</span>
                                      <span className="ml-1 text-kmvmt-navy/50">
                                        ({mgr.email}) — {mgr.locationName}
                                      </span>
                                    </SelectItem>
                                  ))}
                                  {uniqueManagers.length === 0 && (
                                    <SelectItem value="__none__" disabled>
                                      No existing managers found
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Option: Invite new */}
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="pm_assignment"
                        value="new"
                        checked={pmAssignment === 'new'}
                        onChange={() => {
                          handlePmChange('new')
                        }}
                        className="mt-0.5 h-4 w-4 accent-kmvmt-navy"
                      />
                      <span className="text-sm text-kmvmt-navy">{LOCATIONS_COPY.FIELD_PM_NEW}</span>
                    </label>

                    {pmAssignment === 'new' && (
                      <div className="ml-7 space-y-3 border-l-2 border-kmvmt-navy pl-4">
                        <FormField
                          control={form.control}
                          name="new_manager_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-kmvmt-navy">
                                {LOCATIONS_COPY.FIELD_PM_NAME}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={LOCATIONS_COPY.FIELD_PM_NAME_PLACEHOLDER}
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
                          name="new_manager_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-kmvmt-navy">
                                {LOCATIONS_COPY.FIELD_PM_EMAIL}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-kmvmt-navy/40" />
                                  <Input
                                    type="email"
                                    placeholder={LOCATIONS_COPY.FIELD_PM_EMAIL_PLACEHOLDER}
                                    className="border-zinc-200 bg-kmvmt-white pl-8 text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <p className="mt-1 text-[11px] text-kmvmt-navy/40">
                                {LOCATIONS_COPY.FIELD_PM_EMAIL_HINT}
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Option: Skip */}
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="pm_assignment"
                        value="skip"
                        checked={pmAssignment === 'skip'}
                        onChange={() => {
                          handlePmChange('skip')
                        }}
                        className="mt-0.5 h-4 w-4 accent-kmvmt-navy"
                      />
                      <span className="text-sm text-kmvmt-navy">
                        {LOCATIONS_COPY.FIELD_PM_SKIP}
                      </span>
                    </label>
                  </div>
                </div>
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
                {LOCATIONS_COPY.BTN_CANCEL}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
                disabled={createLocation.isPending}
              >
                {createLocation.isPending ? 'Creating…' : LOCATIONS_COPY.BTN_SUBMIT}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
