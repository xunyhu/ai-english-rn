import { useQuery } from '@tanstack/react-query';

import { fetchShadowingSentence } from '../services/shadowing-api';

export const shadowingSentenceQueryKey = ['shadowing-sentence'] as const;

export function useShadowingSentence(enabled = true) {
  return useQuery({
    queryKey: shadowingSentenceQueryKey,
    queryFn: fetchShadowingSentence,
    enabled,
  });
}
