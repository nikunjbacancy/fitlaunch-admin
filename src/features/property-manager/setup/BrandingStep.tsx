import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Bell,
  Crop,
  Dumbbell,
  Home,
  Sparkles,
  TrendingUp,
  UploadCloud,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthStore } from '@/store/auth.store'
import { useUpdateBranding } from './useSetup'
import { brandingSchema, type TBrandingPayload } from './setup.types'
import { SETUP_COPY, MAX_LOGO_SIZE_BYTES, ACCEPTED_LOGO_TYPES } from './setup.constants'
import { getErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'
import type { z } from 'zod'

type FormValues = z.infer<typeof brandingSchema>

interface BrandingStepProps {
  onComplete: (brandName: string) => void
}

export function BrandingStep({ onComplete }: BrandingStepProps) {
  const tenantId = useAuthStore((s) => s.user?.tenantId ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const primaryColorInputRef = useRef<HTMLInputElement>(null)
  const secondaryColorInputRef = useRef<HTMLInputElement>(null)
  const updateBranding = useUpdateBranding()

  const form = useForm<FormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      app_display_name: '',
      primary_color: '#6366f1',
      secondary_color: '#a5b4fc',
    },
  })

  const watchedValues = form.watch()

  const handleLogoChange = (file: File) => {
    setLogoError(null)
    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
      setLogoError('Only PNG, JPG, and WebP images are accepted.')
      return
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError(SETUP_COPY.BRANDING_LOGO_SIZE_ERROR)
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        setLogoError(SETUP_COPY.BRANDING_LOGO_SQUARE_ERROR)
        URL.revokeObjectURL(url)
        return
      }
      setLogoFile(file)
      setLogoPreview(url)
    }
    img.src = url
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleLogoChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (values: FormValues) => {
    const payload: TBrandingPayload = {
      app_display_name: values.app_display_name,
      primary_color: values.primary_color,
      secondary_color: values.secondary_color,
      ...(logoFile ? { logo: logoFile } : {}),
    }
    updateBranding.mutate(
      { tenantId, payload },
      {
        onSuccess: () => {
          toast.success(SETUP_COPY.BRANDING_SUCCESS)
          onComplete(payload.app_display_name)
        },
        onError: (err) => {
          toast.error(getErrorMessage(err))
        },
      }
    )
  }

  return (
    <div className="flex items-start gap-10">
      {/* Form */}
      <div className="min-w-0 flex-1">
        <h2 className="mb-1 text-2xl font-bold text-kmvmt-navy">{SETUP_COPY.BRANDING_HEADING}</h2>
        <p className="mb-6 text-sm text-zinc-500">{SETUP_COPY.BRANDING_SUBTITLE}</p>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="app_display_name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel
                    htmlFor="app_display_name"
                    className="text-xs font-medium text-zinc-700"
                  >
                    {SETUP_COPY.BRANDING_APP_NAME_LABEL}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="app_display_name"
                      placeholder={SETUP_COPY.BRANDING_APP_NAME_PLACEHOLDER}
                      className="h-11 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel
                      htmlFor="primary_color"
                      className="text-xs font-medium text-zinc-700"
                    >
                      {SETUP_COPY.BRANDING_PRIMARY_COLOR_LABEL}
                    </FormLabel>
                    <FormControl>
                      <div
                        className="relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-kmvmt-white"
                        onClick={() => {
                          primaryColorInputRef.current?.click()
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            primaryColorInputRef.current?.click()
                        }}
                        aria-label={SETUP_COPY.BRANDING_PRIMARY_COLOR_LABEL}
                      >
                        <div
                          className="h-20 w-full transition-colors"
                          style={{ backgroundColor: field.value }}
                        />
                        <div className="px-3 py-2">
                          <p className="text-xs text-zinc-400">
                            {SETUP_COPY.BRANDING_PRIMARY_COLOR_LABEL}
                          </p>
                          <input
                            id="primary_color"
                            type="text"
                            className="w-full border-none bg-transparent text-sm font-mono font-semibold text-kmvmt-navy outline-none"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                            }}
                            maxLength={7}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          />
                        </div>
                        <input
                          ref={primaryColorInputRef}
                          type="color"
                          className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 opacity-0"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
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
                name="secondary_color"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel
                      htmlFor="secondary_color"
                      className="text-xs font-medium text-zinc-700"
                    >
                      {SETUP_COPY.BRANDING_SECONDARY_COLOR_LABEL}
                    </FormLabel>
                    <FormControl>
                      <div
                        className="relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-kmvmt-white"
                        onClick={() => {
                          secondaryColorInputRef.current?.click()
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            secondaryColorInputRef.current?.click()
                        }}
                        aria-label={SETUP_COPY.BRANDING_SECONDARY_COLOR_LABEL}
                      >
                        <div
                          className="h-20 w-full transition-colors"
                          style={{ backgroundColor: field.value }}
                        />
                        <div className="px-3 py-2">
                          <p className="text-xs text-zinc-400">
                            {SETUP_COPY.BRANDING_SECONDARY_COLOR_LABEL}
                          </p>
                          <input
                            id="secondary_color"
                            type="text"
                            className="w-full border-none bg-transparent text-sm font-mono font-semibold text-kmvmt-navy outline-none"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                            }}
                            maxLength={7}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          />
                        </div>
                        <input
                          ref={secondaryColorInputRef}
                          type="color"
                          className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 opacity-0"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Logo upload */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-700">{SETUP_COPY.BRANDING_LOGO_LABEL}</p>
              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => {
                  setIsDragging(false)
                }}
                onDrop={handleDrop}
                onClick={() => {
                  fileInputRef.current?.click()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
                }}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors',
                  isDragging
                    ? 'border-kmvmt-navy bg-kmvmt-navy/5'
                    : 'border-zinc-300 hover:border-kmvmt-navy/40 bg-kmvmt-bg'
                )}
                aria-label="Upload logo"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7 text-zinc-400" />
                    <p className="text-sm text-zinc-500">{SETUP_COPY.BRANDING_LOGO_DROP}</p>
                    <p className="text-xs text-zinc-400">{SETUP_COPY.BRANDING_LOGO_HINT}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-kmvmt-navy/[0.08] px-2 py-0.5 text-[11px] font-medium text-kmvmt-navy">
                      <Crop className="h-3 w-3" />
                      {SETUP_COPY.BRANDING_SQUARE_BADGE}
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_LOGO_TYPES.join(',')}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleLogoChange(file)
                }}
              />
              {logoError && <p className="text-xs text-red-600">{logoError}</p>}
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold shadow-sm transition-all"
              disabled={updateBranding.isPending}
            >
              {updateBranding.isPending ? SETUP_COPY.BRANDING_SAVING : SETUP_COPY.BRANDING_SUBMIT}
            </Button>
          </form>
        </Form>
      </div>

      {/* Phone mockup — inline on the right */}
      <div className="hidden xl:block shrink-0 pt-8">
        <PhoneMockup
          primaryColor={watchedValues.primary_color}
          secondaryColor={watchedValues.secondary_color}
          appName={watchedValues.app_display_name}
          logoPreview={logoPreview}
        />
      </div>
    </div>
  )
}

// ── Phone mockup sub-component ──────────────────────────────────────────────

interface PhoneMockupProps {
  primaryColor: string
  secondaryColor: string
  appName: string
  logoPreview: string | null
}

function PhoneMockup({ primaryColor, secondaryColor, appName, logoPreview }: PhoneMockupProps) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[36px] border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl"
      style={{ width: 200, height: 424 }}
    >
      {/* Dynamic island */}
      <div className="absolute top-[10px] left-1/2 z-20 h-[10px] w-[56px] -translate-x-1/2 rounded-full bg-zinc-900" />

      {/* Status bar */}
      <div
        className="flex flex-shrink-0 items-center justify-between px-4 pb-1 pt-3"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-[8px] font-semibold text-white">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-px">
            {[2, 3, 4, 4].map((h, i) => (
              <div key={i} className="w-[2px] rounded-sm bg-white" style={{ height: h }} />
            ))}
          </div>
          <div className="flex gap-[1px]">
            {[3, 5, 7].map((h, i) => (
              <div key={i} className="w-[2px] rounded-sm bg-white" style={{ height: h }} />
            ))}
          </div>
          <div className="flex h-[8px] w-[14px] items-center rounded-[2px] border border-white/60 p-px">
            <div className="h-full w-3/4 rounded-sm bg-white" />
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="flex-shrink-0 px-3 pb-3 pt-1" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoPreview ? (
              <img src={logoPreview} alt="logo" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <User className="h-4 w-4 text-white/60" />
              </div>
            )}
            <div>
              <p className="text-[7px] uppercase tracking-wide text-white/50">Hi Welcome</p>
              <p className="text-[10px] font-bold leading-tight text-white">
                {appName || 'Your App Name'}
              </p>
            </div>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
            <Bell className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {(
            [
              { icon: Dumbbell, label: 'Workout' },
              { icon: UtensilsCrossed, label: 'Meal' },
              { icon: Sparkles, label: 'AI Coach' },
              { icon: TrendingUp, label: 'Progress' },
            ] as const
          ).map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/10 py-2"
            >
              <Icon className="h-3.5 w-3.5 text-white" />
              <span className="text-[6.5px] text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden bg-zinc-50 pb-[50px]">
        {/* Today's Plan card */}
        <div className="mx-2 mt-2 overflow-hidden rounded-xl bg-zinc-800" style={{ height: 72 }}>
          <div className="relative h-full p-2.5">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-zinc-900/30" />
            <div className="relative">
              <span
                className="inline-block rounded-full px-1.5 py-0.5 text-[6px] font-bold text-white"
                style={{ backgroundColor: secondaryColor }}
              >
                TODAY&#39;S PLAN
              </span>
              <p className="mt-0.5 text-[9px] font-bold text-white">HIIT Fat Burner</p>
              <p className="text-[7px] text-white/50">350 kcal · 45 min</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mx-2 mt-1.5 grid grid-cols-2 gap-1.5">
          <div className="rounded-xl border border-zinc-100 bg-white p-2">
            <p className="text-[6px] text-zinc-400">Weekly Activity</p>
            <p className="mt-0.5 text-[9px] font-bold text-zinc-800">3 / 5 days</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full w-3/5 rounded-full transition-all"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-white p-2">
            <p className="text-[6px] text-zinc-400">Calories</p>
            <p className="mt-0.5 text-[9px] font-bold text-zinc-800">1,548 kcal</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full w-2/5 rounded-full transition-all"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          </div>
        </div>

        {/* Active Challenge card */}
        <div className="mx-2 mt-1.5 rounded-xl bg-zinc-800 p-2.5">
          <p className="text-[6px] uppercase tracking-wide text-white/40">Active Challenge</p>
          <p className="mt-0.5 text-[8px] font-bold text-white">Summer Shred 30-Day</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-600">
            <div
              className="h-full w-[46%] rounded-full transition-all"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-zinc-800 bg-zinc-900 px-1 py-2">
        {(
          [
            { icon: Home, label: 'Home', active: true },
            { icon: Dumbbell, label: 'Workout', active: false },
            { icon: UtensilsCrossed, label: 'Nutrition', active: false },
            { icon: Users, label: 'Community', active: false },
            { icon: User, label: 'Profile', active: false },
          ] as const
        ).map(({ icon: Icon, label, active }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md transition-colors"
              style={active ? { backgroundColor: primaryColor } : {}}
            >
              <Icon className={cn('h-3 w-3', active ? 'text-white' : 'text-zinc-500')} />
            </div>
            <span className={cn('text-[6px]', active ? 'text-white' : 'text-zinc-500')}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Side buttons */}
      <div className="absolute -right-[3px] top-24 h-10 w-[3px] rounded-r-full bg-zinc-700" />
      <div className="absolute -left-[3px] top-16 h-7 w-[3px] rounded-l-full bg-zinc-700" />
      <div className="absolute -left-[3px] top-28 h-7 w-[3px] rounded-l-full bg-zinc-700" />
      <div className="absolute -left-[3px] top-40 h-7 w-[3px] rounded-l-full bg-zinc-700" />
    </div>
  )
}
