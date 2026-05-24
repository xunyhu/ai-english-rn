import { useQuery } from '@tanstack/react-query';

import { fetchDailyEnglish } from '@/services';

export const dailyEnglishQueryKey = ['daily-english'] as const;

export function useDailyEnglish() {
  return useQuery({
    queryKey: dailyEnglishQueryKey,
    queryFn: fetchDailyEnglish,
    staleTime: 1000 * 60 * 60 * 12,
    retry: 1,
  });
}
