import { QueryClient } from '@tanstack/react-query'
import { logger } from './logger'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (
          error instanceof Error &&
          'status' in error &&
          typeof error.status === 'number' &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation error:', error)
      },
    },
  },
})
