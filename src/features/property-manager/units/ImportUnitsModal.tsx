import { useRef, useState } from 'react'
import { CheckCircle2, Download, FileSpreadsheet, UploadCloud } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBulkImportUnits } from './useUnits'
import { UNITS_COPY } from './constants'
import { cn } from '@/lib/utils'
import type { TBulkImportResult } from '../setup/setup.types'

const CSV_TEMPLATE_HEADER = 'code'
const CSV_TEMPLATE_EXAMPLE = 'C-9'
const CSV_PREVIEW_ROWS = 5

// Permit letters, digits, and internal hyphens only — no spaces, slashes,
// punctuation, or edge hyphens. Mirrors what the manual Add-Unit form produces
// via buildUnitCode() (PREFIX + '-' + NUMBER).
const CODE_FORMAT_REGEX = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
const MAX_CODE_LENGTH = 50

type CsvRowError = 'empty' | 'format' | 'length' | 'duplicate'

interface CsvRow {
  code: string
  valid: boolean
  error?: CsvRowError
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
    const lines = text.replace(/\r/g, '').trim().split('\n')
    const dataLines = lines[0].toLowerCase().includes('code') ? lines.slice(1) : lines
    const seen = new Set<string>()

    return dataLines.map((line): CsvRow => {
      const code = line.split(',')[0]?.trim() ?? ''

      if (code.length === 0) return { code, valid: false, error: 'empty' }
      if (code.length > MAX_CODE_LENGTH) return { code, valid: false, error: 'length' }
      if (!CODE_FORMAT_REGEX.test(code)) return { code, valid: false, error: 'format' }

      const key = code.toUpperCase()
      if (seen.has(key)) return { code, valid: false, error: 'duplicate' }
      seen.add(key)

      return { code, valid: true }
    })
  }

  const errorLabel = (err: CsvRowError): string => {
    switch (err) {
      case 'empty':
        return 'Empty row'
      case 'length':
        return `Too long (max ${String(MAX_CODE_LENGTH)})`
      case 'format':
        return 'Invalid format — letters, digits, hyphens only'
      case 'duplicate':
        return 'Duplicate in file'
    }
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
  const invalidCsvRows = csvPreview.length - validCsvRows
  const limitReached = remaining !== Infinity && remaining <= 0
  const exceedsLimit = remaining !== Infinity && validCsvRows > remaining

  // Success state — replaces the entire body once the backend confirms the import
  if (importResult) {
    const { imported, total, skipped, errors } = importResult
    const hasIssues = skipped > 0 || errors.length > 0

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden rounded-[2rem] shadow-[0px_20px_60px_rgba(25,38,64,0.12)]">
          <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

          <div className="relative flex flex-col items-center px-10 pb-2 pt-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-kmvmt-navy">
              {imported === total
                ? 'Import complete'
                : `${String(imported)} of ${String(total)} imported`}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-kmvmt-navy/50">
              {imported === 1
                ? '1 unit was added to your directory.'
                : `${String(imported)} units were added to your directory.`}
            </p>
          </div>

          <div className="space-y-3 px-10 py-8">
            <div className="flex items-center justify-between rounded-2xl bg-kmvmt-bg px-5 py-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-kmvmt-navy/60" aria-hidden="true" />
                <span className="text-sm font-semibold text-kmvmt-navy">Imported</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-600">{imported}</span>
            </div>

            {hasIssues && (
              <div className="rounded-2xl bg-amber-50 px-5 py-4">
                {skipped > 0 && (
                  <p className="text-sm font-semibold text-amber-800">
                    Skipped: <span className="font-extrabold">{skipped}</span>{' '}
                    <span className="font-normal text-amber-700/70">
                      (already in your directory)
                    </span>
                  </p>
                )}
                {errors.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-amber-800">
                    {errors.slice(0, 5).map((err) => (
                      <li key={err.row}>
                        Row {err.row}: {err.reason}
                      </li>
                    ))}
                    {errors.length > 5 && (
                      <li className="italic text-amber-700/70">…and {errors.length - 5} more</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-6 px-10 pb-10 pt-2">
            <button
              type="button"
              onClick={() => {
                // Reset so the user can import another file without closing + reopening
                setImportResult(null)
                setCsvFile(null)
                setCsvPreview([])
              }}
              className="px-6 py-3.5 text-sm font-bold text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
            >
              Import another file
            </button>
            <button
              type="button"
              onClick={() => {
                handleOpenChange(false)
              }}
              className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden rounded-[2rem] shadow-[0px_20px_60px_rgba(25,38,64,0.12)]">
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

        <div className="px-10 pb-2 pt-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
            {UNITS_COPY.IMPORT_TITLE}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-kmvmt-navy/50">
            {UNITS_COPY.IMPORT_DESCRIPTION}
          </p>
        </div>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto px-10 py-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy/60 transition-colors hover:text-kmvmt-navy"
            >
              <Download className="h-3.5 w-3.5" />
              {UNITS_COPY.IMPORT_TEMPLATE}
            </button>
          </div>

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
              'flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all',
              isDragging
                ? 'border-kmvmt-navy bg-kmvmt-navy/5'
                : 'border-kmvmt-navy/15 bg-kmvmt-bg hover:border-kmvmt-navy/40'
            )}
            aria-label="Upload CSV file"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light">
              <UploadCloud className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-kmvmt-navy">
              {csvFile ? <span className="font-bold">{csvFile.name}</span> : UNITS_COPY.IMPORT_DROP}
            </p>
            {!csvFile && (
              <p className="text-[11px] italic text-kmvmt-navy/40">{UNITS_COPY.IMPORT_HINT}</p>
            )}
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

          {csvPreview.length > 0 && (
            <>
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-kmvmt-bg" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/30">
                  Preview
                </span>
                <span className="h-px flex-1 bg-kmvmt-bg" />
              </div>

              {invalidCsvRows > 0 && (
                <div className="rounded-xl bg-kmvmt-red-dark/8 px-4 py-3">
                  <p className="text-xs text-kmvmt-red-dark">
                    <span className="font-extrabold">{invalidCsvRows}</span> of{' '}
                    <span className="font-extrabold">{csvPreview.length}</span> rows will be
                    skipped. Valid codes use letters, digits, and hyphens only (e.g.{' '}
                    <span className="font-mono">A-1</span>,{' '}
                    <span className="font-mono">BLOCK-204</span>
                    ).
                  </p>
                </div>
              )}
              <div className="overflow-hidden rounded-2xl bg-kmvmt-bg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-0 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy/60">
                        {UNITS_COPY.COL_CODE}
                      </TableHead>
                      <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy/60">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvPreview.slice(0, CSV_PREVIEW_ROWS).map((row, i) => (
                      <TableRow
                        key={i}
                        className={cn('border-0', !row.valid && 'bg-kmvmt-red-dark/8')}
                      >
                        <TableCell className="text-sm font-medium text-kmvmt-navy">
                          {row.code || '(empty)'}
                        </TableCell>
                        <TableCell className="text-right text-[11px]">
                          {row.valid ? (
                            <span className="text-emerald-600">OK</span>
                          ) : (
                            <span className="text-kmvmt-red-dark">
                              {errorLabel(row.error ?? 'empty')}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {csvPreview.length > CSV_PREVIEW_ROWS && (
                  <p className="px-4 py-2.5 text-[11px] italic text-kmvmt-navy/40">
                    and {csvPreview.length - CSV_PREVIEW_ROWS} more…
                  </p>
                )}
              </div>
            </>
          )}

          {limitReached && csvPreview.length > 0 && (
            <div className="rounded-xl bg-kmvmt-red-dark/8 px-4 py-3">
              <p className="text-xs text-kmvmt-red-dark">
                {UNITS_COPY.LIMIT_BANNER_REACHED(remaining)}
              </p>
            </div>
          )}
          {exceedsLimit && !limitReached && (
            <div className="rounded-xl bg-amber-500/10 px-4 py-3">
              <p className="text-xs text-amber-700">
                {UNITS_COPY.LIMIT_IMPORT_WARNING(validCsvRows, remaining)}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-6 px-10 pb-10 pt-2">
          <button
            type="button"
            onClick={() => {
              handleOpenChange(false)
            }}
            className="px-6 py-3.5 text-sm font-bold text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
          >
            {UNITS_COPY.BTN_CANCEL}
          </button>
          <button
            type="button"
            disabled={validCsvRows === 0 || bulkImport.isPending || limitReached}
            onClick={handleImport}
            className="rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {bulkImport.isPending
              ? UNITS_COPY.IMPORT_IMPORTING
              : UNITS_COPY.IMPORT_BUTTON.replace('{n}', String(validCsvRows))}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
