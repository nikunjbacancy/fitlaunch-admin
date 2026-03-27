import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Download, FileSpreadsheet, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { addUnitSchema, type TUnit, type TAddUnitPayload } from './setup.types'
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
  building: string
  block: string
  unit_number: string
  valid: boolean
}

interface UnitDirectoryStepProps {
  onComplete: (unitCount: number) => void
}

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
    defaultValues: { building: '', block: '', unit_number: '' },
  })

  const parseCsv = (text: string): CsvRow[] => {
    const lines = text.trim().split('\n')
    const dataLines = lines[0].toLowerCase().includes('building') ? lines.slice(1) : lines
    return dataLines.map((line) => {
      const cols = line.split(',').map((c) => c.trim())
      return {
        building: cols[0] ?? '',
        block: cols[1] ?? '',
        unit_number: cols[2] ?? '',
        valid: Boolean(cols[0] && cols[2]),
      }
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

  const handleAddUnit = (values: AddUnitFormValues) => {
    const payload: TAddUnitPayload = {
      building: values.building,
      unit_number: values.unit_number,
      ...(values.block ? { block: values.block } : {}),
    }
    addUnit.mutate(
      { tenantId, payload },
      {
        onSuccess: (unit) => {
          setManualUnits((prev) => [
            ...prev,
            {
              ...unit,
              building: unit.building || values.building,
              block: unit.block ?? values.block ?? null,
              unit_number: unit.unit_number || values.unit_number,
            },
          ])
          form.reset()
        },
      }
    )
  }

  const totalUnits = manualUnits.length + (importResult?.imported ?? 0)
  const validCsvRows = csvPreview.filter((r) => r.valid).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-kmvmt-navy">{SETUP_COPY.UNITS_HEADING}</h2>
        <p className="text-sm text-zinc-500">{SETUP_COPY.UNITS_SUBTITLE}</p>
      </div>

      {/* Segmented control */}
      <div className="inline-flex rounded-full bg-zinc-100 p-1">
        <button
          type="button"
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
            activeTab === 'csv'
              ? 'bg-kmvmt-white text-kmvmt-navy shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
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
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
            activeTab === 'manual'
              ? 'bg-kmvmt-white text-kmvmt-navy shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
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
        <div className="space-y-4">
          {/* Template download link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1 text-xs text-kmvmt-blue-light hover:text-kmvmt-navy transition-colors"
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
              'flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors',
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
                SETUP_COPY.UNITS_CSV_DROP
              )}
            </p>
            {!csvFile && <p className="text-xs text-zinc-400">{SETUP_COPY.UNITS_CSV_HINT}</p>}
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
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-kmvmt-bg border-zinc-200">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-kmvmt-navy">
                      {SETUP_COPY.CSV_COLUMN_BUILDING}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-kmvmt-navy">
                      {SETUP_COPY.CSV_COLUMN_BLOCK}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-kmvmt-navy">
                      {SETUP_COPY.CSV_COLUMN_UNIT}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.slice(0, CSV_PREVIEW_ROWS).map((row, i) => (
                    <TableRow key={i} className={!row.valid ? 'bg-red-50' : ''}>
                      <TableCell className="text-sm text-kmvmt-navy">{row.building}</TableCell>
                      <TableCell className="text-sm text-kmvmt-navy">{row.block}</TableCell>
                      <TableCell className="text-sm text-kmvmt-navy">{row.unit_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {csvPreview.length > CSV_PREVIEW_ROWS && (
                <p className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400">
                  {SETUP_COPY.CSV_PREVIEW_MORE.replace(
                    '{n}',
                    String(csvPreview.length - CSV_PREVIEW_ROWS)
                  )}
                </p>
              )}
            </div>
          )}

          {/* Import button */}
          {csvPreview.length > 0 && (
            <Button
              className="h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
              onClick={handleImport}
              disabled={bulkImport.isPending || validCsvRows === 0}
            >
              {bulkImport.isPending
                ? SETUP_COPY.UNITS_IMPORTING
                : SETUP_COPY.UNITS_IMPORT_BUTTON.replace('{n}', String(validCsvRows))}
            </Button>
          )}

          {/* Import result */}
          {importResult && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm space-y-1">
              <p className="text-zinc-700">
                {SETUP_COPY.IMPORT_IMPORTED}{' '}
                <span className="font-semibold text-kmvmt-navy">{importResult.imported}</span>
                <span className="text-zinc-400"> / {importResult.total}</span>
              </p>
              {importResult.skipped > 0 && (
                <p className="text-zinc-400">
                  {SETUP_COPY.IMPORT_SKIPPED} {importResult.skipped}
                </p>
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
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void form.handleSubmit(handleAddUnit)(e)
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel
                        htmlFor="unit_building"
                        className="text-xs font-medium text-zinc-700"
                      >
                        {SETUP_COPY.UNITS_BUILDING_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="unit_building"
                          placeholder={SETUP_COPY.UNITS_BUILDING_PLACEHOLDER}
                          className="h-10 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel htmlFor="unit_block" className="text-xs font-medium text-zinc-700">
                        {SETUP_COPY.UNITS_BLOCK_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="unit_block"
                          placeholder={SETUP_COPY.UNITS_BLOCK_PLACEHOLDER}
                          className="h-10 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                          {...field}
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
                    <FormItem className="space-y-1.5">
                      <FormLabel
                        htmlFor="unit_number"
                        className="text-xs font-medium text-zinc-700"
                      >
                        {SETUP_COPY.UNITS_NUMBER_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="unit_number"
                          placeholder={SETUP_COPY.UNITS_NUMBER_PLACEHOLDER}
                          className="h-10 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
                disabled={addUnit.isPending}
              >
                {addUnit.isPending ? SETUP_COPY.UNITS_ADDING : SETUP_COPY.UNITS_ADD_BUTTON}
              </Button>
            </form>
          </Form>

          {/* Manual units list */}
          {manualUnits.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500">
                {SETUP_COPY.UNITS_COUNT.replace('{n}', String(manualUnits.length))}
              </p>
              <div>
                {manualUnits.map((unit, index) => (
                  <div
                    key={unit.id}
                    className={cn(
                      'flex items-center justify-between py-2.5',
                      index < manualUnits.length - 1 && 'border-b border-zinc-100'
                    )}
                  >
                    <span className="text-sm text-kmvmt-navy">
                      {unit.building}
                      {unit.block ? ` / ${unit.block}` : ''} / {unit.unit_number}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove unit ${unit.unit_number}`}
                      className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setManualUnits((prev) => prev.filter((u) => u.id !== unit.id))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom actions */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={() => {
            onComplete(totalUnits)
          }}
          disabled={totalUnits === 0 && activeTab === 'manual'}
          className="h-11 w-full bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80 font-semibold"
        >
          {SETUP_COPY.UNITS_CONTINUE}
        </Button>
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={() => {
              onComplete(totalUnits)
            }}
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {SETUP_COPY.UNITS_SKIP}
          </button>
        </div>
      </div>
    </div>
  )
}
