import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { ContinueLearning, QuickEntry } from '../types';

export function useHomeNavigation() {
  const router = useRouter();

  const navigateTo = useCallback(
    (route: QuickEntry['route'] | ContinueLearning['route']) => {
      router.push(route);
    },
    [router],
  );

  return { navigateTo };
}
