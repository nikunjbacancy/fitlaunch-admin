import { useRef, useState } from 'react'
import { Crop, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCEPTED_LOGO_TYPES, BRANDING_COPY, MAX_LOGO_SIZE_BYTES } from './constants'

interface LogoUploadProps {
  previewUrl: string | null
  onSelect: (file: File) => void
  onError: (message: string | null) => void
  errorMessage: string | null
  disabled?: boolean
}

export function LogoUpload({
  previewUrl,
  onSelect,
  onError,
  errorMessage,
  disabled = false,
}: LogoUploadProps): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Validate type + size + square aspect ratio. Errors surface via onError;
  // only a file that passes all three checks reaches onSelect.
  const validateAndSelect = (file: File): void => {
    onError(null)

    if (!(ACCEPTED_LOGO_TYPES as readonly string[]).includes(file.type)) {
      onError(BRANDING_COPY.LOGO_TYPE_ERROR)
      return
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      onError(BRANDING_COPY.LOGO_SIZE_ERROR)
      return
    }

    const tempUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        onError(BRANDING_COPY.LOGO_SQUARE_ERROR)
        URL.revokeObjectURL(tempUrl)
        return
      }
      URL.revokeObjectURL(tempUrl)
      onSelect(file)
    }
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl)
      onError(BRANDING_COPY.LOGO_TYPE_ERROR)
    }
    img.src = tempUrl
  }

  const openFileDialog = (): void => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files.length === 0) return
    validateAndSelect(e.dataTransfer.files[0])
  }

  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy">
        {BRANDING_COPY.LOGO_LABEL}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={BRANDING_COPY.LOGO_DROP}
        aria-disabled={disabled}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openFileDialog()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => {
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-kmvmt-bg py-8 ring-1 transition-all',
          isDragging ? 'ring-2 ring-kmvmt-navy' : 'ring-transparent hover:ring-kmvmt-navy/20',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Logo preview" className="h-16 w-auto object-contain" />
            <span className="mt-1 text-[11px] font-semibold text-kmvmt-navy/60">
              {BRANDING_COPY.LOGO_REPLACE}
            </span>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kmvmt-white text-kmvmt-navy/50">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-kmvmt-navy">{BRANDING_COPY.LOGO_DROP}</p>
            <p className="text-xs text-kmvmt-navy/40">{BRANDING_COPY.LOGO_HINT}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-kmvmt-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy">
              <Crop className="h-3 w-3" aria-hidden="true" />
              {BRANDING_COPY.LOGO_SQUARE_BADGE}
            </span>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_LOGO_TYPES.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) validateAndSelect(file)
          // Reset so selecting the same file twice re-fires onChange
          e.target.value = ''
        }}
      />
      {errorMessage && (
        <p className="mt-2 text-xs font-medium text-kmvmt-red-dark">{errorMessage}</p>
      )}
    </div>
  )
}
