import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'

interface ExportCsvButtonProps {
  onExport: () => Promise<Blob>
  filename: string
  disabled?: boolean
}

export function ExportCsvButton({ onExport, filename, disabled }: ExportCsvButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = (): void => {
    void (async () => {
      try {
        setIsExporting(true)
        const blob = await onExport()
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        anchor.click()
        URL.revokeObjectURL(url)
        toast.success('Export downloaded successfully')
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setIsExporting(false)
      }
    })()
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled ?? isExporting}
      aria-label="Export as CSV"
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-kmvmt-white px-4 py-2.5 text-xs font-bold text-kmvmt-navy transition-colors hover:bg-kmvmt-bg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isExporting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Export CSV
    </button>
  )
}
