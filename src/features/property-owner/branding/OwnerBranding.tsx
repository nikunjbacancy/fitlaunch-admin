import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Palette, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocations, useLocationDetail } from '../locations/useLocations'
import { useUpdateLocationBranding } from './useBranding'
import { OWNER_BRANDING_COPY } from './constants'
import type { LocationBrandingPayload } from './brandingService'

export function OwnerBranding() {
  const [selectedId, setSelectedId] = useState<string>('')
  const { data: locations, isLoading: loadingLocations } = useLocations()
  const { data: location, isLoading: loadingDetail } = useLocationDetail(selectedId)
  const updateBranding = useUpdateLocationBranding(selectedId)

  const form = useForm<LocationBrandingPayload>()

  const handleSave = () => {
    const values = form.getValues()
    updateBranding.mutate(values)
  }

  return (
    <div className="space-y-8">
      {/* Location selector card */}
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="flex flex-wrap items-end justify-between gap-6 px-8 py-7">
          <div>
            <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
              {OWNER_BRANDING_COPY.PAGE_TITLE}
            </h4>
            <p className="mt-1 text-sm text-kmvmt-navy/50">
              {OWNER_BRANDING_COPY.PAGE_DESCRIPTION}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-kmvmt-navy/50">
              {OWNER_BRANDING_COPY.SELECT_LOCATION}
            </Label>
            <Select value={selectedId} onValueChange={setSelectedId} disabled={loadingLocations}>
              <SelectTrigger className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy focus:ring-kmvmt-navy">
                <SelectValue placeholder={OWNER_BRANDING_COPY.SELECT_LOCATION_PLACEHOLDER} />
              </SelectTrigger>
              <SelectContent>
                {(locations ?? []).map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.appDisplayName ?? loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Branding form card */}
      {!selectedId ? (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kmvmt-navy/10 text-kmvmt-navy">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-kmvmt-navy">
              {OWNER_BRANDING_COPY.NO_LOCATION}
            </p>
            <p className="mt-1 max-w-sm text-xs text-kmvmt-navy/40">
              {OWNER_BRANDING_COPY.PAGE_DESCRIPTION}
            </p>
          </div>
        </div>
      ) : loadingDetail ? (
        <div className="h-64 animate-pulse rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]" />
      ) : (
        <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
          <div className="flex items-center gap-3 px-8 py-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-kmvmt-navy/10 text-kmvmt-navy">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
                Brand Settings
              </h4>
              <p className="text-sm text-kmvmt-navy/50">
                {location?.appDisplayName ?? location?.name}
              </p>
            </div>
          </div>

          <div className="space-y-6 border-t border-kmvmt-bg px-8 py-8">
            <div>
              <Label
                htmlFor="app_display_name"
                className="mb-1.5 block text-xs font-medium text-kmvmt-navy"
              >
                {OWNER_BRANDING_COPY.FIELD_APP_NAME}
              </Label>
              <Input
                id="app_display_name"
                defaultValue={location?.appDisplayName ?? ''}
                placeholder={OWNER_BRANDING_COPY.FIELD_APP_NAME_PLACEHOLDER}
                className="border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                {...form.register('app_display_name')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="primary_color"
                  className="mb-1.5 block text-xs font-medium text-kmvmt-navy"
                >
                  {OWNER_BRANDING_COPY.FIELD_PRIMARY_COLOR}
                </Label>
                <Input
                  id="primary_color"
                  type="color"
                  defaultValue={location?.primaryColor ?? '#192640'}
                  className="h-11 w-full cursor-pointer border-zinc-200 bg-kmvmt-white"
                  {...form.register('primary_color')}
                />
              </div>
              <div>
                <Label
                  htmlFor="secondary_color"
                  className="mb-1.5 block text-xs font-medium text-kmvmt-navy"
                >
                  {OWNER_BRANDING_COPY.FIELD_SECONDARY_COLOR}
                </Label>
                <Input
                  id="secondary_color"
                  type="color"
                  defaultValue={location?.secondaryColor ?? '#4A90D9'}
                  className="h-11 w-full cursor-pointer border-zinc-200 bg-kmvmt-white"
                  {...form.register('secondary_color')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-kmvmt-bg bg-kmvmt-bg/30 px-8 py-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateBranding.isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateBranding.isPending ? 'Saving…' : OWNER_BRANDING_COPY.BTN_SAVE}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
