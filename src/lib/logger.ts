import { env } from '@/config/env';

function log(method: 'log' | 'warn' | 'error', ...args: unknown[]): void {
  if (method === 'error' || env.isDev) {
    console[method](...args);
  }
}

export const logger = {
  debug: (...args: unknown[]) => log('log', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};
