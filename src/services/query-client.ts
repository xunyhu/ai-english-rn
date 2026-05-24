import { QueryClient } from '@tanstack/react-query';

import { isAbortError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: (failureCount, error) => {
        if (isAbortError(error)) return false;
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated' && event.action.type === 'error') {
    logger.error('[query]', event.query.queryKey, event.action.error);
  }
});
