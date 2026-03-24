import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled ?? isExporting}
      aria-label="Export as CSV"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export CSV
    </Button>
  )
}
