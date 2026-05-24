import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import { validateEnv } from '@/config/env';
import { logger } from '@/lib/logger';
import { queryClient } from '@/services';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const { valid, missing } = validateEnv();
    if (!valid) {
      logger.warn(
        `Missing environment variable(s): ${missing.join(', ')}. Copy .env.example to .env before using AI features.`,
      );
    }
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
