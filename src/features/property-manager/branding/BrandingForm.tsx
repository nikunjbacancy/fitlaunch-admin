import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ColorPicker } from './ColorPicker'
import { LogoUpload } from './LogoUpload'
import { BrandingPreview } from './BrandingPreview'
import { useBrandingQuery, useUpdateBranding } from './useBranding'
import { brandingSchema, type TBrandingFormValues } from './branding.types'
import { BRANDING_COPY, DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR } from './constants'

// Backend returns #000000 / #FFFFFF for unbranded tenants. Treat that
// combination as "not yet configured" and swap in friendlier defaults.
const UNBRANDED_PRIMARY = '#000000'
const UNBRANDED_SECONDARY = '#FFFFFF'

function isUnconfigured(data: {
  app_display_name: string
  primary_color: string
  secondary_color: string
  logo_url: string | null
}): boolean {
  return (
    !data.app_display_name &&
    data.primary_color.toUpperCase() === UNBRANDED_PRIMARY &&
    data.secondary_color.toUpperCase() === UNBRANDED_SECONDARY &&
    data.logo_url === null
  )
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

const LABEL_CLASS = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy'

const SECTION_LABEL_CLASS = 'text-[10px] font-bold uppercase tracking-[0.14em] text-kmvmt-navy/40'

export function BrandingForm(): React.ReactElement {
  const brandingQuery = useBrandingQuery()
  const updateBranding = useUpdateBranding()

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [localLogoPreview, setLocalLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isPreviewOpenMobile, setIsPreviewOpenMobile] = useState(false)

  // A freshly-uploaded file takes precedence over the saved CloudFront URL.
  const serverLogoUrl = brandingQuery.data?.logo_url ?? null
  const logoPreview = localLogoPreview ?? serverLogoUrl

  useEffect(() => {
    if (!logoFile) {
      setLocalLogoPreview(null)
      return
    }
    const url = URL.createObjectURL(logoFile)
    setLocalLogoPreview(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [logoFile])

  const form = useForm<TBrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      app_display_name: '',
      primary_color: DEFAULT_PRIMARY_COLOR,
      secondary_color: DEFAULT_SECONDARY_COLOR,
    },
  })

  // Prefill from the server response once it arrives. Swap DB defaults
  // (#000000 / #FFFFFF for unbranded tenants) for friendlier placeholders
  // so first-time PMs aren't starting from pure black + white.
  useEffect(() => {
    const data = brandingQuery.data
    if (!data) return
    const unconfigured = isUnconfigured(data)
    form.reset({
      app_display_name: data.app_display_name,
      primary_color: unconfigured ? DEFAULT_PRIMARY_COLOR : data.primary_color,
      secondary_color: unconfigured ? DEFAULT_SECONDARY_COLOR : data.secondary_color,
    })
    // Clear any transient local logo state when authoritative data refreshes
    setLogoFile(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandingQuery.data])

  const watched = form.watch()
  const isFormDirty = form.formState.isDirty || logoFile !== null
  const isPending = updateBranding.isPending

  const handleSubmit = (values: TBrandingFormValues): void => {
    updateBranding.mutate(
      {
        app_display_name: values.app_display_name,
        primary_color: values.primary_color,
        secondary_color: values.secondary_color,
        ...(logoFile ? { logo: logoFile } : {}),
      },
      {
        onSuccess: () => {
          form.reset(values)
          setLogoFile(null)
        },
      }
    )
  }

  if (brandingQuery.isLoading) {
    return <BrandingFormSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Page header — title, status, and Save button on one line */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-kmvmt-navy">
            {BRANDING_COPY.PAGE_TITLE}
          </h1>
          <p className="mt-0.5 text-xs text-kmvmt-navy/40">{BRANDING_COPY.PAGE_DESCRIPTION}</p>
        </div>
        <div className="flex items-center gap-3">
          {isFormDirty && !isPending && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
          {updateBranding.isSuccess && !isFormDirty && (
            <span className="text-[11px] font-semibold text-emerald-600">All changes saved</span>
          )}
          <Button
            type="button"
            variant="ghost"
            className="xl:hidden"
            onClick={() => {
              setIsPreviewOpenMobile((v) => !v)
            }}
          >
            {isPreviewOpenMobile ? (
              <>
                <EyeOff className="mr-1.5 h-4 w-4" /> Hide preview
              </>
            ) : (
              <>
                <Eye className="mr-1.5 h-4 w-4" /> Show preview
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => {
              void form.handleSubmit(handleSubmit)()
            }}
            disabled={isPending || !isFormDirty}
            className={cn(
              'font-semibold transition-all',
              isFormDirty
                ? 'bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80'
                : 'bg-kmvmt-bg text-kmvmt-navy/40'
            )}
          >
            {isPending ? BRANDING_COPY.SAVING : BRANDING_COPY.SUBMIT}
          </Button>
        </div>
      </header>

      {/* Split-screen: narrower form (left), wider preview (right) */}
      <div className="grid items-stretch gap-8 xl:grid-cols-[minmax(0,1fr)_480px]">
        {/* FORM column */}
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(handleSubmit)(e)
            }}
            className="flex h-full flex-col gap-10 rounded-3xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)] sm:p-10"
            noValidate
          >
            <section className="space-y-6">
              <FormField
                control={form.control}
                name="app_display_name"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="app_display_name" className={LABEL_CLASS}>
                      {BRANDING_COPY.APP_NAME_LABEL}
                    </label>
                    <FormControl>
                      <Input
                        id="app_display_name"
                        placeholder={BRANDING_COPY.APP_NAME_PLACEHOLDER}
                        className={FIELD_CLASS}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="space-y-4">
              <h2 className={SECTION_LABEL_CLASS}>{BRANDING_COPY.SECTION_VISUAL}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ColorPicker
                          id="primary_color"
                          label={BRANDING_COPY.PRIMARY_COLOR_LABEL}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ColorPicker
                          id="secondary_color"
                          label={BRANDING_COPY.SECONDARY_COLOR_LABEL}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="flex flex-1 flex-col gap-4">
              <h2 className={SECTION_LABEL_CLASS}>{BRANDING_COPY.SECTION_LOGO}</h2>
              <div className="flex-1">
                <LogoUpload
                  previewUrl={logoPreview}
                  onSelect={setLogoFile}
                  onError={setLogoError}
                  errorMessage={logoError}
                  disabled={isPending}
                />
              </div>
            </section>
          </form>
        </Form>

        {/* PREVIEW column — matches form card height, centered content */}
        <aside className="hidden xl:block">
          <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-kmvmt-white p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
            <BrandingPreview
              primaryColor={watched.primary_color}
              secondaryColor={watched.secondary_color}
              appName={watched.app_display_name}
              logoPreview={logoPreview}
            />
          </div>
        </aside>

        {isPreviewOpenMobile && (
          <aside className="xl:hidden">
            <div className="flex flex-col items-center rounded-3xl bg-kmvmt-white p-6 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
              <BrandingPreview
                primaryColor={watched.primary_color}
                secondaryColor={watched.secondary_color}
                appName={watched.app_display_name}
                logoPreview={logoPreview}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function BrandingFormSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="space-y-8 rounded-3xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)] sm:p-10">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="hidden xl:block">
          <Skeleton className="h-[780px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
