import { useMemo } from 'react';

import { useUserStore } from '@/store';

import { HOME_COPY, QUICK_ENTRIES } from '../constants';
import { useDailyEnglishActions } from './useDailyEnglishActions';
import { useDailyEnglish } from './useDailyEnglish';
import { useHomeNavigation } from './useHomeNavigation';
import { useContinueLearning, useStudyProgress } from './useStudyProgress';
import type { WelcomeInfo } from '../types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function useHomeScreen() {
  const displayName = useUserStore((state) => state.displayName);
  const dailyEnglishQuery = useDailyEnglish();
  const continueLearningQuery = useContinueLearning();
  const studyProgressQuery = useStudyProgress();
  const { navigateTo } = useHomeNavigation();

  const sentenceId = dailyEnglishQuery.data?.id;
  const audioActions = useDailyEnglishActions(sentenceId, dailyEnglishQuery.data?.english);

  const welcome: WelcomeInfo = useMemo(
    () => ({
      greeting: getGreeting(),
      displayName,
      subtitle: 'Ready for today’s English practice?',
    }),
    [displayName],
  );

  const isLoading =
    dailyEnglishQuery.isLoading ||
    continueLearningQuery.isLoading ||
    studyProgressQuery.isLoading;

  return {
    welcome,
    copy: HOME_COPY,
    quickEntries: QUICK_ENTRIES,
    dailyEnglish: dailyEnglishQuery.data,
    continueLearning: continueLearningQuery.data,
    studyProgress: studyProgressQuery.data,
    isLoading,
    dailyEnglishError: dailyEnglishQuery.isError ? dailyEnglishQuery.error : null,
    refetchDailyEnglish: dailyEnglishQuery.refetch,
    navigateTo,
    ...audioActions,
  };
}
