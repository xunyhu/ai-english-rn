import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QueryErrorView } from '@/components/QueryErrorView';

import type { HOME_COPY } from '../constants';
import type { ContinueLearning, DailyEnglish, QuickEntry, StudyProgress, WelcomeInfo } from '../types';
import { ContinueLearningSection } from './ContinueLearningSection';
import { DailyEnglishCard } from './DailyEnglishCard';
import { HomeScreenSkeleton } from './HomeScreenSkeleton';
import { QuickEntryButtons } from './QuickEntryButtons';
import { StudyProgressCard } from './StudyProgressCard';
import { WelcomeHeader } from './WelcomeHeader';

type HomeCopy = typeof HOME_COPY;

type HomeScreenViewProps = {
  welcome: WelcomeInfo;
  copy: HomeCopy;
  quickEntries: QuickEntry[];
  dailyEnglish?: DailyEnglish;
  continueLearning?: ContinueLearning;
  studyProgress?: StudyProgress;
  isLoading: boolean;
  dailyEnglishError?: unknown;
  onRetryDailyEnglish?: () => void;
  isPlaying: boolean;
  isPlayLoading: boolean;
  isFavorited: boolean;
  onPlayAudio: () => void;
  onToggleFavorite: () => void;
  onNavigate: (route: QuickEntry['route'] | ContinueLearning['route']) => void;
};

export function HomeScreenView({
  welcome,
  copy,
  quickEntries,
  dailyEnglish,
  continueLearning,
  studyProgress,
  isLoading,
  dailyEnglishError,
  onRetryDailyEnglish,
  isPlaying,
  isPlayLoading,
  isFavorited,
  onPlayAudio,
  onToggleFavorite,
  onNavigate,
}: HomeScreenViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-4"
        showsVerticalScrollIndicator={false}>
        <WelcomeHeader {...welcome} />

        {dailyEnglishError ? (
          <QueryErrorView
            error={dailyEnglishError}
            message="Could not load today's sentence."
            onRetry={onRetryDailyEnglish}
          />
        ) : null}

        {isLoading ? (
          <HomeScreenSkeleton />
        ) : (
          <>
            {dailyEnglish && !dailyEnglishError ? (
              <DailyEnglishCard
                label={copy.dailyEnglishLabel}
                sentence={dailyEnglish}
                playLabel={copy.playAudioLabel}
                playingLabel={copy.playingAudioLabel}
                favoriteLabel={copy.favoriteLabel}
                isPlaying={isPlaying}
                isPlayLoading={isPlayLoading}
                isFavorited={isFavorited}
                onPlayAudio={onPlayAudio}
                onToggleFavorite={onToggleFavorite}
              />
            ) : null}

            {continueLearning ? (
              <ContinueLearningSection
                title={copy.continueLearningTitle}
                item={continueLearning}
                onContinue={() => onNavigate(continueLearning.route)}
              />
            ) : null}

            <QuickEntryButtons
              title={copy.quickEntryTitle}
              entries={quickEntries}
              onPressEntry={onNavigate}
            />

            {studyProgress ? (
              <StudyProgressCard
                title={copy.studyProgressTitle}
                progress={studyProgress}
                minutesLabel={copy.minutesLabel}
                streakLabel={copy.streakLabel}
                wordsLabel={copy.wordsLabel}
                weeklyGoalLabel={copy.weeklyGoalLabel}
              />
            ) : null}
          </>
        )}

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
