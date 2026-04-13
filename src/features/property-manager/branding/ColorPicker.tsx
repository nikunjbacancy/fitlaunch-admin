import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  disabled?: boolean
}

const PRESET_PALETTE = [
  '#192640', // kmvmt navy
  '#7CA3D1', // kmvmt blue-light
  '#C41E3A', // red
  '#7B2D3E', // burgundy
  '#0E7C3A', // forest green
  '#F59E0B', // amber
  '#6366F1', // indigo
  '#000000',
  '#FFFFFF',
] as const

function normalizeHex(input: string): string {
  const trimmed = input.trim()
  if (!trimmed.startsWith('#')) return `#${trimmed}`
  return trimmed
}

function isValidHex(input: string): boolean {
  return /^#([0-9A-Fa-f]{6})$/.test(input)
}

export function ColorPicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: ColorPickerProps): React.ReactElement {
  const [hexDraft, setHexDraft] = useState(value)

  // Keep the draft in sync when the source value changes externally
  // (e.g. preset click, saturation-square drag, form reset).
  useEffect(() => {
    setHexDraft(value)
  }, [value])

  const handleHexBlur = (): void => {
    const next = normalizeHex(hexDraft)
    if (isValidHex(next)) {
      onChange(next)
      setHexDraft(next)
    } else {
      // Revert invalid input
      setHexDraft(value)
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy"
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Change ${label.toLowerCase()}`}
            className="group block w-full overflow-hidden rounded-xl bg-kmvmt-bg ring-1 ring-transparent transition-all hover:ring-kmvmt-navy/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="h-20 w-full transition-colors" style={{ backgroundColor: value }} />
            <div className="flex items-center justify-between gap-2 bg-kmvmt-white px-4 py-2.5">
              <span className="font-mono text-sm font-semibold text-kmvmt-navy">{value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/40 group-hover:text-kmvmt-navy">
                Edit
              </span>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-64 border-zinc-200 bg-kmvmt-white p-4 text-kmvmt-navy"
        >
          <HexColorPicker
            color={value}
            onChange={onChange}
            style={{ width: '100%', height: 180 }}
          />

          <div className="mt-3 space-y-1.5">
            <label
              htmlFor={`${id}-hex`}
              className="text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/60"
            >
              Hex
            </label>
            <Input
              id={`${id}-hex`}
              value={hexDraft}
              maxLength={7}
              onChange={(e) => {
                setHexDraft(e.target.value)
              }}
              onBlur={handleHexBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleHexBlur()
                }
              }}
              className="h-9 border-zinc-200 bg-kmvmt-white font-mono text-sm text-kmvmt-navy focus-visible:ring-kmvmt-navy"
            />
          </div>

          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/60">
              Presets
            </p>
            <div className="grid grid-cols-9 gap-1.5">
              {PRESET_PALETTE.map((preset) => {
                const isActive = preset.toLowerCase() === value.toLowerCase()
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      onChange(preset)
                    }}
                    aria-label={`Use ${preset}`}
                    className={cn(
                      'relative h-6 w-6 rounded-md ring-1 ring-inset ring-black/10 transition-transform hover:scale-110',
                      isActive && 'ring-2 ring-kmvmt-navy'
                    )}
                    style={{ backgroundColor: preset }}
                  >
                    {isActive && (
                      <Check
                        className={cn(
                          'absolute inset-0 m-auto h-3.5 w-3.5',
                          preset.toLowerCase() === '#ffffff' ? 'text-kmvmt-navy' : 'text-white'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
