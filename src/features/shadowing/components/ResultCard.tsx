import { Text, View } from 'react-native';

import { AppButton, AppButtonRow, AppCard } from '@/components';

import type { SHADOWING_COPY } from '../constants';
import type { ShadowingResult } from '../types';

type ShadowingCopy = typeof SHADOWING_COPY;

type ResultCardProps = {
  copy: ShadowingCopy;
  result: ShadowingResult;
  onNextSentence: () => void;
  onTryAgain: () => void;
};

function scoreColor(score: number): string {
  if (score >= 88) return 'text-emerald-400';
  if (score >= 75) return 'text-amber-400';
  return 'text-orange-400';
}

export function ResultCard({ copy, result, onNextSentence, onTryAgain }: ResultCardProps) {
  return (
    <AppCard variant="accent" title={copy.resultTitle} className="mt-5">
      <View className="flex-row items-end gap-2">
        <Text className={`text-4xl font-bold ${scoreColor(result.accuracyScore)}`}>
          {result.accuracyScore}
        </Text>
        <Text className="mb-1 text-lg text-neutral-500">%</Text>
        <Text className="mb-1.5 ml-1 text-sm text-neutral-500">{copy.accuracyLabel}</Text>
      </View>

      <View className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
        <View
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${result.accuracyScore}%` }}
        />
      </View>

      <AppCard variant="default" className="mt-4 !p-3" contentClassName="!mt-0">
        <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {copy.feedbackLabel}
        </Text>
        <Text className="text-sm leading-5 text-neutral-300">{result.feedback}</Text>
      </AppCard>

      <AppButtonRow className="mt-4">
        <AppButton
          label={copy.tryAgainLabel}
          onPress={onTryAgain}
          variant="secondary"
          fullWidth
          className="flex-1"
        />
        <AppButton
          label={copy.nextSentenceLabel}
          onPress={onNextSentence}
          variant="primary"
          fullWidth
          className="flex-1"
        />
      </AppButtonRow>
    </AppCard>
  );
}
