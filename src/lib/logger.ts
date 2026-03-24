const isDev = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) console.log('[FitLaunch]', ...args)
  },
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn('[FitLaunch]', ...args)
  },
  error: (...args: unknown[]): void => {
    // Always log errors — even in production
    console.error('[FitLaunch]', ...args)
  },
  info: (...args: unknown[]): void => {
    if (isDev) console.info('[FitLaunch]', ...args)
  },
}
