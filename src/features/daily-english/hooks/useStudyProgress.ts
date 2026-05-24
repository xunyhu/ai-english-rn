import { useQuery } from '@tanstack/react-query';

import { fetchContinueLearning, fetchStudyProgress } from '@/services';

export const continueLearningQueryKey = ['continue-learning'] as const;
export const studyProgressQueryKey = ['study-progress'] as const;

export function useContinueLearning() {
  return useQuery({
    queryKey: continueLearningQueryKey,
    queryFn: fetchContinueLearning,
  });
}

export function useStudyProgress() {
  return useQuery({
    queryKey: studyProgressQueryKey,
    queryFn: fetchStudyProgress,
  });
}
