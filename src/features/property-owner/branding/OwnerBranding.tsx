import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
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

  if (loadingLocations) {
    return <DataTableSkeleton columns={2} rows={3} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={OWNER_BRANDING_COPY.PAGE_TITLE}
        description={OWNER_BRANDING_COPY.PAGE_DESCRIPTION}
      />

      {/* Location selector */}
      <div className="max-w-sm">
        <Label className="mb-2 block text-xs font-medium text-kmvmt-navy">
          {OWNER_BRANDING_COPY.SELECT_LOCATION}
        </Label>
        <Select value={selectedId} onValueChange={setSelectedId}>
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

      {!selectedId ? (
        <EmptyState
          title={OWNER_BRANDING_COPY.NO_LOCATION}
          description={OWNER_BRANDING_COPY.PAGE_DESCRIPTION}
        />
      ) : loadingDetail ? (
        <DataTableSkeleton columns={2} rows={3} />
      ) : (
        <div className="max-w-lg space-y-5 rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
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

          <div className="grid grid-cols-2 gap-4">
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
                className="h-10 w-full cursor-pointer border-zinc-200"
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
                className="h-10 w-full cursor-pointer border-zinc-200"
                {...form.register('secondary_color')}
              />
            </div>
          </div>

          <Button
            className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80"
            onClick={handleSave}
            disabled={updateBranding.isPending}
          >
            {updateBranding.isPending ? 'Saving…' : OWNER_BRANDING_COPY.BTN_SAVE}
          </Button>
        </div>
      )}
    </div>
  )
}
