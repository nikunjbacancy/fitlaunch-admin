import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { logger } from './logger'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

// In-memory access token — never stored in localStorage
let accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

// Track if a token refresh is in progress to avoid parallel refresh calls
let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = []

function processQueue(error: Error | null, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token ?? '')
    }
  })
  failedQueue = []
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send httpOnly refresh token cookie automatically
})

// Request interceptor — attach access token + log
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase() ?? 'GET'
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    logger.info(`→ ${method} ${url}`, {
      params: config.params as unknown,
      data: config.data as unknown,
      authorized: !!config.headers.Authorization,
    })
    return config
  },
  (error: unknown) => {
    logger.error('Request interceptor error:', error)
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  }
)

// Response interceptor — log + handle 401 + token refresh
apiClient.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase() ?? 'GET'

    logger.info(
      `← ${String(response.status)} ${method} ${response.config.url ?? ''}`,
      response.data
    )
    return response
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (axios.isAxiosError(error)) {
      const method = originalRequest.method?.toUpperCase() ?? 'GET'

      logger.error(
        `← ${String(error.response?.status ?? 0)} ${method} ${originalRequest.url ?? ''}`,
        error.response?.data
      )
    }

    // Never attempt token refresh for auth endpoints — a 401 there is a real auth failure
    const isAuthEndpoint = originalRequest.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue request until refresh completes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Refresh token is sent automatically via httpOnly cookie
        const response = await axios.post<{ success: boolean; data: { access_token: string } }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = response.data.data.access_token
        setAccessToken(newToken)
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        const retried = await apiClient(originalRequest)
        return retried
      } catch (refreshError) {
        const err = refreshError instanceof Error ? refreshError : new Error(String(refreshError))
        processQueue(err, null)
        setAccessToken(null)
        window.location.href = '/login'
        throw err
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  }
)
