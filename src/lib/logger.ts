const isDev = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) console.log('[KMVMT]', ...args)
  },
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn('[KMVMT]', ...args)
  },
  error: (...args: unknown[]): void => {
    // Always log errors — even in production
    console.error('[KMVMT]', ...args)
  },
  info: (...args: unknown[]): void => {
    if (isDev) console.info('[KMVMT]', ...args)
  },
}
