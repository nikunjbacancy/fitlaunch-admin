import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { supportService } from './supportService'
import type { TicketFilters, TicketStatus } from './support.types'

const QUERY_KEY = ['support-tickets'] as const

export function useSupportTickets(filters: TicketFilters, page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters, page],
    queryFn: () => supportService.getAll(filters, page),
    staleTime: 30_000,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      supportService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Ticket status updated')
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
