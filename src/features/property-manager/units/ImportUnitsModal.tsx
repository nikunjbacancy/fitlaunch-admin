import { useRef, useState } from 'react'
import { X, FileSpreadsheet, Download } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useBulkImportUnits } from './useUnits'
import { UNITS_COPY } from './constants'
import { cn } from '@/lib/utils'
import type { TBulkImportResult } from '../setup/setup.types'

const CSV_TEMPLATE_HEADER = 'code'
const CSV_TEMPLATE_EXAMPLE = 'C-9'
const CSV_PREVIEW_ROWS = 5

interface CsvRow {
  code: string
  valid: boolean
}

interface ImportUnitsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  remaining: number
}

export function ImportUnitsModal({ open, onOpenChange, remaining }: ImportUnitsModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<CsvRow[]>([])
  const [importResult, setImportResult] = useState<TBulkImportResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkImport = useBulkImportUnits()

  const parseCsv = (text: string): CsvRow[] => {
    const lines = text.trim().split('\n')
    const dataLines = lines[0].toLowerCase().includes('code') ? lines.slice(1) : lines
    return dataLines.map((line) => {
      const code = line.split(',')[0]?.trim() ?? ''
      return { code, valid: code.length > 0 }
    })
  }

  const handleCsvFile = (file: File) => {
    if (!file.name.endsWith('.csv')) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvPreview(parseCsv(text))
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  const handleDownloadTemplate = () => {
    const content = `${CSV_TEMPLATE_HEADER}\n${CSV_TEMPLATE_EXAMPLE}`
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'units-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (!csvFile) return
    bulkImport.mutate(csvFile, {
      onSuccess: (result) => {
        setImportResult(result)
        setCsvFile(null)
        setCsvPreview([])
      },
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCsvFile(null)
      setCsvPreview([])
      setImportResult(null)
    }
    onOpenChange(next)
  }

  const validCsvRows = csvPreview.filter((r) => r.valid).length
  const limitReached = remaining !== Infinity && remaining <= 0
  const exceedsLimit = remaining !== Infinity && validCsvRows > remaining

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
              <FileSpreadsheet className="h-4 w-4 text-kmvmt-navy" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-kmvmt-navy">{UNITS_COPY.IMPORT_TITLE}</h2>
              <p className="text-xs text-kmvmt-navy/50">{UNITS_COPY.IMPORT_DESCRIPTION}</p>
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

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4">
          {/* Template download */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1 text-xs text-kmvmt-blue-light hover:text-kmvmt-navy transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              {UNITS_COPY.IMPORT_TEMPLATE}
            </button>
          </div>

          {/* Drop zone */}
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
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files.length > 0) {
                handleCsvFile(e.dataTransfer.files[0])
              }
            }}
            onClick={() => {
              fileInputRef.current?.click()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
            className={cn(
              'flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors',
              isDragging
                ? 'border-kmvmt-navy bg-kmvmt-navy/5'
                : 'border-zinc-300 hover:border-kmvmt-navy/40 bg-kmvmt-bg'
            )}
            aria-label="Upload CSV file"
          >
            <FileSpreadsheet className="h-8 w-8 text-zinc-400" />
            <p className="text-sm text-zinc-500">
              {csvFile ? (
                <span className="font-medium text-kmvmt-navy">{csvFile.name}</span>
              ) : (
                UNITS_COPY.IMPORT_DROP
              )}
            </p>
            {!csvFile && <p className="text-xs text-zinc-400">{UNITS_COPY.IMPORT_HINT}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleCsvFile(file)
            }}
          />

          {/* CSV preview */}
          {csvPreview.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-kmvmt-bg border-zinc-200">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-kmvmt-navy">
                      Unit Code
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.slice(0, CSV_PREVIEW_ROWS).map((row, i) => (
                    <TableRow key={i} className={!row.valid ? 'bg-red-50' : ''}>
                      <TableCell className="text-sm text-kmvmt-navy">
                        {row.code || '(empty)'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {csvPreview.length > CSV_PREVIEW_ROWS && (
                <p className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400">
                  and {csvPreview.length - CSV_PREVIEW_ROWS} more\u2026
                </p>
              )}
            </div>
          )}

          {/* Limit warnings */}
          {limitReached && csvPreview.length > 0 && (
            <div className="rounded-lg border border-kmvmt-red-light bg-kmvmt-red-light/10 px-3.5 py-3">
              <p className="text-sm text-kmvmt-red-dark">
                {UNITS_COPY.LIMIT_BANNER_REACHED(remaining)}
              </p>
            </div>
          )}
          {exceedsLimit && !limitReached && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <p className="text-sm text-amber-800">
                {UNITS_COPY.LIMIT_IMPORT_WARNING(validCsvRows, remaining)}
              </p>
            </div>
          )}

          {/* Import result */}
          {importResult && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm space-y-1">
              <p className="text-zinc-700">
                Imported:{' '}
                <span className="font-semibold text-kmvmt-navy">{importResult.imported}</span>
                <span className="text-zinc-400"> / {importResult.total}</span>
              </p>
              {importResult.skipped > 0 && (
                <p className="text-zinc-400">Skipped: {importResult.skipped}</p>
              )}
              {importResult.errors.length > 0 && (
                <ul className="mt-2 space-y-1 text-red-600">
                  {importResult.errors.map((e) => (
                    <li key={e.row}>
                      Row {e.row}: {e.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 border-t border-zinc-200 bg-kmvmt-bg px-6 py-4">
          <Button
            type="button"
            className="flex-1 border border-zinc-300 bg-kmvmt-white text-sm text-kmvmt-navy hover:bg-kmvmt-bg"
            onClick={() => {
              handleOpenChange(false)
            }}
          >
            {UNITS_COPY.BTN_CANCEL}
          </Button>
          <Button
            className="flex-1 bg-kmvmt-navy text-sm text-white hover:bg-kmvmt-blue-light/80"
            disabled={validCsvRows === 0 || bulkImport.isPending || limitReached}
            onClick={handleImport}
          >
            {bulkImport.isPending
              ? UNITS_COPY.IMPORT_IMPORTING
              : UNITS_COPY.IMPORT_BUTTON.replace('{n}', String(validCsvRows))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
