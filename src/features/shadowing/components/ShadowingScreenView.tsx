import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppCard, ScreenLayout } from '@/components';

import type { SHADOWING_COPY } from '../constants';
import type { ShadowingResult, ShadowingSentence } from '../types';
import { ResultCard } from './ResultCard';
import { SentenceCard } from './SentenceCard';
import { ShadowingControls } from './ShadowingControls';
import { WaveformPlaceholder } from './WaveformPlaceholder';

type ShadowingCopy = typeof SHADOWING_COPY;

type ShadowingScreenViewProps = {
  copy: ShadowingCopy;
  sentence?: ShadowingSentence;
  result: ShadowingResult | null;
  isLoadingSentence: boolean;
  isEvaluating: boolean;
  isPlaying: boolean;
  isPlayLoading: boolean;
  isRecording: boolean;
  waveActive: boolean;
  error: string | null;
  canPlay: boolean;
  canRecord: boolean;
  onPlay: () => void;
  onToggleRecord: () => void;
  onNextSentence: () => void;
  onTryAgain: () => void;
  clearError: () => void;
};

export function ShadowingScreenView({
  copy,
  sentence,
  result,
  isLoadingSentence,
  isEvaluating,
  isPlaying,
  isPlayLoading,
  isRecording,
  waveActive,
  error,
  canPlay,
  canRecord,
  onPlay,
  onToggleRecord,
  onNextSentence,
  onTryAgain,
  clearError,
}: ShadowingScreenViewProps) {
  return (
    <ScreenLayout title={copy.headerTitle} subtitle={copy.headerSubtitle} edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-4"
        showsVerticalScrollIndicator={false}>
        {error ? (
          <AppCard variant="danger" className="mb-4 !p-3">
            <Pressable onPress={clearError} className="active:opacity-70">
              <Text className="text-sm leading-5 text-rose-200">{error}</Text>
            </Pressable>
          </AppCard>
        ) : null}

        <SentenceCard copy={copy} sentence={sentence} isLoading={isLoadingSentence} />

        <View className="mt-5">
          <WaveformPlaceholder active={waveActive} />
          <Text className="mt-2 text-center text-xs text-neutral-600">{copy.waveHint}</Text>
        </View>

        <ShadowingControls
          copy={copy}
          isPlaying={isPlaying}
          isPlayLoading={isPlayLoading}
          isRecording={isRecording}
          isEvaluating={isEvaluating}
          canPlay={canPlay}
          canRecord={canRecord}
          onPlay={onPlay}
          onToggleRecord={onToggleRecord}
        />

        {result ? (
          <ResultCard
            copy={copy}
            result={result}
            onNextSentence={onNextSentence}
            onTryAgain={onTryAgain}
          />
        ) : null}
      </ScrollView>
    </ScreenLayout>
  );
}
