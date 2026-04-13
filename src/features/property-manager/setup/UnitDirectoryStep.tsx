import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Download, FileSpreadsheet, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthStore } from '@/store/auth.store'
import { useAddUnit, useBulkImportUnits } from './useSetup'
import { addUnitSchema, buildUnitCode, type TUnit, type TAddUnitPayload } from './setup.types'
import {
  SETUP_COPY,
  CSV_TEMPLATE_HEADER,
  CSV_TEMPLATE_EXAMPLE,
  CSV_PREVIEW_ROWS,
} from './setup.constants'
import { cn } from '@/lib/utils'
import type { z } from 'zod'
import type { TBulkImportResult } from './setup.types'

type AddUnitFormValues = z.infer<typeof addUnitSchema>

interface CsvRow {
  code: string
  valid: boolean
}

interface UnitDirectoryStepProps {
  onComplete: (unitCount: number) => void
}

const FIELD_CLASS =
  'h-12 rounded-xl border-0 bg-kmvmt-bg text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/30 focus-visible:bg-kmvmt-white focus-visible:ring-1 focus-visible:ring-kmvmt-navy/20 transition-all'

const LABEL_CLASS = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-kmvmt-navy'

export function UnitDirectoryStep({ onComplete }: UnitDirectoryStepProps) {
  const tenantId = useAuthStore((s) => s.user?.tenantId ?? '')
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv')
  const [manualUnits, setManualUnits] = useState<TUnit[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<CsvRow[]>([])
  const [importResult, setImportResult] = useState<TBulkImportResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addUnit = useAddUnit()
  const bulkImport = useBulkImportUnits()

  const form = useForm<AddUnitFormValues>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: { prefix: '', unit_number: '' },
  })

  const prefix = form.watch('prefix')
  const unitNumber = form.watch('unit_number')
  const previewCode = prefix && unitNumber ? buildUnitCode(prefix, unitNumber) : ''

  const parseCsv = (text: string): CsvRow[] => {
    const lines = text.trim().split('\n')
    const dataLines = lines[0].toLowerCase().includes('code') ? lines.slice(1) : lines
    return dataLines.map((line) => {
      const code = line.split(',')[0]?.trim() ?? ''
      return { code, valid: code.length > 0 }
    })
  }

  const handleCsvFile = (file: File): void => {
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

  const handleDownloadTemplate = (): void => {
    const content = `${CSV_TEMPLATE_HEADER}\n${CSV_TEMPLATE_EXAMPLE}`
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'units-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (): void => {
    if (!csvFile) return
    bulkImport.mutate(
      { tenantId, file: csvFile },
      {
        onSuccess: (result) => {
          setImportResult(result)
          setCsvFile(null)
          setCsvPreview([])
        },
      }
    )
  }

  const handleAddUnit = (values: AddUnitFormValues): void => {
    const code = buildUnitCode(values.prefix, values.unit_number)
    const payload: TAddUnitPayload = { code }
    addUnit.mutate(
      { tenantId, payload },
      {
        onSuccess: (unit) => {
          setManualUnits((prev) => [...prev, unit])
          form.reset()
        },
      }
    )
  }

  const totalUnits = manualUnits.length + (importResult?.imported ?? 0)
  const validCsvRows = csvPreview.filter((r) => r.valid).length

  return (
    <div className="relative overflow-hidden rounded-3xl bg-kmvmt-white p-10 shadow-[0px_20px_60px_rgba(25,38,64,0.08)]">
      {/* Gradient glow — top-right */}
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-br from-kmvmt-navy to-kmvmt-blue-light opacity-[0.05]" />

      {/* Heading */}
      <div className="relative">
        <h2 className="text-3xl font-extrabold tracking-tight text-kmvmt-navy">
          {SETUP_COPY.UNITS_HEADING}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-kmvmt-navy/50">
          {SETUP_COPY.UNITS_SUBTITLE}
        </p>
      </div>

      {/* Segmented control */}
      <div className="relative mt-8 inline-flex rounded-full bg-kmvmt-bg p-1">
        <button
          type="button"
          className={cn(
            'rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all',
            activeTab === 'csv'
              ? 'bg-kmvmt-white text-kmvmt-navy shadow-sm'
              : 'text-kmvmt-navy/40 hover:text-kmvmt-navy'
          )}
          onClick={() => {
            setActiveTab('csv')
          }}
        >
          {SETUP_COPY.UNITS_TAB_CSV}
        </button>
        <button
          type="button"
          className={cn(
            'rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all',
            activeTab === 'manual'
              ? 'bg-kmvmt-white text-kmvmt-navy shadow-sm'
              : 'text-kmvmt-navy/40 hover:text-kmvmt-navy'
          )}
          onClick={() => {
            setActiveTab('manual')
          }}
        >
          {SETUP_COPY.UNITS_TAB_MANUAL}
        </button>
      </div>

      {/* CSV Tab */}
      {activeTab === 'csv' && (
        <div className="relative mt-6 space-y-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-kmvmt-navy/50 transition-colors hover:text-kmvmt-navy"
            >
              <Download className="h-3.5 w-3.5" />
              {SETUP_COPY.UNITS_DOWNLOAD_TEMPLATE}
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
              'flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-kmvmt-bg py-8 ring-1 transition-all',
              isDragging ? 'ring-2 ring-kmvmt-navy' : 'ring-transparent hover:ring-kmvmt-navy/20'
            )}
            aria-label="Upload CSV file"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kmvmt-white text-kmvmt-navy/50">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-kmvmt-navy">
              {csvFile ? csvFile.name : SETUP_COPY.UNITS_CSV_DROP}
            </p>
            {!csvFile && <p className="text-xs text-kmvmt-navy/40">{SETUP_COPY.UNITS_CSV_HINT}</p>}
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

          {/* CSV preview table */}
          {csvPreview.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-kmvmt-bg/50 ring-1 ring-kmvmt-bg">
              <Table>
                <TableHeader>
                  <TableRow className="border-0 bg-kmvmt-bg/70">
                    <TableHead className="px-5 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                      {SETUP_COPY.CSV_COLUMN_CODE}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.slice(0, CSV_PREVIEW_ROWS).map((row, i) => (
                    <TableRow
                      key={i}
                      className={cn(
                        'border-0 border-t border-kmvmt-bg',
                        !row.valid && 'bg-kmvmt-red-dark/5'
                      )}
                    >
                      <TableCell className="px-5 text-sm font-medium text-kmvmt-navy">
                        {row.code}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {csvPreview.length > CSV_PREVIEW_ROWS && (
                <p className="border-t border-kmvmt-bg px-5 py-2 text-[11px] text-kmvmt-navy/40">
                  {SETUP_COPY.CSV_PREVIEW_MORE.replace(
                    '{n}',
                    String(csvPreview.length - CSV_PREVIEW_ROWS)
                  )}
                </p>
              )}
            </div>
          )}

          {csvPreview.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              disabled={bulkImport.isPending || validCsvRows === 0}
              className="w-full rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {bulkImport.isPending
                ? SETUP_COPY.UNITS_IMPORTING
                : SETUP_COPY.UNITS_IMPORT_BUTTON.replace('{n}', String(validCsvRows))}
            </button>
          )}

          {importResult && (
            <div className="space-y-2 rounded-2xl bg-kmvmt-bg p-5 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-kmvmt-navy">
                  {SETUP_COPY.IMPORT_IMPORTED}{' '}
                  <span className="font-bold">{importResult.imported}</span>
                  <span className="text-kmvmt-navy/40"> / {importResult.total}</span>
                </p>
              </div>
              {importResult.skipped > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-kmvmt-navy/40" />
                  <p className="text-kmvmt-navy/60">
                    {SETUP_COPY.IMPORT_SKIPPED} {importResult.skipped}
                  </p>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <ul className="mt-2 space-y-1 pl-6 text-xs text-kmvmt-red-dark">
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
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="relative mt-6 space-y-5">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void form.handleSubmit(handleAddUnit)(e)
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <label className={LABEL_CLASS}>
                        {SETUP_COPY.UNITS_CODE_LABEL.split('/')[0]?.trim() ?? 'Block'}
                      </label>
                      <FormControl>
                        <Input
                          placeholder={
                            SETUP_COPY.UNITS_CODE_PLACEHOLDER.split(',')[0]?.trim() ?? 'A'
                          }
                          className={cn(FIELD_CLASS, 'uppercase placeholder:normal-case')}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit_number"
                  render={({ field }) => (
                    <FormItem>
                      <label className={LABEL_CLASS}>Unit Number</label>
                      <FormControl>
                        <Input
                          placeholder="101"
                          className={FIELD_CLASS}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/[^A-Za-z0-9]/g, ''))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Code preview */}
              {previewCode && (
                <div className="flex items-center justify-between rounded-xl bg-kmvmt-navy px-5 py-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Generated Code
                  </p>
                  <p className="font-mono text-sm font-bold tracking-wide text-white">
                    {previewCode}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={addUnit.isPending}
                className="rounded-xl bg-kmvmt-navy px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-kmvmt-blue-light/80 disabled:opacity-60"
              >
                {addUnit.isPending ? SETUP_COPY.UNITS_ADDING : SETUP_COPY.UNITS_ADD_BUTTON}
              </button>
            </form>
          </Form>

          {manualUnits.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-kmvmt-navy/40">
                {SETUP_COPY.UNITS_COUNT.replace('{n}', String(manualUnits.length))}
              </p>
              <div className="overflow-hidden rounded-2xl bg-kmvmt-bg/50">
                {manualUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between border-b border-kmvmt-bg px-5 py-3 last:border-b-0"
                  >
                    <span className="font-mono text-sm font-semibold text-kmvmt-navy">
                      {unit.code}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove unit ${unit.code}`}
                      onClick={() => {
                        setManualUnits((prev) => prev.filter((u) => u.id !== unit.id))
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-red-light/10 hover:text-kmvmt-red-dark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom actions */}
      <div className="relative mt-8 flex flex-col items-center gap-4 border-t border-kmvmt-bg pt-6">
        <button
          type="button"
          onClick={() => {
            onComplete(totalUnits)
          }}
          disabled={totalUnits === 0 && activeTab === 'manual'}
          className="w-full rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-4px_rgba(25,38,64,0.3)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
        >
          {SETUP_COPY.UNITS_CONTINUE}
        </button>
        <button
          type="button"
          onClick={() => {
            onComplete(totalUnits)
          }}
          className="text-xs font-bold uppercase tracking-wider text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {SETUP_COPY.UNITS_SKIP}
        </button>
      </div>
    </div>
  )
}
